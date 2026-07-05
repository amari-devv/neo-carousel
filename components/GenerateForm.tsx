"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import type { CarouselProject, HookAngle } from "@/lib/schema";
import { HookAngleModal } from "./HookAngleModal";

type GenerateFormProps = {
  onGenerated: (project: CarouselProject) => void;
};

type Tab = "prompt" | "url";

export function GenerateForm({ onGenerated }: GenerateFormProps) {
  const [tab, setTab] = useState<Tab>("prompt");
  const [prompt, setPrompt] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hooks, setHooks] = useState<HookAngle[]>([]);
  const [showHookModal, setShowHookModal] = useState(false);
  const [pendingInput, setPendingInput] = useState<{ tab: Tab; value: string } | null>(
    null,
  );

  async function fetchHooks(tabValue: Tab, value: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          tabValue === "url" ? { url: value } : { prompt: value },
        ),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to analyze content");
      }

      setHooks(data.hooks as HookAngle[]);
      setPendingInput({ tab: tabValue, value });
      setShowHookModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function generateWithHook(hook: HookAngle) {
    if (!pendingInput) return;

    setLoading(true);
    setError(null);

    try {
      const endpoint = pendingInput.tab === "url" ? "/api/scrape" : "/api/generate";
      const body =
        pendingInput.tab === "url"
          ? { url: pendingInput.value, hook }
          : { prompt: pendingInput.value, hook };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Generation failed");
      }

      setShowHookModal(false);
      setPendingInput(null);
      onGenerated(data as CarouselProject);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = tab === "prompt" ? prompt.trim() : url.trim();
    if (!value) return;
    await fetchHooks(tab, value);
  }

  return (
    <>
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-400">
            <Sparkles className="h-4 w-4" />
            Athlete Viral Carousel Studio
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-white">
            Generate Instagram Carousels
          </h1>
          <p className="text-zinc-400">
            Enter a topic or paste a URL. Pick a hook angle, edit like Canva, generate
            AI images, then export 1080×1350 PNGs.
          </p>
        </div>

        <div className="mb-4 flex rounded-lg border border-zinc-800 bg-zinc-900/50 p-1">
          <button
            type="button"
            onClick={() => setTab("prompt")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
              tab === "prompt"
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Prompt
          </button>
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
              tab === "url"
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Website URL
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
        >
          {tab === "prompt" ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-300">
                What should the carousel be about?
              </span>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. the hidden truth about recovery for competitive athletes"
                rows={4}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </label>
          ) : (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-300">
                Paste a website URL to summarize
              </span>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </label>
          )}

          {error && (
            <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
          >
            {loading && !showHookModal ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing content…
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Choose hook angle
              </>
            )}
          </button>
        </form>
      </div>

      {showHookModal && (
        <HookAngleModal
          hooks={hooks}
          loading={loading}
          onSelect={generateWithHook}
          onClose={() => {
            if (!loading) {
              setShowHookModal(false);
              setPendingInput(null);
            }
          }}
        />
      )}
    </>
  );
}
