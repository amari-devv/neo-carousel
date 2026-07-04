"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import type { CarouselProject } from "@/lib/schema";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = tab === "prompt" ? "/api/generate" : "/api/scrape";
      const body =
        tab === "prompt" ? { prompt } : { url };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Generation failed");
      }

      onGenerated(data as CarouselProject);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
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
          Enter a topic or paste a website URL. AI writes the slides — you edit
          text, backgrounds, and brand, then export 1080×1350 PNGs.
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
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating carousel…
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Generate Carousel
            </>
          )}
        </button>
      </form>
    </div>
  );
}
