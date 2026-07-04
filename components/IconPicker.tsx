"use client";

import { CarouselIcon, ICON_OPTIONS } from "@/lib/icons";

type IconPickerProps = {
  value: string;
  onChange: (icon: string) => void;
  label?: string;
};

export function IconPicker({ value, onChange, label }: IconPickerProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-xs text-zinc-500">{label}</span>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-zinc-700 bg-zinc-950 py-2 pl-3 pr-10 text-sm text-white focus:border-red-500 focus:outline-none"
        >
          {ICON_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-white">
          <CarouselIcon icon={value} size="sm" />
        </div>
      </div>
    </label>
  );
}

type IconPickerGridProps = {
  value: string;
  onChange: (icon: string) => void;
  label?: string;
};

export function IconPickerGrid({ value, onChange, label }: IconPickerGridProps) {
  return (
    <div>
      {label && (
        <span className="mb-2 block text-xs text-zinc-500">{label}</span>
      )}
      <div className="grid grid-cols-4 gap-2">
        {ICON_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            title={option.label}
            onClick={() => onChange(option.id)}
            className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-[10px] transition ${
              value === option.id
                ? "border-red-500 bg-red-500/10 text-white"
                : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900">
              {option.id === "none" ? (
                <span className="text-zinc-600">—</span>
              ) : (
                <CarouselIcon icon={option.id} size="sm" />
              )}
            </div>
            <span className="truncate w-full text-center">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
