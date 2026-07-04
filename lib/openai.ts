import OpenAI from "openai";
import {
  createProjectFromGpt,
  gptCarouselResponseSchema,
  type CarouselProject,
} from "./schema";
import { DEFAULT_BACKGROUNDS, SYSTEM_PROMPT } from "./templates";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey });
}

export async function generateCarouselFromContent(
  userContent: string,
): Promise<CarouselProject> {
  const client = getClient();

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        temperature: 0.8,
      });

      const raw = response.choices[0]?.message?.content;
      if (!raw) {
        throw new Error("Empty response from OpenAI");
      }

      const parsed = gptCarouselResponseSchema.parse(JSON.parse(raw));
      return createProjectFromGpt(parsed, DEFAULT_BACKGROUNDS);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError ?? new Error("Failed to generate carousel");
}
