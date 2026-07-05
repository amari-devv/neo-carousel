"use client";

import type { SlideStyle } from "@/lib/schema";
import { DEFAULT_SLIDE_STYLE } from "@/lib/slide-style";

type SlideStyleControlsProps = {
  style: SlideStyle;
  onChange: (style: SlideStyle) => void;
  onReset: () => void;
};

type SliderField = {
  key: keyof SlideStyle;
  label: string;
  min: number;
  max: number;
};

const SLIDERS: SliderField[] = [
  { key: "headlineTopSize", label: "Headline top size", min: 32, max: 96 },
  { key: "headlineBottomSize", label: "Headline bottom size", min: 48, max: 140 },
  { key: "headlineGap", label: "Headline spacing", min: 0, max: 32 },
  { key: "bulletSize", label: "Bullet text size", min: 16, max: 36 },
  { key: "bulletGap", label: "Bullet spacing", min: 4, max: 32 },
  { key: "contentBottomPadding", label: "Bottom padding", min: 24, max: 100 },
  { key: "contentSidePadding", label: "Side padding", min: 24, max: 80 },
  { key: "categorySize", label: "Category label size", min: 14, max: 32 },
  { key: "checklistSize", label: "Checklist text size", min: 18, max: 36 },
];

export function SlideStyleControls({
  style,
  onChange,
  onReset,
}: SlideStyleControlsProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Typography & spacing
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-zinc-500 underline hover:text-zinc-300"
        >
          Reset
        </button>
      </div>
      <div className="space-y-4">
        {SLIDERS.map(({ key, label, min, max }) => {
          const value = style[key] ?? DEFAULT_SLIDE_STYLE[key];
          return (
            <label key={key} className="block">
              <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
                <span>{label}</span>
                <span>{value}px</span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) =>
                  onChange({
                    ...style,
                    [key]: Number(e.target.value),
                  })
                }
                className="w-full accent-red-500"
              />
            </label>
          );
        })}
      </div>
    </section>
  );
}
