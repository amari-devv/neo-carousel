import { z } from "zod";

export const slideStyleSchema = z.object({
  headlineTopSize: z.number().min(24).max(120).optional(),
  headlineBottomSize: z.number().min(32).max(160).optional(),
  headlineGap: z.number().min(0).max(48).optional(),
  bulletSize: z.number().min(14).max(40).optional(),
  bulletGap: z.number().min(4).max(40).optional(),
  contentBottomPadding: z.number().min(20).max(120).optional(),
  contentSidePadding: z.number().min(20).max(80).optional(),
  categorySize: z.number().min(12).max(36).optional(),
  checklistSize: z.number().min(14).max(40).optional(),
});

export const placedIconSchema = z.object({
  id: z.string(),
  icon: z.string(),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  size: z.number().min(32).max(120).optional(),
});

export const hookAngleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  sampleHeadline: z.string(),
});

export const bulletSchema = z.object({
  icon: z.string(),
  text: z.string(),
});

const slideBaseFields = {
  style: slideStyleSchema.optional(),
  placedIcons: z.array(placedIconSchema).max(8).optional(),
  /** @deprecated use placedIcons */
  slideIcons: z.array(z.string()).max(4).optional(),
  backgroundUrl: z.string().optional(),
  subjectUrl: z.string().optional(),
};

export const contentSlideSchema = z.object({
  type: z.literal("content"),
  category: z.string(),
  headlineTop: z.string(),
  headlineBottom: z.string(),
  bullets: z.array(bulletSchema).max(3),
  cutoutUrls: z.array(z.string()).max(2).optional(),
  cutoutLeftUrl: z.string().optional(),
  cutoutRightUrl: z.string().optional(),
  ...slideBaseFields,
});

export const summarySlideSchema = z.object({
  type: z.literal("summary"),
  headlineTop: z.string(),
  headlineBottom: z.string(),
  checklist: z.array(z.string()).min(3).max(7),
  ctaText: z.string().optional(),
  ...slideBaseFields,
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
  defaultStyle: slideStyleSchema.optional(),
  templateId: z.literal("athlete-viral-v1"),
  slides: z.array(slideSchema).min(1),
});

export const gptContentSlideSchema = z.object({
  type: z.literal("content"),
  category: z.string(),
  headlineTop: z.string(),
  headlineBottom: z.string(),
  bullets: z.array(bulletSchema),
  imagePrompt: z.string().optional(),
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
        imagePrompt: z.string().optional(),
      }),
    ]),
  ),
});

export const hookAnglesResponseSchema = z.object({
  hooks: z.array(hookAngleSchema).min(3).max(6),
});

export type SlideStyle = z.infer<typeof slideStyleSchema>;
export type PlacedIcon = z.infer<typeof placedIconSchema>;
export type HookAngle = z.infer<typeof hookAngleSchema>;
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

export function normalizePlacedIcons(
  slide: Record<string, unknown>,
): PlacedIcon[] {
  if (Array.isArray(slide.placedIcons)) {
    return slide.placedIcons as PlacedIcon[];
  }

  if (Array.isArray(slide.slideIcons)) {
    return (slide.slideIcons as string[])
      .filter((icon) => icon !== "none")
      .map((icon, index) => ({
        id: `legacy-${index}-${icon}`,
        icon,
        x: 86,
        y: 38 + index * 14,
        size: 56,
      }));
  }

  return [];
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
    placedIcons: normalizePlacedIcons(slide),
    style:
      slide.style && typeof slide.style === "object"
        ? (slide.style as SlideStyle)
        : undefined,
  };
}

function normalizeSummarySlide(slide: Record<string, unknown>): SummarySlide {
  return {
    type: "summary",
    headlineTop: String(slide.headlineTop ?? ""),
    headlineBottom: String(slide.headlineBottom ?? ""),
    checklist: Array.isArray(slide.checklist)
      ? (slide.checklist as string[])
      : [],
    ctaText: typeof slide.ctaText === "string" ? slide.ctaText : undefined,
    backgroundUrl:
      typeof slide.backgroundUrl === "string" ? slide.backgroundUrl : undefined,
    subjectUrl:
      typeof slide.subjectUrl === "string" ? slide.subjectUrl : undefined,
    placedIcons: normalizePlacedIcons(slide),
    style:
      slide.style && typeof slide.style === "object"
        ? (slide.style as SlideStyle)
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

      if (slide.type === "summary") {
        return normalizeSummarySlide(slide as Record<string, unknown>);
      }

      return slide as Slide;
    },
  );

  return { ...project, slides };
}
