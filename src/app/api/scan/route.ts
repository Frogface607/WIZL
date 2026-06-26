import { NextRequest, NextResponse } from "next/server";

// force-static satisfies Next.js 16 output:'export' requirement for Capacitor builds.
export const dynamic = "force-static";

const SYSTEM_PROMPT = `You are WIZL — a friendly, knowledgeable cannabis strain identification assistant.

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
  th: "Thai (ภาษาไทย)",
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
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // If no API key, return mock data for demo
    if (!apiKey) {
      return NextResponse.json({
        name: description
          ? guessFromDescription(description)
          : "Unknown Strain",
        confidence: "medium",
        type: "hybrid",
        thc_range: "18-24%",
        cbd_range: "0.1-0.3%",
        effects: ["Relaxed", "Happy", "Creative", "Uplifted"],
        flavors: ["Earthy", "Sweet", "Citrus"],
        description:
          "Based on what you described, this looks like a well-balanced hybrid. The flavor profile suggests a modern cross with some classic genetics. Great for an evening session.",
        best_for: "Chilling with friends, creative projects, or just vibing",
        similar_strains: ["Blue Dream", "Gelato", "Wedding Cake"],
        _demo: true,
      });
    }

    // Build input for OpenAI Responses API.
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

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_SCAN_MODEL || "gpt-4.1-mini",
        max_output_tokens: 2048,
        instructions: SYSTEM_PROMPT + (locale && locale !== "en"
          ? `\n\nIMPORTANT: Respond with ALL text values (description, effects, flavors, best_for) in ${LANGUAGE_MAP[locale] || locale}. Keep strain names and type in English, but translate everything else.`
          : ""),
        tools: [
          {
            type: "web_search_preview",
          },
        ],
        input: [{ role: "user", content }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI scan API error:", error);
      return NextResponse.json(
        { error: "AI scan failed. Please try again." },
        { status: 500 }
      );
    }

    const data = await response.json();

    const finalText = extractOpenAIText(data);

    const jsonMatch = finalText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const result = JSON.parse(jsonMatch[0]);
        // Strip citations or source tags that search tools may leave in prose.
        cleanCitations(result);
        return NextResponse.json(result);
      } catch (e) {
        console.error("JSON parse error:", e, finalText.slice(0, 500));
      }
    }

    return NextResponse.json(
      { error: "Could not parse AI response" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
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

/** Remove citation markup that search-enabled AI responses may embed in prose. */
function stripCiteTags(input: string): string {
  return input
    // <cite index="...">inner</cite> → inner
    .replace(/<cite[^>]*>([\s\S]*?)<\/cite>/gi, "$1")
    // Drop any other stray search/source tags.
    .replace(/<\/?[a-z][^>]*>/gi, "")
    // Numeric inline refs like [1] [2-5]
    .replace(/\[\d+(?:[-,\s]\d+)*\]/g, "")
    // Collapse double spaces and stray whitespace
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Deep-clean string fields in the scan result object in place. */
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
  return "OG Kush";
}
