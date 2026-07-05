import type { Brand } from "@/lib/schema";
import { DEFAULT_ACCENT } from "@/lib/schema";
import { CarouselIcon } from "@/lib/icons";

type BulletRowProps = {
  icon: string;
  text: string;
  brand?: Brand;
  fontSize?: number;
};

export function BulletRow({ icon, text, brand, fontSize = 26 }: BulletRowProps) {
  const accent = brand?.accentColor ?? DEFAULT_ACCENT;
  const showIcon = icon !== "none";

  return (
    <div className="flex items-start gap-4">
      {showIcon ? (
        <div
          className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accent}33`, border: `2px solid ${accent}` }}
        >
          <CarouselIcon icon={icon} className="text-white" />
        </div>
      ) : (
        <div className="w-10 shrink-0" />
      )}
      <p
        className="pt-1.5 leading-snug font-medium text-white/95"
        style={{ fontSize }}
      >
        {text}
      </p>
    </div>
  );
}
