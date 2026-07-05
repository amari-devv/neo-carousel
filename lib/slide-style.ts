import type { SlideStyle } from "./schema";

export const DEFAULT_SLIDE_STYLE: Required<SlideStyle> = {
  headlineTopSize: 56,
  headlineBottomSize: 110,
  headlineGap: 8,
  bulletSize: 26,
  bulletGap: 16,
  contentBottomPadding: 56,
  contentSidePadding: 48,
  categorySize: 22,
  checklistSize: 28,
};

export function resolveSlideStyle(
  slideStyle?: SlideStyle,
  projectDefault?: SlideStyle,
): Required<SlideStyle> {
  return {
    ...DEFAULT_SLIDE_STYLE,
    ...projectDefault,
    ...slideStyle,
  };
}

export function headlineBottomDefaultSize(text: string, headlineOnly: boolean): number {
  if (headlineOnly) {
    return text.length > 18 ? 96 : 120;
  }
  return text.length > 18 ? 88 : 110;
}
