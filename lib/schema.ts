import { z } from "zod";

export const bulletSchema = z.object({
  icon: z.string(),
  text: z.string(),
});

export const contentSlideSchema = z.object({
  type: z.literal("content"),
  category: z.string(),
  headlineTop: z.string(),
  headlineBottom: z.string(),
  bullets: z.array(bulletSchema).length(3),
  backgroundUrl: z.string().optional(),
  cutoutUrls: z.array(z.string()).max(2).optional(),
  subjectUrl: z.string().optional(),
});

export const summarySlideSchema = z.object({
  type: z.literal("summary"),
  headlineTop: z.string(),
  headlineBottom: z.string(),
  checklist: z.array(z.string()).min(3).max(7),
  ctaText: z.string().optional(),
  backgroundUrl: z.string().optional(),
  subjectUrl: z.string().optional(),
});

export const slideSchema = z.discriminatedUnion("type", [
  contentSlideSchema,
  summarySlideSchema,
]);

export const brandSchema = z.object({
  logoUrl: z.string().optional(),
  accentColor: z.string().optional(),
});

export const carouselProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  brand: brandSchema.optional(),
  templateId: z.literal("athlete-viral-v1"),
  slides: z.array(slideSchema).min(1),
});

export const gptContentSlideSchema = z.object({
  type: z.literal("content"),
  category: z.string(),
  headlineTop: z.string(),
  headlineBottom: z.string(),
  bullets: z.array(bulletSchema),
});

export const gptCarouselResponseSchema = z.object({
  title: z.string(),
  carouselAngle: z.string().optional(),
  slides: z.array(
    z.union([
      gptContentSlideSchema,
      z.object({
        type: z.literal("summary"),
        headlineTop: z.string(),
        headlineBottom: z.string(),
        checklist: z.array(z.string()),
        ctaText: z.string().optional(),
      }),
    ]),
  ),
});

export type Bullet = z.infer<typeof bulletSchema>;
export type ContentSlide = z.infer<typeof contentSlideSchema>;
export type SummarySlide = z.infer<typeof summarySlideSchema>;
export type Slide = z.infer<typeof slideSchema>;
export type Brand = z.infer<typeof brandSchema>;
export type CarouselProject = z.infer<typeof carouselProjectSchema>;
export type GptCarouselResponse = z.infer<typeof gptCarouselResponseSchema>;

export const DEFAULT_ACCENT = "#E11D48";

function normalizeBullets(bullets: Bullet[]): [Bullet, Bullet, Bullet] {
  const normalized = bullets.slice(0, 3);
  while (normalized.length < 3) {
    normalized.push({ icon: "check", text: "Add bullet point" });
  }
  return normalized as [Bullet, Bullet, Bullet];
}

export function createProjectFromGpt(
  data: GptCarouselResponse,
  backgroundUrls: string[],
): CarouselProject {
  let bgIndex = 0;

  const slides: Slide[] = data.slides.map((slide) => {
    const backgroundUrl = backgroundUrls[bgIndex % backgroundUrls.length];
    bgIndex++;

    if (slide.type === "content") {
      return {
        type: "content",
        category: slide.category,
        headlineTop: slide.headlineTop,
        headlineBottom: slide.headlineBottom,
        bullets: normalizeBullets(slide.bullets),
        backgroundUrl,
      };
    }

    const checklist = slide.checklist.slice(0, 5);
    while (checklist.length < 5) {
      checklist.push("Add checklist item");
    }

    return {
      ...slide,
      checklist,
      ctaText: slide.ctaText ?? "SAVE THIS POST",
      backgroundUrl,
    };
  });

  return {
    id: crypto.randomUUID(),
    title: data.title,
    brand: { accentColor: DEFAULT_ACCENT },
    templateId: "athlete-viral-v1",
    slides,
  };
}

/** Normalize legacy projects stored with `mistake` slide type */
export function normalizeProject(project: CarouselProject): CarouselProject {
  const slides = (project.slides as Array<Slide | Record<string, unknown>>).map(
    (slide) => {
      if (slide.type !== "mistake") return slide as Slide;

      return {
        type: "content" as const,
        category: String(slide.category ?? ""),
        headlineTop: String(slide.headlineTop ?? ""),
        headlineBottom: String(slide.headlineBottom ?? ""),
        bullets: normalizeBullets(
          Array.isArray(slide.bullets) ? (slide.bullets as Bullet[]) : [],
        ),
        backgroundUrl:
          typeof slide.backgroundUrl === "string" ? slide.backgroundUrl : undefined,
        cutoutUrls: Array.isArray(slide.cutoutUrls)
          ? (slide.cutoutUrls as string[])
          : undefined,
        subjectUrl:
          typeof slide.subjectUrl === "string" ? slide.subjectUrl : undefined,
      };
    },
  );

  return { ...project, slides };
}
