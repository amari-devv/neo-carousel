/* eslint-disable @next/next/no-img-element -- raw img tags required for html-to-image export */
import type { Brand, ContentSlide } from "@/lib/schema";
import { DEFAULT_ACCENT } from "@/lib/schema";
import {
  DEFAULT_CUTOUTS,
  DEFAULT_SUBJECT,
} from "@/lib/templates";
import { BulletRow } from "./shared/BulletRow";
import { CircleCutout } from "./shared/CircleCutout";
import { LogoDivider } from "./shared/LogoDivider";

type ContentSlideTemplateProps = {
  slide: ContentSlide;
  brand?: Brand;
};

export function ContentSlideTemplate({
  slide,
  brand,
}: ContentSlideTemplateProps) {
  const accent = brand?.accentColor ?? DEFAULT_ACCENT;
  const subjectUrl = slide.subjectUrl ?? DEFAULT_SUBJECT;
  const cutoutLeft = slide.cutoutUrls?.[0] ?? DEFAULT_CUTOUTS[0];
  const cutoutRight = slide.cutoutUrls?.[1] ?? DEFAULT_CUTOUTS[1];

  const headlineBottomSize =
    slide.headlineBottom.length > 18 ? "text-[88px]" : "text-[110px]";

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

      {slide.category && (
        <div
          className="absolute left-10 top-10 rounded border px-4 py-1.5 text-[22px] font-semibold tracking-[0.2em]"
          style={{ borderColor: accent, color: accent }}
        >
          {slide.category}
        </div>
      )}

      <CircleCutout
        src={cutoutLeft}
        className="absolute left-8 top-[280px] h-[220px] w-[220px] opacity-90"
      />
      <CircleCutout
        src={cutoutRight}
        className="absolute right-8 top-[320px] h-[220px] w-[220px] opacity-90"
      />

      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <img
          src={subjectUrl}
          alt=""
          className="h-[720px] w-auto max-w-[85%] object-contain object-bottom drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]"
          crossOrigin="anonymous"
        />
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-[55%]"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,0.98) 40%, transparent)`,
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 z-10 px-12 pb-14 pt-8">
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
            className={`font-[family-name:var(--font-bebas)] ${headlineBottomSize} leading-[0.95] tracking-wide`}
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.9)" }}
          >
            {slide.headlineBottom}
          </p>
        </div>

        <div className="space-y-4 px-4">
          {slide.bullets.map((bullet, i) => (
            <BulletRow
              key={i}
              icon={bullet.icon}
              text={bullet.text}
              brand={brand}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
