import { NextResponse } from "next/server";
import { generateSlideImage, type ImageTarget } from "@/lib/openai";

export const maxDuration = 60;

const VALID_TARGETS: ImageTarget[] = ["background", "subject", "cutout"];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const target = body.target as ImageTarget;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!VALID_TARGETS.includes(target)) {
      return NextResponse.json({ error: "Invalid image target" }, { status: 400 });
    }

    const imageUrl = await generateSlideImage(prompt, target);
    return NextResponse.json({ imageUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
