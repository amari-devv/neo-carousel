/* eslint-disable @next/next/no-img-element -- raw img tags required for html-to-image export */
import type { Brand, ContentSlide } from "@/lib/schema";
import { DEFAULT_ACCENT, visibleBullets } from "@/lib/schema";
import { CarouselIcon } from "@/lib/icons";
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
  const bullets = visibleBullets(slide.bullets);
  const slideIcons = (slide.slideIcons ?? []).filter((icon) => icon !== "none");

  const headlineBottomSize =
    slide.headlineBottom.length > 18 ? "text-[88px]" : "text-[110px]";

  const headlineOnly = bullets.length === 0;
  const headlineBottomClass = headlineOnly
    ? slide.headlineBottom.length > 18
      ? "text-[96px]"
      : "text-[120px]"
    : headlineBottomSize;

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

      {slide.cutoutLeftUrl && (
        <CircleCutout
          src={slide.cutoutLeftUrl}
          className="absolute left-8 top-[280px] h-[220px] w-[220px] opacity-90"
        />
      )}
      {slide.cutoutRightUrl && (
        <CircleCutout
          src={slide.cutoutRightUrl}
          className="absolute right-8 top-[320px] h-[220px] w-[220px] opacity-90"
        />
      )}

      {slide.subjectUrl && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <img
            src={slide.subjectUrl}
            alt=""
            className="h-[720px] w-auto max-w-[85%] object-contain object-bottom drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]"
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
        className="absolute bottom-0 left-0 right-0 h-[55%]"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,0.98) 40%, transparent)`,
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 z-10 px-12 pb-14 pt-8">
        <div className="mb-6">
          <LogoDivider brand={brand} />
        </div>

        <div className={`text-center ${headlineOnly ? "mb-4" : "mb-8"}`}>
          <p
            className={`font-[family-name:var(--font-bebas)] leading-none tracking-wide text-white/90 ${
              headlineOnly ? "text-[64px]" : "text-[56px]"
            }`}
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
          >
            {slide.headlineTop}
          </p>
          <p
            className={`font-[family-name:var(--font-bebas)] ${headlineBottomClass} leading-[0.95] tracking-wide`}
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.9)" }}
          >
            {slide.headlineBottom}
          </p>
        </div>

        {bullets.length > 0 && (
          <div className="space-y-4 px-4">
            {bullets.map((bullet, i) => (
              <BulletRow
                key={i}
                icon={bullet.icon}
                text={bullet.text}
                brand={brand}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
