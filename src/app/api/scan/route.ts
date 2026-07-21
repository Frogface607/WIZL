import { NextRequest, NextResponse } from "next/server";
import {
  consumeRateLimit,
  getClientIdentifier,
  type RateLimitResult,
} from "@/lib/server-rate-limit";

export const dynamic = "force-static";

const DAY_MS = 24 * 60 * 60 * 1000;
const PROVIDER_TIMEOUT_MS = 30_000;
const OPENAI_BACKOFF_MS = 5 * 60 * 1000;
const MAX_IMAGE_CHARACTERS = 8_000_000;
const MAX_DESCRIPTION_LENGTH = 1_000;

let openAiBackoffUntil = 0;

const SYSTEM_PROMPT = [
  "You are WIZL, a cautious cannabis label reader and strain-reference guide for adults.",
  "",
  "Your job is label-assisted lookup, not visual cultivar identification.",
  "- Read visible package, jar, or label text first.",
  "- A photo of flower alone cannot prove a strain name, genetics, type, THC, CBD, effects, or quality.",
  "- If no identifying name or legible label is present, return name Unidentified flower, type unknown, confidence low, and Unknown for THC/CBD.",
  "- Never invent exact potency, batch data, breeder, genetics, or lab results.",
  "- Named strains vary by producer and batch. Present THC/CBD and effects only as general reference ranges, never as measurements of the item shown.",
  "- Do not mention medical conditions, symptom relief, treatment, time of day, activities, or a recommended occasion for use.",
  "- Effects must be neutral single adjectives such as relaxed, uplifted, focused, or sleepy.",
  "- best_for must say: Compare the producer, batch, package label, and your own field notes.",
  "",
  "Return the requested JSON object.",
  "confidence must be high, medium, or low.",
  "type must be sativa, indica, hybrid, or unknown.",
  "effects and flavors must be short arrays of commonly reported reference terms.",
  "best_for must be a neutral clue to notice or verify, not a consumption recommendation.",
  "similar_strains must be empty when identity is uncertain.",
].join("\n");

const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string" },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
    type: { type: "string", enum: ["sativa", "indica", "hybrid", "unknown"] },
    thc_range: { type: "string" },
    cbd_range: { type: "string" },
    effects: { type: "array", items: { type: "string" } },
    flavors: { type: "array", items: { type: "string" } },
    description: { type: "string" },
    best_for: { type: "string" },
    similar_strains: { type: "array", items: { type: "string" } },
  },
  required: [
    "name",
    "confidence",
    "type",
    "thc_range",
    "cbd_range",
    "effects",
    "flavors",
    "description",
    "best_for",
    "similar_strains",
  ],
};

const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  th: "Thai",
};

type ScanProvider = "openai" | "openrouter";

type ProviderResponse = {
  ok: boolean;
  status: number;
  text: string;
  error: string;
};

