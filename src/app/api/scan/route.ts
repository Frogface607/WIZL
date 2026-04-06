import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are WIZL — a friendly, knowledgeable cannabis strain identification assistant.

When given an image of cannabis (jar, package, bud, label) or a text description, identify the strain and provide detailed information.

ALWAYS respond in this exact JSON format:
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
- Make your best educated guess
- Set confidence to "low" or "medium"
- Explain in the description what you're seeing and why you made this guess

Be friendly, knowledgeable, and helpful. Like a budtender who really knows their stuff.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, description } = body as {
      image?: string;
      description?: string;
    };

    if (!image && !description) {
      return NextResponse.json(
        { error: "Please provide an image or description" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

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

    // Build messages for Claude API
    const content: Array<
      | { type: "text"; text: string }
      | { type: "image"; source: { type: "base64"; media_type: string; data: string } }
    > = [];

    if (image) {
      // Extract base64 data and media type from data URL
      const match = image.match(
        /^data:(image\/[a-zA-Z+]+);base64,(.+)$/
      );
      if (match) {
        content.push({
          type: "image",
          source: {
            type: "base64",
            media_type: match[1],
            data: match[2],
          },
        });
      }
      content.push({
        type: "text",
        text: "Identify this cannabis strain from the image. Respond in the JSON format specified.",
      });
    } else if (description) {
      content.push({
        type: "text",
        text: `Identify this cannabis strain based on the following description: "${description}". Respond in the JSON format specified.`,
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anthropic API error:", error);
      return NextResponse.json(
        { error: "AI scan failed. Please try again." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text =
      data.content?.[0]?.type === "text" ? data.content[0].text : "";

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return NextResponse.json(result);
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
