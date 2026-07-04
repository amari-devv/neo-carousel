/* eslint-disable @next/next/no-img-element -- raw img tags required for html-to-image export */
import { Bookmark, Check } from "lucide-react";
import type { Brand, SummarySlide } from "@/lib/schema";
import { DEFAULT_ACCENT } from "@/lib/schema";
import { CarouselIcon } from "@/lib/icons";
import { LogoDivider } from "./shared/LogoDivider";

type SummarySlideTemplateProps = {
  slide: SummarySlide;
  brand?: Brand;
};

export function SummarySlideTemplate({
  slide,
  brand,
}: SummarySlideTemplateProps) {
  const accent = brand?.accentColor ?? DEFAULT_ACCENT;
  const ctaText = slide.ctaText ?? "SAVE THIS POST";
  const checklist = slide.checklist.filter((item) => item.trim().length > 0);
  const slideIcons = (slide.slideIcons ?? []).filter((icon) => icon !== "none");

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

      {slideIcons.length > 0 && (
        <div className="absolute right-10 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-4">
          {slideIcons.map((icon, i) => (
            <div
              key={`${icon}-${i}`}
              className={`flex items-center justify-center shadow-lg ${
                icon === "swipe" ? "rounded-full px-5 py-3" : "rounded-full px-4 py-3"
              }`}
              style={{ backgroundColor: accent, border: "3px solid white" }}
            >
              <CarouselIcon icon={icon} size="lg" className="text-white" />
            </div>
          ))}
        </div>
      )}

      <div
        className="absolute bottom-0 left-0 right-0 h-[60%]"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,0.98) 45%, transparent)`,
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 z-10 px-12 pb-12 pt-8">
        <div className="mb-6">
          <LogoDivider brand={brand} />
        </div>

        <div className="mb-8 text-center">
          <p
            className="font-[family-name:var(--font-bebas)] text-[56px] leading-none tracking-wide text-white/90"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
          >
            {slide.headlineTop}
          </p>
          <p
            className="font-[family-name:var(--font-bebas)] text-[100px] leading-[0.95] tracking-wide"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.9)" }}
          >
            {slide.headlineBottom}
          </p>
        </div>

        {checklist.length > 0 && (
          <div className="mb-10 space-y-3 px-8">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: accent }}
                >
                  <Check className="h-5 w-5 text-white" strokeWidth={3} />
                </div>
                <p className="text-[28px] font-medium text-white/95">{item}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col items-center gap-3">
          <div
            className="flex items-center gap-3 rounded-full px-10 py-4 text-[28px] font-bold tracking-wide"
            style={{ backgroundColor: accent }}
          >
            <Bookmark className="h-7 w-7 fill-white" />
            {ctaText}
          </div>
          <p className="text-[22px] font-medium tracking-widest text-white/70">
            SEND IT TO A TEAMMATE
          </p>
        </div>
      </div>
    </div>
  );
}
