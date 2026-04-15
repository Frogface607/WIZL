import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are WIZL — a friendly, knowledgeable cannabis strain expert and budtender assistant. You help people understand strains, effects, terpenes, and make recommendations.

Rules:
- Be conversational, fun, and informative
- Give specific strain recommendations when asked
- Explain effects, terpenes, and flavor profiles
- If asked about medical use, remind users to consult a healthcare professional
- Keep responses concise (2-4 paragraphs max)
- Use emoji sparingly but naturally`;

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
