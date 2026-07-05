/* eslint-disable @next/next/no-img-element -- raw img tags required for html-to-image export */
import { Bookmark, Check } from "lucide-react";
import type { Brand, SlideStyle, SummarySlide } from "@/lib/schema";
import { DEFAULT_ACCENT } from "@/lib/schema";
import { resolveSlideStyle } from "@/lib/slide-style";
import { LogoDivider } from "./shared/LogoDivider";
import { PlacedIconsLayer } from "./shared/PlacedIconsLayer";

type SummarySlideTemplateProps = {
  slide: SummarySlide;
  brand?: Brand;
  projectDefaultStyle?: SlideStyle;
  editable?: boolean;
  selectedIconId?: string | null;
  onPlacedIconMove?: (id: string, x: number, y: number) => void;
  onPlacedIconSelect?: (id: string | null) => void;
};

export function SummarySlideTemplate({
  slide,
  brand,
  projectDefaultStyle,
  editable = false,
  selectedIconId,
  onPlacedIconMove,
  onPlacedIconSelect,
}: SummarySlideTemplateProps) {
  const accent = brand?.accentColor ?? DEFAULT_ACCENT;
  const ctaText = slide.ctaText?.trim() ?? "";
  const ctaSubtitle = slide.ctaSubtitle?.trim() ?? "";
  const showCta = ctaText.length > 0 || ctaSubtitle.length > 0;
  const checklist = slide.checklist.filter((item) => item.trim().length > 0);
  const placedIcons = (slide.placedIcons ?? []).filter(
    (icon) => icon.icon !== "none",
  );
  const style = resolveSlideStyle(slide.style, projectDefaultStyle);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black text-white">
      {slide.backgroundUrl && (
        <img
          src={slide.backgroundUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          crossOrigin="anonymous"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />

      {slide.subjectUrl && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <img
            src={slide.subjectUrl}
            alt=""
            className="h-[680px] w-auto max-w-[80%] object-contain object-bottom drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]"
            crossOrigin="anonymous"
          />
        </div>
      )}

      <PlacedIconsLayer
        icons={placedIcons}
        brand={brand}
        editable={editable}
        selectedIconId={selectedIconId}
        onSelect={onPlacedIconSelect}
        onMove={onPlacedIconMove}
      />

      <div
        className="absolute bottom-0 left-0 right-0 h-[60%]"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,0.98) 45%, transparent)`,
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 z-10 pt-8"
        style={{
          paddingBottom: style.contentBottomPadding,
          paddingLeft: style.contentSidePadding,
          paddingRight: style.contentSidePadding,
        }}
      >
        <div className="mb-6">
          <LogoDivider brand={brand} />
        </div>

        <div
          className="mb-8 text-center"
          style={{ display: "flex", flexDirection: "column", gap: style.headlineGap }}
        >
          <p
            className="font-[family-name:var(--font-bebas)] leading-none tracking-wide text-white/90"
            style={{
              fontSize: style.headlineTopSize,
              textShadow: "0 4px 20px rgba(0,0,0,0.8)",
            }}
          >
            {slide.headlineTop}
          </p>
          <p
            className="font-[family-name:var(--font-bebas)] leading-[0.95] tracking-wide"
            style={{
              fontSize: style.headlineBottomSize,
              textShadow: "0 4px 30px rgba(0,0,0,0.9)",
            }}
          >
            {slide.headlineBottom}
          </p>
        </div>

        {checklist.length > 0 && (
          <div className="mb-10 space-y-3">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: accent }}
                >
                  <Check className="h-5 w-5 text-white" strokeWidth={3} />
                </div>
                <p
                  className="font-medium text-white/95"
                  style={{ fontSize: style.checklistSize }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        )}

        {showCta && (
          <div className="flex flex-col items-center gap-3">
            {ctaText.length > 0 && (
              <div
                className="flex items-center gap-3 rounded-full px-10 py-4 font-bold tracking-wide"
                style={{ backgroundColor: accent, fontSize: 28 }}
              >
                <Bookmark className="h-7 w-7 fill-white" />
                {ctaText}
              </div>
            )}
            {ctaSubtitle.length > 0 && (
              <p className="text-[22px] font-medium tracking-widest text-white/70">
                {ctaSubtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
