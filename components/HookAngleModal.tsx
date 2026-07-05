"use client";

import type { HookAngle } from "@/lib/schema";
import { Loader2, Sparkles, X } from "lucide-react";

type HookAngleModalProps = {
  hooks: HookAngle[];
  loading?: boolean;
  onSelect: (hook: HookAngle) => void;
  onClose: () => void;
};

export function HookAngleModal({
  hooks,
  loading = false,
  onSelect,
  onClose,
}: HookAngleModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-800 px-6 py-5">
          <div>
            <div className="mb-1 flex items-center gap-2 text-red-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Choose your hook</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Pick a carousel angle
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Select the direction that best matches how you want this carousel to feel.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 p-6">
          {hooks.map((hook) => (
            <button
              key={hook.id}
              type="button"
              disabled={loading}
              onClick={() => onSelect(hook)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-left transition hover:border-red-500 hover:bg-red-500/5 disabled:opacity-50"
            >
              <p className="text-lg font-semibold text-white">{hook.title}</p>
              <p className="mt-1 text-sm text-zinc-400">{hook.description}</p>
              <p className="mt-3 font-[family-name:var(--font-bebas)] text-xl tracking-wide text-red-400">
                {hook.sampleHeadline}
              </p>
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 border-t border-zinc-800 px-6 py-4 text-sm text-zinc-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Building your carousel…
          </div>
        )}
      </div>
    </div>
  );
}
