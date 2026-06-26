import { NextRequest, NextResponse } from "next/server";

// force-static satisfies Next.js 16 output:'export' requirement for Capacitor builds.
export const dynamic = "force-static";

const SYSTEM_PROMPT = `You are WIZL - a friendly, knowledgeable cannabis strain identification assistant.

When given an image of cannabis (jar, package, bud, label) or a text description, identify the strain and provide detailed information.

Use the web_search tool for every request to ground your answer in real strain data where possible (Leafly, Weedmaps, SeedFinder, breeder sites). Search for the strain name + "strain" to pull genetics, THC/CBD ranges, effects, flavors, and terpenes. If the input is ambiguous, say so through the confidence field and avoid inventing exact numbers.

Respond ONLY with a single JSON object in this exact format (no prose before or after):
{
  "name": "Strain Name",
  "confidence": "high" | "medium" | "low",
  "type": "sativa" | "indica" | "hybrid",
  "thc_range": "20-25%",
  "cbd_range": "0.1-0.5%",
  "effects": ["Effect1", "Effect2", "Effect3", "Effect4"],
  "flavors": ["Flavor1", "Flavor2", "Flavor3"],
  "description": "A friendly, conversational 2-3 sentence description of the strain. Be informative but fun.",
  "best_for": "One sentence about the ideal use case / vibe",
  "similar_strains": ["Strain1", "Strain2", "Strain3"]
}

If you cannot identify the strain with certainty:
- Make your best educated guess based on search results
- Set confidence to "low" or "medium"
- Explain in the description what you're seeing and why you made this guess

Be friendly, knowledgeable, and helpful. Like a budtender who really knows their stuff.`;

