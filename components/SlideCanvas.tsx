"use client";

import { forwardRef } from "react";
import type { Brand, Slide, SlideStyle } from "@/lib/schema";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@/lib/templates";
import { ContentSlideTemplate } from "./templates/ContentSlide";
import { SummarySlideTemplate } from "./templates/SummarySlide";

type SlideCanvasProps = {
  slide: Slide;
  brand?: Brand;
  projectDefaultStyle?: SlideStyle;
  className?: string;
  editable?: boolean;
  selectedIconId?: string | null;
  onPlacedIconMove?: (id: string, x: number, y: number) => void;
  onPlacedIconSelect?: (id: string | null) => void;
};

export const SlideCanvas = forwardRef<HTMLDivElement, SlideCanvasProps>(
  function SlideCanvas(
    {
      slide,
      brand,
      projectDefaultStyle,
      className = "",
      editable = false,
      selectedIconId,
      onPlacedIconMove,
      onPlacedIconSelect,
    },
    ref,
  ) {
    const shared = {
      brand,
      projectDefaultStyle,
      editable,
      selectedIconId,
      onPlacedIconMove,
      onPlacedIconSelect,
    };

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
        {slide.type === "content" ? (
          <ContentSlideTemplate slide={slide} {...shared} />
        ) : (
          <SummarySlideTemplate slide={slide} {...shared} />
        )}
      </div>
    );
  },
);
