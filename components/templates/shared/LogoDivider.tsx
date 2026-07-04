/* eslint-disable @next/next/no-img-element -- raw img tags required for html-to-image export */
import type { Brand } from "@/lib/schema";
import { DEFAULT_ACCENT } from "@/lib/schema";

type LogoDividerProps = {
  brand?: Brand;
};

export function LogoDivider({ brand }: LogoDividerProps) {
  const accent = brand?.accentColor ?? DEFAULT_ACCENT;

  return (
    <div className="flex items-center justify-center gap-4 px-16">
      <div className="h-px flex-1 bg-white/30" />
      {brand?.logoUrl ? (
        <img
          src={brand.logoUrl}
          alt="Brand logo"
          className="h-14 w-14 rounded-full object-contain"
          crossOrigin="anonymous"
        />
      ) : (
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 text-lg font-bold tracking-widest text-white"
          style={{ borderColor: `${accent}80` }}
        >
          PF
        </div>
      )}
      <div className="h-px flex-1 bg-white/30" />
    </div>
  );
}
