"use client";

import type { CarouselProject, Slide } from "@/lib/schema";
import { DEFAULT_ACCENT } from "@/lib/schema";

type CarouselEditorProps = {
  project: CarouselProject;
  activeIndex: number;
  onProjectChange: (updater: (prev: CarouselProject) => CarouselProject) => void;
  onSlideChange: (index: number, updater: (slide: Slide) => Slide) => void;
  onLogoUpload: (file: File) => void;
  onBackgroundUpload: (index: number, file: File) => void;
  onResetBackground: (index: number) => void;
};

export function CarouselEditor({
  project,
  activeIndex,
  onProjectChange,
  onSlideChange,
  onLogoUpload,
  onBackgroundUpload,
  onResetBackground,
}: CarouselEditorProps) {
  const slide = project.slides[activeIndex];

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Brand
        </h2>
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-zinc-700 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-500">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onLogoUpload(file);
            }}
          />
          Upload brand logo
        </label>
        <label className="mt-3 block">
          <span className="mb-1 block text-xs text-zinc-500">Accent color</span>
          <input
            type="color"
            value={project.brand?.accentColor ?? DEFAULT_ACCENT}
            onChange={(e) =>
              onProjectChange((prev) => ({
                ...prev,
                brand: {
                  ...prev.brand,
                  accentColor: e.target.value,
                },
              }))
            }
            className="h-10 w-full cursor-pointer rounded border border-zinc-700 bg-zinc-950"
          />
        </label>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Carousel title
        </h2>
        <input
          type="text"
          value={project.title}
          onChange={(e) =>
            onProjectChange((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
        />
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Slide {activeIndex + 1} — Background
        </h2>
        <label className="mb-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:border-zinc-500">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onBackgroundUpload(activeIndex, file);
            }}
          />
          Upload background
        </label>
        <button
          type="button"
          onClick={() => onResetBackground(activeIndex)}
          className="text-xs text-zinc-500 underline hover:text-zinc-300"
        >
          Reset to default stock background
        </button>
      </section>

      {slide.type === "content" ? (
        <ContentFields
          slide={slide}
          onChange={(updater) => onSlideChange(activeIndex, updater)}
        />
      ) : (
        <SummaryFields
          slide={slide}
          onChange={(updater) => onSlideChange(activeIndex, updater)}
        />
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-zinc-500">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none"
      />
    </label>
  );
}

function ContentFields({
  slide,
  onChange,
}: {
  slide: Extract<Slide, { type: "content" }>;
  onChange: (updater: (slide: Slide) => Slide) => void;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Slide text
      </h2>
      <Field
        label="Category label"
        value={slide.category}
        onChange={(category) =>
          onChange((s) =>
            s.type === "content" ? { ...s, category } : s,
          )
        }
      />
      <Field
        label="Headline top"
        value={slide.headlineTop}
        onChange={(headlineTop) =>
          onChange((s) =>
            s.type === "content" ? { ...s, headlineTop } : s,
          )
        }
      />
      <Field
        label="Headline bottom"
        value={slide.headlineBottom}
        onChange={(headlineBottom) =>
          onChange((s) =>
            s.type === "content" ? { ...s, headlineBottom } : s,
          )
        }
      />
      {slide.bullets.map((bullet, i) => (
        <Field
          key={i}
          label={`Bullet ${i + 1}`}
          value={bullet.text}
          onChange={(text) =>
            onChange((s) => {
              if (s.type !== "content") return s;
              const bullets = [...s.bullets] as typeof s.bullets;
              bullets[i] = { ...bullets[i], text };
              return { ...s, bullets };
            })
          }
        />
      ))}
    </section>
  );
}

function SummaryFields({
  slide,
  onChange,
}: {
  slide: Extract<Slide, { type: "summary" }>;
  onChange: (updater: (slide: Slide) => Slide) => void;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Slide text
      </h2>
      <Field
        label="Headline top"
        value={slide.headlineTop}
        onChange={(headlineTop) =>
          onChange((s) =>
            s.type === "summary" ? { ...s, headlineTop } : s,
          )
        }
      />
      <Field
        label="Headline bottom"
        value={slide.headlineBottom}
        onChange={(headlineBottom) =>
          onChange((s) =>
            s.type === "summary" ? { ...s, headlineBottom } : s,
          )
        }
      />
      {slide.checklist.map((item, i) => (
        <Field
          key={i}
          label={`Checklist item ${i + 1}`}
          value={item}
          onChange={(value) =>
            onChange((s) => {
              if (s.type !== "summary") return s;
              const checklist = [...s.checklist];
              checklist[i] = value;
              return { ...s, checklist };
            })
          }
        />
      ))}
      <Field
        label="CTA text"
        value={slide.ctaText ?? "SAVE THIS POST"}
        onChange={(ctaText) =>
          onChange((s) =>
            s.type === "summary" ? { ...s, ctaText } : s,
          )
        }
      />
    </section>
  );
}
