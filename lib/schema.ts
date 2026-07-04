import { z } from "zod";

export const bulletSchema = z.object({
  icon: z.string(),
  text: z.string(),
});

export const mistakeSlideSchema = z.object({
  type: z.literal("mistake"),
  number: z.number().int().min(1),
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
  mistakeSlideSchema,
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

export const gptCarouselResponseSchema = z.object({
  title: z.string(),
  slides: z.array(
    z.union([
      z.object({
        type: z.literal("mistake"),
        number: z.number(),
        category: z.string(),
        headlineTop: z.string(),
        headlineBottom: z.string(),
        bullets: z.array(bulletSchema),
      }),
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
export type MistakeSlide = z.infer<typeof mistakeSlideSchema>;
export type SummarySlide = z.infer<typeof summarySlideSchema>;
export type Slide = z.infer<typeof slideSchema>;
export type Brand = z.infer<typeof brandSchema>;
export type CarouselProject = z.infer<typeof carouselProjectSchema>;
export type GptCarouselResponse = z.infer<typeof gptCarouselResponseSchema>;

export const DEFAULT_ACCENT = "#E11D48";

export function createProjectFromGpt(
  data: GptCarouselResponse,
  backgroundUrls: string[],
): CarouselProject {
  let bgIndex = 0;

  const slides: Slide[] = data.slides.map((slide) => {
    const backgroundUrl = backgroundUrls[bgIndex % backgroundUrls.length];
    bgIndex++;

    if (slide.type === "mistake") {
      const bullets = slide.bullets.slice(0, 3);
      while (bullets.length < 3) {
        bullets.push({ icon: "check", text: "Add bullet point" });
      }
      return {
        ...slide,
        bullets: bullets as [Bullet, Bullet, Bullet],
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
