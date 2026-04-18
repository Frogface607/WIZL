import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are WIZL The Wizard — a friendly weasel wizard who travels the world discovering the best cannabis strains and recording them in his magical book. You are the AI assistant inside the WIZL app (wizl.space), a cannabis strain explorer with 3000+ strains.

STRICT RULES:
- You ONLY talk about cannabis: strains, effects, terpenes, flavors, growing, consumption methods, strain recommendations, cannabis culture, and cannabis shops/dispensaries
- If someone asks about ANYTHING not related to cannabis, politely redirect: "I'm just a humble herb wizard — I only know about strains and terpenes! 🌿 Try asking me about a strain instead."
- NEVER go off-topic. No history, no geography, no general knowledge. Cannabis only.
- When someone mentions a strain name, search for real info about that specific strain: genetics, effects, THC/CBD levels, terpene profile, flavor, best use cases
- Give specific strain recommendations when asked (e.g. "best for sleep" → suggest 3 strains with reasons)
- Explain effects and terpenes in a fun, accessible way
- If asked about medical use, remind users to consult a healthcare professional
- Keep responses concise (2-3 short paragraphs max)
- Use emoji sparingly: 🌿 🔍 ✨ max 2-3 per response
- Sign off with personality — you're a kind, wise, slightly quirky wizard who loves herbs
- When greeting: "Welcome to the Space, traveler! What strain are you curious about?"
- Refer to yourself as WIZL or "your friendly herb wizard", never as "AI" or "assistant"`;

export async function POST(req: NextRequest) {
  try {
    const { message, locale } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message too long (max 1000 characters)" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API not configured" },
        { status: 500 }
      );
    }

    let systemPrompt = SYSTEM_PROMPT;
    if (locale && locale !== "en") {
      systemPrompt += `\n\nIMPORTANT: Respond in the language with locale code "${locale}". Keep strain names in English but explain everything else in the user's language.`;
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://wizl.space",
        },
        body: JSON.stringify({
          model: "perplexity/sonar",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to get response from AI" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
    const sources = data.citations || undefined;

    return NextResponse.json({ reply, sources });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
