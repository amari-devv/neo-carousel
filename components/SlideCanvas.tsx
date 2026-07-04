"use client";

import { forwardRef } from "react";
import type { Brand, Slide } from "@/lib/schema";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@/lib/templates";
import { MistakeSlideTemplate } from "./templates/MistakeSlide";
import { SummarySlideTemplate } from "./templates/SummarySlide";

type SlideCanvasProps = {
  slide: Slide;
  brand?: Brand;
  className?: string;
};

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
        {slide.type === "mistake" ? (
          <MistakeSlideTemplate slide={slide} brand={brand} />
        ) : (
          <SummarySlideTemplate slide={slide} brand={brand} />
        )}
      </div>
    );
  },
);
