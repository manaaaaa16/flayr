import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { mistakes } = await req.json();

  if (!mistakes || !Array.isArray(mistakes) || mistakes.length === 0) {
    return NextResponse.json({ error: "No mistakes provided" }, { status: 400 });
  }

  const mistakeList = mistakes
    .map((m: { question: string; correctAnswer: string; userAnswer: string }, i: number) =>
      `${i + 1}. Question: "${m.question}"\n   Correct answer: "${m.correctAnswer}"\n   Student answered: "${m.userAnswer}"`
    )
    .join("\n\n");

  const message = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `A student got these flashcard questions wrong in a quiz. For each one, write a short, friendly explanation (2-3 sentences) of why the correct answer is right and help them remember it. Use simple language.

${mistakeList}

Respond with ONLY valid JSON in this exact format:
{
  "explanations": [
    {"index": 1, "tip": "explanation here"},
    {"index": 2, "tip": "explanation here"}
  ]
}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ error: "Unexpected AI response" }, { status: 500 });
  }

  let parsed: { explanations: Array<{ index: number; tip: string }> };
  try {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
  }

  return NextResponse.json({ explanations: parsed.explanations });
}
