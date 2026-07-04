"use client";

import { forwardRef } from "react";
import type { Brand, Slide } from "@/lib/schema";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@/lib/templates";
import { ContentSlideTemplate } from "./templates/ContentSlide";
import { SummarySlideTemplate } from "./templates/SummarySlide";

type SlideCanvasProps = {
  slide: Slide;
  brand?: Brand;
  className?: string;
};

function isContentSlide(slide: Slide): slide is Extract<Slide, { type: "content" }> {
  return slide.type === "content";
}

export const SlideCanvas = forwardRef<HTMLDivElement, SlideCanvasProps>(
  function SlideCanvas({ slide, brand, className = "" }, ref) {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          flexShrink: 0,
        }}
      >
        {isContentSlide(slide) ? (
          <ContentSlideTemplate slide={slide} brand={brand} />
        ) : (
          <SummarySlideTemplate slide={slide} brand={brand} />
        )}
      </div>
    );
  },
);
