"use client";

import { useState } from "react";
import { Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import type { Bullet, CarouselProject, PlacedIcon, Slide } from "@/lib/schema";
import { DEFAULT_ACCENT } from "@/lib/schema";
import type { ImageTarget } from "@/lib/openai";
import { IconPicker, IconPickerGrid } from "./IconPicker";
import { SlideStyleControls } from "./SlideStyleControls";

type CarouselEditorProps = {
  project: CarouselProject;
  activeIndex: number;
  selectedIconId: string | null;
  onPlacedIconSelect: (id: string | null) => void;
  onProjectChange: (updater: (prev: CarouselProject) => CarouselProject) => void;
  onSlideChange: (index: number, updater: (slide: Slide) => Slide) => void;
  onLogoUpload: (file: File) => void;
  onBackgroundUpload: (index: number, file: File) => void;
  onResetBackground: (index: number) => void;
  onImageUpload: (
    index: number,
    field: "subjectUrl" | "cutoutLeftUrl" | "cutoutRightUrl",
    file: File,
  ) => void;
  onImageRemove: (
    index: number,
    field: "subjectUrl" | "cutoutLeftUrl" | "cutoutRightUrl",
  ) => void;
};

export function CarouselEditor({
  project,
  activeIndex,
  selectedIconId,
  onPlacedIconSelect,
  onProjectChange,
  onSlideChange,
  onLogoUpload,
  onBackgroundUpload,
  onResetBackground,
  onImageUpload,
  onImageRemove,
}: CarouselEditorProps) {
  const slide = project.slides[activeIndex];
  const slideStyle = slide.style ?? {};

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

      <SlideStyleControls
        style={slideStyle}
        onChange={(style) =>
          onSlideChange(activeIndex, (s) => ({ ...s, style }))
        }
        onReset={() =>
          onSlideChange(activeIndex, (s) => ({ ...s, style: undefined }))
        }
      />

      <ImageField
        label="Background"
        hasImage={Boolean(slide.backgroundUrl)}
        onUpload={(file) => onBackgroundUpload(activeIndex, file)}
        onRemove={() =>
          onSlideChange(activeIndex, (s) => ({ ...s, backgroundUrl: undefined }))
        }
        extra={
          <button
            type="button"
            onClick={() => onResetBackground(activeIndex)}
            className="text-xs text-zinc-500 underline hover:text-zinc-300"
          >
            Reset to stock background
          </button>
        }
      />

      <ImageField
        label="Main subject (center)"
        hasImage={Boolean(
          slide.type === "content"
            ? slide.subjectUrl
            : slide.type === "summary"
              ? slide.subjectUrl
              : false,
        )}
        onUpload={(file) => onImageUpload(activeIndex, "subjectUrl", file)}
        onRemove={() => onImageRemove(activeIndex, "subjectUrl")}
      />

      {slide.type === "content" && (
        <>
          <ImageField
            label="Left circle image"
            hasImage={Boolean(slide.cutoutLeftUrl)}
            onUpload={(file) => onImageUpload(activeIndex, "cutoutLeftUrl", file)}
            onRemove={() => onImageRemove(activeIndex, "cutoutLeftUrl")}
          />
          <ImageField
            label="Right circle image"
            hasImage={Boolean(slide.cutoutRightUrl)}
            onUpload={(file) => onImageUpload(activeIndex, "cutoutRightUrl", file)}
            onRemove={() => onImageRemove(activeIndex, "cutoutRightUrl")}
          />
        </>
      )}

      <AiImageSection
        slide={slide}
        onSlideChange={(updater) => onSlideChange(activeIndex, updater)}
      />

      <PlacedIconsSection
        slide={slide}
        selectedIconId={selectedIconId}
        onSelect={onPlacedIconSelect}
        onChange={(updater) => onSlideChange(activeIndex, updater)}
      />

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

function ImageField({
  label,
  hasImage,
  onUpload,
  onRemove,
  extra,
}: {
  label: string;
  hasImage: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </h2>
      <div className="flex gap-2">
        <label className="flex flex-1 cursor-pointer items-center justify-center rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:border-zinc-500">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
          />
          {hasImage ? "Replace image" : "Upload image"}
        </label>
        {hasImage && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-red-400 transition hover:border-red-500"
          >
            Remove
          </button>
        )}
      </div>
      {extra}
    </section>
  );
}

function AiImageSection({
  slide,
  onSlideChange,
}: {
  slide: Slide;
  onSlideChange: (updater: (slide: Slide) => Slide) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState<ImageTarget | null>(null);
  const [error, setError] = useState<string | null>(null);

  const defaultPrompt = `${slide.headlineTop} ${slide.headlineBottom} athletic cinematic`;

  async function generate(
    target: ImageTarget,
    field: "backgroundUrl" | "subjectUrl" | "cutoutLeftUrl" | "cutoutRightUrl",
  ) {
    setLoading(target);
    setError(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim() || defaultPrompt,
          target,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Image generation failed");
      }

      onSlideChange((s) => ({ ...s, [field]: data.imageUrl as string }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image generation failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        AI images (GPT Image)
      </h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={defaultPrompt}
        rows={2}
        className="mb-3 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-red-500 focus:outline-none"
      />
      <div className="grid grid-cols-2 gap-2">
        <AiImageButton
          label="Background"
          loading={loading === "background"}
          onClick={() => generate("background", "backgroundUrl")}
        />
        <AiImageButton
          label="Subject"
          loading={loading === "subject"}
          onClick={() => generate("subject", "subjectUrl")}
        />
        {slide.type === "content" && (
          <>
            <AiImageButton
              label="Left circle"
              loading={loading === "cutout"}
              onClick={() => generate("cutout", "cutoutLeftUrl")}
            />
            <AiImageButton
              label="Right circle"
              loading={loading === "cutout"}
              onClick={() => generate("cutout", "cutoutRightUrl")}
            />
          </>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </section>
  );
}

function AiImageButton({
  label,
  loading,
  onClick,
}: {
  label: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 transition hover:border-red-500 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Sparkles className="h-3 w-3" />
      )}
      {label}
    </button>
  );
}

function PlacedIconsSection({
  slide,
  selectedIconId,
  onSelect,
  onChange,
}: {
  slide: Slide;
  selectedIconId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (updater: (slide: Slide) => Slide) => void;
}) {
  const icons = slide.placedIcons ?? [];
  const selected = icons.find((icon) => icon.id === selectedIconId);

  function updateIcon(id: string, patch: Partial<PlacedIcon>) {
    onChange((s) => ({
      ...s,
      placedIcons: (s.placedIcons ?? []).map((icon) =>
        icon.id === id ? { ...icon, ...patch } : icon,
      ),
    }));
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Slide icons
        </h2>
        {icons.length < 8 && (
          <button
            type="button"
            onClick={() => {
              const newIcon: PlacedIcon = {
                id: crypto.randomUUID(),
                icon: "swipe",
                x: 50,
                y: 50,
                size: 56,
              };
              onChange((s) => ({
                ...s,
                placedIcons: [...(s.placedIcons ?? []), newIcon],
              }));
              onSelect(newIcon.id);
            }}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
          >
            <Plus className="h-3 w-3" />
            Add icon
          </button>
        )}
      </div>
      <p className="mb-3 text-xs text-zinc-600">
        Drag icons on the slide preview, or fine-tune position below.
      </p>

      {icons.length === 0 ? (
        <IconPickerGrid
          label="Pick an icon to add"
          value="swipe"
          onChange={(icon) => {
            if (icon === "none") return;
            const newIcon: PlacedIcon = {
              id: crypto.randomUUID(),
              icon,
              x: 86,
              y: 50,
              size: 56,
            };
            onChange((s) => ({ ...s, placedIcons: [newIcon] }));
            onSelect(newIcon.id);
          }}
        />
      ) : (
        <div className="space-y-3">
          {icons.map((icon, i) => (
            <div
              key={icon.id}
              className={`space-y-2 rounded-lg border p-3 ${
                selectedIconId === icon.id
                  ? "border-red-500 bg-red-500/5"
                  : "border-zinc-800"
              }`}
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelect(icon.id)}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  Icon {i + 1} {selectedIconId === icon.id ? "(selected)" : ""}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange((s) => ({
                      ...s,
                      placedIcons: (s.placedIcons ?? []).filter(
                        (item) => item.id !== icon.id,
                      ),
                    }));
                    if (selectedIconId === icon.id) onSelect(null);
                  }}
                  className="rounded-lg border border-zinc-700 p-1.5 text-zinc-400 hover:border-red-500 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <IconPicker
                label="Icon"
                value={icon.icon}
                onChange={(next) =>
                  updateIcon(icon.id, { icon: next === "none" ? "swipe" : next })
                }
              />
              <SliderControl
                label="X position"
                value={icon.x}
                min={0}
                max={100}
                onChange={(x) => updateIcon(icon.id, { x })}
              />
              <SliderControl
                label="Y position"
                value={icon.y}
                min={0}
                max={100}
                onChange={(y) => updateIcon(icon.id, { y })}
              />
              <SliderControl
                label="Size"
                value={icon.size ?? 56}
                min={32}
                max={120}
                onChange={(size) => updateIcon(icon.id, { size })}
              />
            </div>
          ))}
        </div>
      )}

      {selected && (
        <p className="mt-2 text-xs text-zinc-500">
          Tip: click and drag the selected icon directly on the slide preview.
        </p>
      )}
    </section>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-red-500"
      />
    </label>
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
          onChange((s) => (s.type === "content" ? { ...s, category } : s))
        }
      />
      <Field
        label="Headline top"
        value={slide.headlineTop}
        onChange={(headlineTop) =>
          onChange((s) => (s.type === "content" ? { ...s, headlineTop } : s))
        }
      />
      <Field
        label="Headline bottom"
        value={slide.headlineBottom}
        onChange={(headlineBottom) =>
          onChange((s) => (s.type === "content" ? { ...s, headlineBottom } : s))
        }
      />

      <div className="flex items-center justify-between pt-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Bullet points
        </h3>
        <div className="flex gap-2">
          {slide.bullets.length < 3 && (
            <button
              type="button"
              onClick={() =>
                onChange((s) => {
                  if (s.type !== "content") return s;
                  return {
                    ...s,
                    bullets: [
                      ...s.bullets,
                      { icon: "check", text: "" },
                    ],
                  };
                })
              }
              className="text-xs text-red-400 hover:text-red-300"
            >
              + Add bullet
            </button>
          )}
          {slide.bullets.length > 0 && (
            <button
              type="button"
              onClick={() =>
                onChange((s) =>
                  s.type === "content" ? { ...s, bullets: [] } : s,
                )
              }
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-zinc-600">
        Leave bullet text empty or clear all for headline-only slides.
      </p>

      {slide.bullets.map((bullet, i) => (
        <div
          key={i}
          className="space-y-2 rounded-lg border border-zinc-800 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Bullet {i + 1}</span>
            <button
              type="button"
              onClick={() =>
                onChange((s) => {
                  if (s.type !== "content") return s;
                  return {
                    ...s,
                    bullets: s.bullets.filter((_, idx) => idx !== i),
                  };
                })
              }
              className="text-xs text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
          <IconPicker
            label="Icon"
            value={bullet.icon}
            onChange={(icon) =>
              onChange((s) => {
                if (s.type !== "content") return s;
                const bullets = [...s.bullets] as Bullet[];
                bullets[i] = { ...bullets[i], icon };
                return { ...s, bullets };
              })
            }
          />
          <Field
            label="Text"
            value={bullet.text}
            onChange={(text) =>
              onChange((s) => {
                if (s.type !== "content") return s;
                const bullets = [...s.bullets] as Bullet[];
                bullets[i] = { ...bullets[i], text };
                return { ...s, bullets };
              })
            }
          />
        </div>
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
          onChange((s) => (s.type === "summary" ? { ...s, headlineTop } : s))
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
        label="CTA button text"
        value={slide.ctaText ?? ""}
        onChange={(ctaText) =>
          onChange((s) => (s.type === "summary" ? { ...s, ctaText } : s))
        }
      />
      <Field
        label="CTA subtitle (optional)"
        value={slide.ctaSubtitle ?? ""}
        onChange={(ctaSubtitle) =>
          onChange((s) => (s.type === "summary" ? { ...s, ctaSubtitle } : s))
        }
      />
      <p className="text-xs text-zinc-600">
        Leave either field blank to hide it on the slide.
      </p>
    </section>
  );
}