export async function POST(request: NextRequest) {
  const rate = consumeRateLimit({
    namespace: "scan",
    key: getClientIdentifier(request.headers),
    limit: 12,
    windowMs: DAY_MS,
  });

  if (!rate.allowed) {
    return withRateHeaders(
      NextResponse.json(
        { error: "Too many AI reads from this network. Please try again later." },
        { status: 429 },
      ),
      rate,
    );
  }

  try {
    const body = await request.json();
    const { image, description, locale } = body as {
      image?: string;
      description?: string;
      locale?: string;
    };
    const cleanDescription =
      typeof description === "string" ? description.trim() : "";
    const cleanImage = typeof image === "string" ? image.trim() : "";

    if (!cleanImage && !cleanDescription) {
      return withRateHeaders(
        NextResponse.json(
          { error: "Please provide a label image or strain name." },
          { status: 400 },
        ),
        rate,
      );
    }

    if (cleanImage.length > MAX_IMAGE_CHARACTERS) {
      return withRateHeaders(
        NextResponse.json(
          { error: "Prepared image is too large. Try a smaller photo." },
          { status: 413 },
        ),
        rate,
      );
    }

    if (
      cleanImage &&
      !/^data:image\/(?:jpeg|png|webp);base64,/i.test(cleanImage)
    ) {
      return withRateHeaders(
        NextResponse.json(
          { error: "Image must be a prepared JPEG, PNG, or WebP data image." },
          { status: 400 },
        ),
        rate,
      );
    }

    if (cleanDescription.length > MAX_DESCRIPTION_LENGTH) {
      return withRateHeaders(
        NextResponse.json(
          { error: "Description is too long." },
          { status: 400 },
        ),
        rate,
      );
    }

    const language =
      LANGUAGE_MAP[typeof locale === "string" ? locale : ""] || "English";
    const preferredProvider =
      process.env.WIZL_SCAN_PROVIDER === "openrouter"
        ? "openrouter"
        : "openai";
    const providers: ScanProvider[] =
      preferredProvider === "openrouter"
        ? ["openrouter", "openai"]
        : ["openai", "openrouter"];

    for (const provider of providers) {
      let response: ProviderResponse | null = null;

      if (
        provider === "openai" &&
        process.env.OPENAI_API_KEY &&
        Date.now() >= openAiBackoffUntil
      ) {
        response = await callOpenAI({
          image: cleanImage || undefined,
          description: cleanDescription,
          language,
        });
        if (response.status === 429) {
          openAiBackoffUntil = Date.now() + OPENAI_BACKOFF_MS;
        }
      }

      if (provider === "openrouter" && process.env.OPENROUTER_API_KEY) {
        response = await callOpenRouter({
          image: cleanImage || undefined,
          description: cleanDescription,
          language,
        });
      }

      if (!response) continue;

      if (!response.ok) {
        console.error(
          `WIZL scan provider ${provider} failed:`,
          response.status,
          response.error.slice(0, 300),
        );
        continue;
      }

      try {
        const parsed = parseStructuredText(response.text);
        const result = normalizeResult(parsed, provider, language);
        return withRateHeaders(NextResponse.json(result), rate);
      } catch (error) {
        console.error(
          `WIZL scan provider ${provider} returned invalid JSON:`,
          error instanceof Error ? error.message : error,
        );
      }
    }

    return withRateHeaders(
      NextResponse.json(buildFallbackResult()),
      rate,
    );
  } catch (error) {
    console.error("Scan error:", error);
    return withRateHeaders(
      NextResponse.json(buildFallbackResult()),
      rate,
    );
  }
}

async function callOpenAI({
  image,
  description,
  language,
}: {
  image?: string;
  description: string;
  language: string;
}): Promise<ProviderResponse> {
  const content: Array<
    | { type: "input_text"; text: string }
    | { type: "input_image"; image_url: string }
  > = [];

  if (image) {
    content.push({
      type: "input_text",
      text: "Read identifying text from this label or package. If it is only a flower photo or the identifying text is unclear, return Unidentified flower instead of guessing.",
    });
    content.push({ type: "input_image", image_url: image });
  } else {
    content.push({
      type: "input_text",
      text:
        "Look up this explicit printed strain or product name, or analyze these package clues: " +
        description,
    });
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_SCAN_MODEL || "gpt-4.1-mini",
      store: false,
      max_output_tokens: 1_500,
      instructions:
        SYSTEM_PROMPT +
        `\n\nWrite descriptive text and list values in ${language}. Keep official strain names unchanged.`,
      text: {
        format: {
          type: "json_schema",
          name: "wizl_label_read",
          strict: true,
          schema: RESULT_SCHEMA,
        },
      },
      input: [{ role: "user", content }],
    }),
  });

  const raw = await response.text();

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      text: "",
      error: safeProviderError(raw),
    };
  }

  try {
    return {
      ok: true,
      status: response.status,
      text: extractOpenAIText(JSON.parse(raw)),
      error: "",
    };
  } catch {
    return {
      ok: false,
      status: 502,
      text: "",
      error: "OpenAI returned unreadable JSON.",
    };
  }
}

