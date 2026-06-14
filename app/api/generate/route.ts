import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { imageBase64, mimeType } = await req.json();

  if (!imageBase64 || !mimeType) {
    return NextResponse.json({ error: "Missing image data" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured. Add ANTHROPIC_API_KEY to .env.local" },
      { status: 500 }
    );
  }

  const validMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!validMimeTypes.includes(mimeType)) {
    return NextResponse.json({ error: "Unsupported image format" }, { status: 400 });
  }

  const message = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: `You are an expert study assistant. Analyze this image of notes, a textbook page, or educational content and generate high-quality Anki-style flashcards.

Rules:
- Generate 5-15 flashcards depending on content density
- Each FRONT should be a clear, specific question or prompt
- Each BACK should be a concise, accurate answer (1-3 sentences max)
- Focus on key concepts, definitions, facts, and relationships
- Use simple, clear language
- If the image has no educational content, return an empty array

Respond with ONLY valid JSON in this exact format, no other text:
{
  "cards": [
    {"front": "Question or prompt here", "back": "Answer here"},
    {"front": "Question or prompt here", "back": "Answer here"}
  ]
}`,
          },
        ],
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ error: "Unexpected response from AI" }, { status: 500 });
  }

  let parsed: { cards: Array<{ front: string; back: string }> };
  try {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse AI response. Please try again." },
      { status: 500 }
    );
  }

  if (!Array.isArray(parsed.cards)) {
    return NextResponse.json({ error: "Invalid response format" }, { status: 500 });
  }

  const cards = parsed.cards
    .filter((c) => c.front && c.back)
    .map((c, i) => ({
      id: `card-${i}-${Date.now()}`,
      front: c.front.trim(),
      back: c.back.trim(),
    }));

  if (cards.length === 0) {
    return NextResponse.json(
      { error: "No flashcards could be generated. Make sure the image contains readable educational content." },
      { status: 422 }
    );
  }

  return NextResponse.json({ cards });
}
