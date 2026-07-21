import { NextRequest, NextResponse } from "next/server";
import {
  consumeRateLimit,
  getClientIdentifier,
  type RateLimitResult,
} from "@/lib/server-rate-limit";

export const dynamic = "force-static";

const DAY_MS = 24 * 60 * 60 * 1000;
const PROVIDER_TIMEOUT_MS = 30_000;

const SYSTEM_PROMPT = [
  "You are WIZL, a kind weasel wizard and cannabis education guide inside wizl.space.",
  "Stay within adult cannabis education: strain-name history, terpenes, label literacy, commonly reported effects, tolerance, breaks, and harm reduction.",
  "Do not provide sellers, purchase links, prices, delivery help, or directions to obtain cannabis.",
  "Do not claim that a strain name predicts an exact effect or potency. Explain that producer, batch, chemistry, dose, setting, and the individual matter.",
  "For health, medication, pregnancy, dependency, or severe reactions, give cautious general information and recommend a qualified healthcare professional or emergency service as appropriate.",
  "Never diagnose or present WIZL as medical advice.",
  "If asked to quit or cut down, be supportive and practical without shame.",
  "Keep answers concise: usually two or three short paragraphs.",
  "Use at most two emoji. Refer to yourself as WIZL or the herb wizard.",
].join("\n");

export async function POST(request: NextRequest) {
  const rate = consumeRateLimit({
    namespace: "chat",
    key: getClientIdentifier(request.headers),
    limit: 40,
    windowMs: DAY_MS,
  });

  if (!rate.allowed) {
    return withRateHeaders(
      NextResponse.json(
        { error: "WIZL has answered enough questions from this network for today. Please return later." },
        { status: 429 },
      ),
      rate,
    );
  }

  try {
    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const locale = body.locale === "th" ? "th" : "en";

    if (!message) {
      return withRateHeaders(
        NextResponse.json({ error: "Message is required." }, { status: 400 }),
        rate,
      );
    }

    if (message.length > 800) {
      return withRateHeaders(
        NextResponse.json({ error: "Message is too long (800 characters max)." }, { status: 400 }),
        rate,
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return withRateHeaders(
        NextResponse.json({ error: "Ask WIZL is not configured." }, { status: 503 }),
        rate,
      );
    }

    const languageInstruction =
      locale !== "en"
        ? "\nRespond in locale " + locale + ", while keeping official strain names unchanged."
        : "";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://wizl.space",
        "X-Title": "WIZL",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_CHAT_MODEL || "perplexity/sonar",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + languageInstruction },
          { role: "user", content: message },
        ],
        max_tokens: 650,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter chat error:", response.status, errorText.slice(0, 500));
      return withRateHeaders(
        NextResponse.json({ error: "WIZL could not answer right now." }, { status: 502 }),
        rate,
      );
    }

    const data = await response.json();
    const reply =
      typeof data.choices?.[0]?.message?.content === "string"
        ? data.choices[0].message.content
        : "WIZL could not shape an answer this time.";
    const sources = Array.isArray(data.citations)
      ? data.citations
          .map(sanitizeCitation)
          .filter((source: string | null): source is string => Boolean(source))
          .slice(0, 5)
      : undefined;

    return withRateHeaders(NextResponse.json({ reply, sources }), rate);
  } catch (error) {
    console.error("Chat API error:", error);
    return withRateHeaders(
      NextResponse.json({ error: "Internal server error." }, { status: 500 }),
      rate,
    );
  }
}

function sanitizeCitation(value: unknown): string | null {
  if (typeof value !== "string") return null;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function withRateHeaders(response: NextResponse, rate: RateLimitResult): NextResponse {
  response.headers.set("X-RateLimit-Limit", String(rate.limit));
  response.headers.set("X-RateLimit-Remaining", String(rate.remaining));
  response.headers.set("X-RateLimit-Reset", String(Math.ceil(rate.resetAt / 1000)));
  if (!rate.allowed) response.headers.set("Retry-After", String(rate.retryAfterSeconds));
  return response;
}
