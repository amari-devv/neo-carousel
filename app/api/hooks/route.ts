import { NextResponse } from "next/server";
import { generateHookAngles } from "@/lib/openai";
import { extractPageText } from "@/lib/scrape";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = typeof body.url === "string" ? body.url.trim() : "";
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

    let sourceContent = prompt;

    if (url) {
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(url);
      } catch {
        return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
      }

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return NextResponse.json(
          { error: "URL must use http or https" },
          { status: 400 },
        );
      }

      sourceContent = await extractPageText(parsedUrl.toString());
    }

    if (!sourceContent) {
      return NextResponse.json(
        { error: "URL or prompt is required" },
        { status: 400 },
      );
    }

    const hooks = await generateHookAngles(sourceContent);
    return NextResponse.json({ hooks, sourcePreview: sourceContent.slice(0, 300) });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate hook angles";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
