import { NextResponse } from "next/server";
import { generateCarouselFromContent } from "@/lib/openai";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const project = await generateCarouselFromContent(
      `Create an Instagram carousel about: ${prompt}. Choose the best angle for this topic — do not default to a mistakes format unless it genuinely fits.`,
    );

    return NextResponse.json(project);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate carousel";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