async function callOpenRouter({
  image,
  description,
  language,
}: {
  image?: string;
  description: string;
  language: string;
}): Promise<ProviderResponse> {
  const userContent: Array<
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string } }
  > = [];

  if (image) {
    userContent.push({
      type: "text",
      text: "Read identifying text from this label or package. If it is only a flower photo or the identifying text is unclear, return Unidentified flower instead of guessing.",
    });
    userContent.push({
      type: "image_url",
      image_url: { url: image },
    });
  } else {
    userContent.push({
      type: "text",
      text:
        "Look up this explicit printed strain or product name, or analyze these package clues: " +
        description,
    });
  }

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
      headers: {
        Authorization: "Bearer " + process.env.OPENROUTER_API_KEY,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://wizl.space",
        "X-Title": "WIZL Label Reader",
      },
      body: JSON.stringify({
        model:
          process.env.OPENROUTER_SCAN_MODEL || "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              SYSTEM_PROMPT +
              `\n\nWrite descriptive text and list values in ${language}. Keep official strain names unchanged.`,
          },
          { role: "user", content: userContent },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "wizl_label_read",
            strict: true,
            schema: RESULT_SCHEMA,
          },
        },
        provider: { require_parameters: true },
        max_tokens: 1_500,
        temperature: 0.1,
      }),
    },
  );

  const raw = await response.text();

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      text: "",
      error: safeProviderError(raw),
    };
  }

  try {
    return {
      ok: true,
      status: response.status,
      text: extractOpenRouterText(JSON.parse(raw)),
      error: "",
    };
  } catch {
    return {
      ok: false,
      status: 502,
      text: "",
      error: "OpenRouter returned unreadable JSON.",
    };
  }
}

function withRateHeaders(
  response: NextResponse,
  rate: RateLimitResult,
): NextResponse {
  response.headers.set("X-RateLimit-Limit", String(rate.limit));
  response.headers.set("X-RateLimit-Remaining", String(rate.remaining));
  response.headers.set(
    "X-RateLimit-Reset",
    String(Math.ceil(rate.resetAt / 1000)),
  );
  if (!rate.allowed) {
    response.headers.set("Retry-After", String(rate.retryAfterSeconds));
  }
  return response;
}

function extractOpenAIText(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const root = data as Record<string, unknown>;
  if (typeof root.output_text === "string") {
    return root.output_text.trim();
  }

  const chunks: string[] = [];
  const output = root.output;

  if (Array.isArray(output)) {
    for (const item of output) {
      if (!item || typeof item !== "object") continue;
      const itemContent = (item as Record<string, unknown>).content;
      if (!Array.isArray(itemContent)) continue;

      for (const block of itemContent) {
        if (!block || typeof block !== "object") continue;
        const text = (block as Record<string, unknown>).text;
        if (typeof text === "string") chunks.push(text);
      }
    }
  }

  return chunks.join("\n").trim();
}

function extractOpenRouterText(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const root = data as Record<string, unknown>;
  const choices = root.choices;

  if (!Array.isArray(choices) || !choices[0] || typeof choices[0] !== "object") {
    return "";
  }

  const message = (choices[0] as Record<string, unknown>).message;
  if (!message || typeof message !== "object") return "";
  const content = (message as Record<string, unknown>).content;

  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";

  return content
    .map((part) =>
      part && typeof part === "object" &&
      typeof (part as Record<string, unknown>).text === "string"
        ? String((part as Record<string, unknown>).text)
        : "",
    )
    .filter(Boolean)
    .join("\n")
    .trim();
}

function parseStructuredText(text: string): Record<string, unknown> {
  if (!text) throw new Error("Empty structured response.");

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON object found.");
    return JSON.parse(match[0]) as Record<string, unknown>;
  }
}

