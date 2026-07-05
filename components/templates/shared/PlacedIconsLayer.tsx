"use client";

import { useCallback, useRef } from "react";
import type { Brand, PlacedIcon } from "@/lib/schema";
import { DEFAULT_ACCENT } from "@/lib/schema";
import { CarouselIcon } from "@/lib/icons";

type PlacedIconsLayerProps = {
  icons: PlacedIcon[];
  brand?: Brand;
  editable?: boolean;
  selectedIconId?: string | null;
  onSelect?: (id: string | null) => void;
  onMove?: (id: string, x: number, y: number) => void;
};

export function PlacedIconsLayer({
  icons,
  brand,
  editable = false,
  selectedIconId,
  onSelect,
  onMove,
}: PlacedIconsLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const accent = brand?.accentColor ?? DEFAULT_ACCENT;

  const handlePointerDown = useCallback(
    (event: React.PointerEvent, icon: PlacedIcon) => {
      if (!editable || !onMove) return;
      event.preventDefault();
      event.stopPropagation();
      onSelect?.(icon.id);

      const layer = layerRef.current;
      if (!layer) return;

      const handleMove = (moveEvent: PointerEvent) => {
        const rect = layer.getBoundingClientRect();
        const x = clamp(((moveEvent.clientX - rect.left) / rect.width) * 100);
        const y = clamp(((moveEvent.clientY - rect.top) / rect.height) * 100);
        onMove(icon.id, x, y);
      };

      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [editable, onMove, onSelect],
  );

  if (icons.length === 0) return null;

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 z-30">
      {icons.map((icon) => {
        const size = icon.size ?? 56;
        const selected = selectedIconId === icon.id;

        return (
          <div
            key={icon.id}
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${
              editable ? "pointer-events-auto cursor-grab active:cursor-grabbing" : ""
            } ${selected ? "ring-2 ring-red-500 ring-offset-2 ring-offset-transparent" : ""}`}
            style={{
              left: `${icon.x}%`,
              top: `${icon.y}%`,
            }}
            onPointerDown={(event) => handlePointerDown(event, icon)}
          >
            <div
              className={`flex items-center justify-center shadow-lg ${
                icon.icon === "swipe" ? "rounded-full px-5 py-3" : "rounded-full"
              }`}
              style={{
                backgroundColor: accent,
                border: "3px solid white",
                width: icon.icon === "swipe" ? undefined : size,
                height: icon.icon === "swipe" ? undefined : size,
                minWidth: icon.icon === "swipe" ? size + 20 : undefined,
              }}
            >
              <CarouselIcon icon={icon.icon} size="lg" className="text-white" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}
