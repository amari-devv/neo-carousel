/* eslint-disable @next/next/no-img-element -- raw img tags required for html-to-image export */
import type { Brand, ContentSlide, SlideStyle } from "@/lib/schema";
import { DEFAULT_ACCENT, visibleBullets } from "@/lib/schema";
import {
  headlineBottomDefaultSize,
  resolveSlideStyle,
} from "@/lib/slide-style";
import { BulletRow } from "./shared/BulletRow";
import { CircleCutout } from "./shared/CircleCutout";
import { LogoDivider } from "./shared/LogoDivider";
import { PlacedIconsLayer } from "./shared/PlacedIconsLayer";

type ContentSlideTemplateProps = {
  slide: ContentSlide;
  brand?: Brand;
  projectDefaultStyle?: SlideStyle;
  editable?: boolean;
  selectedIconId?: string | null;
  onPlacedIconMove?: (id: string, x: number, y: number) => void;
  onPlacedIconSelect?: (id: string | null) => void;
};

export function ContentSlideTemplate({
  slide,
  brand,
  projectDefaultStyle,
  editable = false,
  selectedIconId,
  onPlacedIconMove,
  onPlacedIconSelect,
}: ContentSlideTemplateProps) {
  const accent = brand?.accentColor ?? DEFAULT_ACCENT;
  const bullets = visibleBullets(slide.bullets);
  const placedIcons = (slide.placedIcons ?? []).filter(
    (icon) => icon.icon !== "none",
  );
  const style = resolveSlideStyle(slide.style, projectDefaultStyle);
  const headlineOnly = bullets.length === 0;
  const bottomSize =
    style.headlineBottomSize ||
    headlineBottomDefaultSize(slide.headlineBottom, headlineOnly);

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
          className="absolute left-10 top-10 rounded border px-4 py-1.5 font-semibold tracking-[0.2em]"
          style={{
            borderColor: accent,
            color: accent,
            fontSize: style.categorySize,
          }}
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

      <PlacedIconsLayer
        icons={placedIcons}
        brand={brand}
        editable={editable}
        selectedIconId={selectedIconId}
        onSelect={onPlacedIconSelect}
        onMove={onPlacedIconMove}
      />

      <div
        className="absolute bottom-0 left-0 right-0 h-[55%]"
        style={{
          background: `linear-gradient(to top, rgba(0,0,0,0.98) 40%, transparent)`,
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
          className="text-center"
          style={{
            marginBottom: headlineOnly ? 16 : 32,
            display: "flex",
            flexDirection: "column",
            gap: style.headlineGap,
          }}
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
              fontSize: bottomSize,
              textShadow: "0 4px 30px rgba(0,0,0,0.9)",
            }}
          >
            {slide.headlineBottom}
          </p>
        </div>

        {bullets.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: style.bulletGap }}>
            {bullets.map((bullet, i) => (
              <BulletRow
                key={i}
                icon={bullet.icon}
                text={bullet.text}
                brand={brand}
                fontSize={style.bulletSize}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
