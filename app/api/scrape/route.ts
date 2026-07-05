import { NextResponse } from "next/server";
import { generateCarouselFromContent } from "@/lib/openai";
import { hookAngleSchema } from "@/lib/schema";
import { extractPageText } from "@/lib/scrape";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = typeof body.url === "string" ? body.url.trim() : "";
    const hookResult = hookAngleSchema.safeParse(body.hook);

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!hookResult.success) {
      return NextResponse.json({ error: "Valid hook selection is required" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: "URL must use http or https" }, { status: 400 });
    }

    const pageText = await extractPageText(parsedUrl.toString());
    const project = await generateCarouselFromContent(
      `Turn the following website content into an Instagram carousel. Paraphrase everything:\n\n${pageText}`,
      hookResult.data,
    );

    return NextResponse.json(project);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to scrape and generate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