function normalizeResult(
  input: Record<string, unknown>,
  provider: ScanProvider,
  language: string,
) {
  const allowedTypes = new Set(["sativa", "indica", "hybrid", "unknown"]);
  const allowedConfidence = new Set(["high", "medium", "low"]);
  const cleanString = (value: unknown, fallback = "") =>
    typeof value === "string"
      ? stripCitations(value).slice(0, 1_500)
      : fallback;
  const cleanList = (value: unknown, max: number) =>
    Array.isArray(value)
      ? value
          .filter((item): item is string => typeof item === "string")
          .map((item) => stripCitations(item).slice(0, 80))
          .filter(Boolean)
          .slice(0, max)
      : [];
  const cleanEffectList = (value: unknown) =>
    cleanList(value, 8)
      .filter(
        (item) =>
          !/(treat|relief|pain|anxiety|depress|insomnia|nausea|ptsd|medical|stress)/i.test(
            item,
          ),
      )
      .slice(0, 5);

  const type = cleanString(input.type, "unknown").toLowerCase();
  const name =
    cleanString(input.name, "Unidentified flower") ||
    "Unidentified flower";
  const unknown =
    type === "unknown" || name.toLowerCase() === "unidentified flower";
  const confidence = cleanString(input.confidence).toLowerCase();

  return {
    name: unknown ? "Unidentified flower" : name,
    confidence: unknown
      ? "low"
      : allowedConfidence.has(confidence)
        ? confidence
        : "low",
    type: allowedTypes.has(type) ? type : "unknown",
    thc_range: unknown
      ? "Unknown"
      : cleanString(input.thc_range, "Unknown"),
    cbd_range: unknown
      ? "Unknown"
      : cleanString(input.cbd_range, "Unknown"),
    effects: unknown ? [] : cleanEffectList(input.effects),
    flavors: unknown ? [] : cleanList(input.flavors, 5),
    description: buildReferenceDescription({
      unknown,
      name,
      effects: cleanEffectList(input.effects),
      flavors: cleanList(input.flavors, 5),
      language,
    }),
    best_for:
      language === "Thai"
        ? unknown
          ? "ลองใช้ฉลากที่ชัดขึ้นหรือพิมพ์ชื่อบนฉลากให้ตรง"
          : "เปรียบเทียบผู้ผลิต แบตช์ ฉลากบรรจุภัณฑ์ และบันทึกของคุณเอง"
        : unknown
          ? "Try a clearer label or enter the exact printed name."
          : "Compare the producer, batch, package label, and your own field notes.",
    similar_strains: unknown
      ? []
      : cleanList(input.similar_strains, 4),
    _provider: provider,
  };
}

function buildReferenceDescription({
  unknown,
  name,
  effects,
  flavors,
  language,
}: {
  unknown: boolean;
  name: string;
  effects: string[];
  flavors: string[];
  language: string;
}) {
  if (language === "Thai") {
    if (unknown) {
      return "WIZL พบข้อมูลบนฉลากไม่เพียงพอ โปรดใช้ฉลากบรรจุภัณฑ์ที่ชัดเจนหรือพิมพ์ชื่อที่เห็นให้ตรง";
    }

    const aromaText = flavors.length > 0 ? flavors.join(", ") : "แตกต่างกันไป";
    const effectText = effects.length > 0 ? effects.join(", ") : "แตกต่างกันไป";
    return `${name} เป็นชื่ออ้างอิง ไม่ใช่การยืนยันผลิตภัณฑ์ รายงานทั่วไปกล่าวถึงกลิ่น ${aromaText} และความรู้สึก ${effectText} แต่ผู้ผลิต แบตช์ เคมี ปริมาณ สภาพแวดล้อม และการตอบสนองของแต่ละคนอาจแตกต่างกัน`;
  }

  if (unknown) {
    return "WIZL could not find enough identifying text. Use a clear package label or enter the exact printed name.";
  }

  const aromaText = flavors.length > 0 ? flavors.join(", ") : "varied aromas";
  const effectText = effects.length > 0 ? effects.join(", ") : "varied responses";
  return `${name} is a reference name, not a product identity. General reports mention ${aromaText} aromas and ${effectText} responses; producer, batch, chemistry, amount, setting, and individual response can vary.`;
}

function stripCitations(input: string): string {
  return input
    .replace(/<cite[^>]*>([\s\S]*?)<\/cite>/gi, "$1")
    .replace(/<\/?[a-z][^>]*>/gi, "")
    .replace(/\[\d+(?:[-,\s]\d+)*\]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function safeProviderError(input: string): string {
  return input
    .replace(/sk-[A-Za-z0-9_-]+/g, "[redacted]")
    .slice(0, 500);
}

function buildFallbackResult() {
  return {
    name: "Unidentified item",
    confidence: "low",
    type: "unknown",
    thc_range: "Unknown",
    cbd_range: "Unknown",
    effects: [],
    flavors: [],
    description:
      "The AI label reader is temporarily unavailable. WIZL will not guess identity or potency from appearance.",
    best_for: "Search The Book by the exact printed strain name.",
    similar_strains: [],
    _demo: true,
  };
}