const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  th: "Thai",
  es: "Spanish",
  de: "German",
  fr: "French",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese (Simplified)",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, description, locale } = body as {
      image?: string;
      description?: string;
      locale?: string;
    };

    if (!image && !description) {
      return NextResponse.json(
        { error: "Please provide an image or description" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // In local/dev fallback mode, keep the user-entered strain name instead of
    // pretending every unknown input is OG Kush.
    if (!apiKey) {
      return NextResponse.json(buildFallbackResult(description));
    }

    const content: Array<
      | { type: "input_text"; text: string }
      | { type: "input_image"; image_url: string }
    > = [];

    if (image) {
      content.push({ type: "input_image", image_url: image });
      content.push({
        type: "input_text",
        text: "Identify this cannabis strain from the image. Respond in the JSON format specified.",
      });
    } else if (description) {
      content.push({
        type: "input_text",
        text: `Identify this cannabis strain based on the following description: "${description}". Respond in the JSON format specified.`,
      });
    }

    const languageInstruction =
      locale && locale !== "en"
        ? `\n\nIMPORTANT: Respond with ALL text values (description, effects, flavors, best_for) in ${LANGUAGE_MAP[locale] || locale}. Keep strain names and type in English, but translate everything else.`
        : "";

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_SCAN_MODEL || "gpt-4.1-mini",
        max_output_tokens: 2048,
        instructions: SYSTEM_PROMPT + languageInstruction,
        tools: [{ type: "web_search_preview" }],
        input: [{ role: "user", content }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI scan API error:", error);
      return NextResponse.json(
        { error: "AI scan failed. Please try again." },
        { status: 500 },
      );
    }

    const data = await response.json();
    const finalText = extractOpenAIText(data);
    const jsonMatch = finalText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      try {
        const result = JSON.parse(jsonMatch[0]);
        cleanCitations(result);
        return NextResponse.json(result);
      } catch (e) {
        console.error("JSON parse error:", e, finalText.slice(0, 500));
      }
    }

    return NextResponse.json(
      { error: "Could not parse AI response" },
      { status: 500 },
    );
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

function extractOpenAIText(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const root = data as Record<string, unknown>;
  if (typeof root.output_text === "string") return root.output_text.trim();

  const chunks: string[] = [];
  const output = root.output;
  if (Array.isArray(output)) {
    for (const item of output) {
      if (!item || typeof item !== "object") continue;
      const content = (item as Record<string, unknown>).content;
      if (!Array.isArray(content)) continue;
      for (const block of content) {
        if (!block || typeof block !== "object") continue;
        const text = (block as Record<string, unknown>).text;
        if (typeof text === "string") chunks.push(text);
      }
    }
  }

  return chunks.join("\n").trim();
}

function stripCiteTags(input: string): string {
  return input
    .replace(/<cite[^>]*>([\s\S]*?)<\/cite>/gi, "$1")
    .replace(/<\/?[a-z][^>]*>/gi, "")
    .replace(/\[\d+(?:[-,\s]\d+)*\]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cleanCitations(obj: any): void {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    const v = obj[key];
    if (typeof v === "string") {
      obj[key] = stripCiteTags(v);
    } else if (Array.isArray(v)) {
      obj[key] = v.map((item) =>
        typeof item === "string" ? stripCiteTags(item) : item,
      );
    } else if (v && typeof v === "object") {
      cleanCitations(v);
    }
  }
}

function buildFallbackResult(description?: string) {
  const name = description ? guessFromDescription(description) : "Unknown Strain";
  const lower = description?.toLowerCase() || "";

  return {
    name,
    confidence: "low",
    type: inferFallbackType(lower),
    thc_range: "Unknown",
    cbd_range: "Unknown",
    effects: inferFallbackEffects(lower),
    flavors: inferFallbackFlavors(lower),
    description:
      name === "Unknown Strain"
        ? "WIZL could not reach the AI scanner, so this is a local fallback result. Add an image or a clearer strain name and try again when the scan service is configured."
        : `WIZL read this as ${name}, but the AI scanner is not configured on this deployment yet. Treat this as a local fallback result, not a verified strain profile.`,
    best_for: "Use the full AI scan for a verified profile before making decisions.",
    similar_strains: [],
    _demo: true,
  };
}

function guessFromDescription(desc: string): string {
  const lower = desc.toLowerCase();
  if (lower.includes("cookie") || lower.includes("oreo")) return "Girl Scout Cookies";
  if (lower.includes("purple") || lower.includes("grape")) return "Purple Haze";
  if (lower.includes("lemon") || lower.includes("citrus")) return "Lemon Haze";
  if (lower.includes("blue") || lower.includes("berry")) return "Blue Dream";
  if (lower.includes("diesel") || lower.includes("fuel")) return "Sour Diesel";
  if (lower.includes("pine") || lower.includes("wood")) return "Jack Herer";
  if (lower.includes("tropical") || lower.includes("pineapple")) return "Pineapple Express";
  if (lower.includes("cream") || lower.includes("gelato")) return "Gelato";

  const cleaned = desc
    .replace(
      /\b(?:strain|sort|\u0441\u043e\u0440\u0442|identify|scan|again|please|what is|tell me about)\b/gi,
      " ",
    )
    .replace(/[^\p{L}\p{N}\s#-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  return titleCaseStrain(cleaned) || "Unknown Strain";
}

function titleCaseStrain(value: string): string {
  const knownUpper = new Set(["og", "gsc", "cbd", "thc", "ak", "gg"]);
  return value
    .split(" ")
    .map((word) => {
      const lower = word.toLowerCase();
      if (knownUpper.has(lower)) return lower.toUpperCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function inferFallbackType(lower: string): "sativa" | "indica" | "hybrid" {
  if (lower.includes("sativa")) return "sativa";
  if (lower.includes("indica")) return "indica";
  return "hybrid";
}

function inferFallbackEffects(lower: string): string[] {
  if (lower.includes("sleep") || lower.includes("night") || lower.includes("indica")) {
    return ["Relaxed", "Sleepy", "Calm", "Mellow"];
  }
  if (lower.includes("sativa") || lower.includes("haze")) {
    return ["Uplifted", "Focused", "Creative", "Energetic"];
  }
  return ["Balanced", "Curious", "Mellow", "Uplifted"];
}

function inferFallbackFlavors(lower: string): string[] {
  const flavors: string[] = [];
  if (lower.includes("cherry")) flavors.push("Cherry");
  if (lower.includes("lemon") || lower.includes("citrus")) flavors.push("Citrus");
  if (lower.includes("blue") || lower.includes("berry")) flavors.push("Berry");
  if (lower.includes("diesel") || lower.includes("fuel")) flavors.push("Diesel");
  if (lower.includes("pine")) flavors.push("Pine");
  if (lower.includes("cream") || lower.includes("cake") || lower.includes("gelato")) {
    flavors.push("Creamy");
  }
  return [...flavors, "Sweet", "Herbal"].slice(0, 3);
}
