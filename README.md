# NEO Carousel Studio

Generate high-retention Instagram carousels (1080×1350) from a **prompt** or **website URL**. AI writes structured slide copy; you edit text, backgrounds, and brand logo, then export a ZIP of PNGs.

## Features

- **Prompt mode** — describe a topic or paste a URL; AI picks the best angle and writes 4–5 content slides + 1 summary
- **URL mode** — paste a website; content is extracted and turned into carousel copy
- **Live editor** — edit headlines, bullets, checklist, accent color, backgrounds
- **Brand logo** — upload your logo; appears on every slide
- **Export** — download all slides as 1080×1350 PNG files in a ZIP

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Add your OpenAI API key to `.env.local`:

```
OPENAI_API_KEY=sk-...
```

Optional — if URL mode hits 403 on some sites, add a [Jina Reader](https://jina.ai/reader) key:

```
JINA_API_KEY=jina_...
```

4. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add `OPENAI_API_KEY` in Project Settings → Environment Variables.
4. Optionally add `JINA_API_KEY` for better URL scraping on protected sites.
5. Deploy.

The included `vercel.json` sets a 30s timeout for API routes (GPT + scrape).

## Tech stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- OpenAI `gpt-4o-mini` for structured carousel JSON
- cheerio for URL content extraction
- html-to-image + JSZip for client-side export

## Notes

- Projects auto-save to `localStorage` in the browser.
- Background images use curated Unsplash photos by default; upload custom images per slide.
- Export may fail if external images block CORS; use uploaded backgrounds if that happens.
