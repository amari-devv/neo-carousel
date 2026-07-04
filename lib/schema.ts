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
  bullets: z.array(bulletSchema).max(3),
  backgroundUrl: z.string().optional(),
  /** @deprecated use cutoutLeftUrl / cutoutRightUrl */
  cutoutUrls: z.array(z.string()).max(2).optional(),
  cutoutLeftUrl: z.string().optional(),
  cutoutRightUrl: z.string().optional(),
  subjectUrl: z.string().optional(),
  slideIcons: z.array(z.string()).max(4).optional(),
});

export const summarySlideSchema = z.object({
  type: z.literal("summary"),
  headlineTop: z.string(),
  headlineBottom: z.string(),
  checklist: z.array(z.string()).min(3).max(7),
  ctaText: z.string().optional(),
  backgroundUrl: z.string().optional(),
  subjectUrl: z.string().optional(),
  slideIcons: z.array(z.string()).max(4).optional(),
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

function normalizeBullets(bullets: Bullet[]): Bullet[] {
  return bullets.slice(0, 3).map((bullet) => ({
    icon: bullet.icon || "check",
    text: bullet.text ?? "",
  }));
}

export function visibleBullets(bullets: Bullet[]): Bullet[] {
  return bullets.filter((bullet) => bullet.text.trim().length > 0);
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

function normalizeContentSlide(slide: Record<string, unknown>): ContentSlide {
  const cutoutUrls = Array.isArray(slide.cutoutUrls)
    ? (slide.cutoutUrls as string[])
    : [];

  return {
    type: "content",
    category: String(slide.category ?? ""),
    headlineTop: String(slide.headlineTop ?? ""),
    headlineBottom: String(slide.headlineBottom ?? ""),
    bullets: normalizeBullets(
      Array.isArray(slide.bullets) ? (slide.bullets as Bullet[]) : [],
    ),
    backgroundUrl:
      typeof slide.backgroundUrl === "string" ? slide.backgroundUrl : undefined,
    cutoutLeftUrl:
      typeof slide.cutoutLeftUrl === "string"
        ? slide.cutoutLeftUrl
        : cutoutUrls[0],
    cutoutRightUrl:
      typeof slide.cutoutRightUrl === "string"
        ? slide.cutoutRightUrl
        : cutoutUrls[1],
    subjectUrl:
      typeof slide.subjectUrl === "string" ? slide.subjectUrl : undefined,
    slideIcons: Array.isArray(slide.slideIcons)
      ? (slide.slideIcons as string[])
      : undefined,
  };
}

/** Normalize legacy projects stored with `mistake` slide type */
export function normalizeProject(project: CarouselProject): CarouselProject {
  const slides = (project.slides as Array<Slide | Record<string, unknown>>).map(
    (slide) => {
      if (slide.type === "mistake") {
        return normalizeContentSlide(slide);
      }

      if (slide.type === "content") {
        return normalizeContentSlide(slide as Record<string, unknown>);
      }

      return slide as Slide;
    },
  );

  return { ...project, slides };
}
