import OpenAI from "openai";
import {
  createProjectFromGpt,
  gptCarouselResponseSchema,
  hookAnglesResponseSchema,
  type CarouselProject,
  type HookAngle,
} from "./schema";
import { DEFAULT_BACKGROUNDS, HOOK_ANGLES_PROMPT, SYSTEM_PROMPT } from "./templates";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey });
}

function getImageModel(): string {
  return process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";
}

export async function generateHookAngles(sourceContent: string): Promise<HookAngle[]> {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: HOOK_ANGLES_PROMPT },
      {
        role: "user",
        content: `Analyze this content and propose carousel hook angles:\n\n${sourceContent.slice(0, 8000)}`,
      },
    ],
    temperature: 0.9,
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("Empty response from OpenAI");
  }

  const parsed = hookAnglesResponseSchema.parse(JSON.parse(raw));
  return parsed.hooks;
}

export async function generateCarouselFromContent(
  userContent: string,
  selectedHook?: HookAngle,
): Promise<CarouselProject> {
  const client = getClient();

  const hookInstruction = selectedHook
    ? `\n\nUse this exact carousel hook angle:\nTitle: ${selectedHook.title}\nAngle: ${selectedHook.description}\nSample headline direction: ${selectedHook.sampleHeadline}\nBuild every slide around this hook while staying faithful to the source material.`
    : "";

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `${userContent}${hookInstruction}` },
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

export type ImageTarget = "background" | "subject" | "cutout";

const IMAGE_PROMPT_SUFFIX: Record<ImageTarget, string> = {
  background:
    "Vertical 4:5 cinematic Instagram carousel background. Dark athletic mood, high contrast, textured lighting, no text, no logos, no watermarks, professional sports editorial photography style.",
  subject:
    "Single athletic subject cutout-style portrait. Dramatic studio lighting, transparent-friendly dark background, no text, professional fitness editorial, centered figure.",
  cutout:
    "Circular inset photo for social media carousel. Tight crop, athletic theme, high contrast, no text, clean composition.",
};

export async function generateSlideImage(
  prompt: string,
  target: ImageTarget,
): Promise<string> {
  const client = getClient();
  const primaryModel = getImageModel();
  const fullPrompt = `${prompt.trim()}. ${IMAGE_PROMPT_SUFFIX[target]}`;

  async function run(modelName: string) {
    const size =
      target === "background"
        ? modelName === "dall-e-3"
          ? "1024x1792"
          : "1024x1536"
        : "1024x1024";

    const response = await client.images.generate({
      model: modelName,
      prompt: fullPrompt,
      size,
      n: 1,
      ...(modelName === "dall-e-3" ? { quality: "hd" as const } : {}),
    });

    const item = response.data?.[0];
    if (item?.b64_json) {
      return `data:image/png;base64,${item.b64_json}`;
    }
    if (item?.url) {
      const imageResponse = await fetch(item.url);
      const buffer = await imageResponse.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      return `data:image/png;base64,${base64}`;
    }
    throw new Error("No image data returned");
  }

  try {
    return await run(primaryModel);
  } catch {
    if (primaryModel !== "dall-e-3") {
      return await run("dall-e-3");
    }
    throw new Error("Image generation failed. Check your OpenAI API key and billing.");
  }
}
