import * as cheerio from "cheerio";

const MAX_CHARS = 8000;

const BROWSER_HEADERS: HeadersInit = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  "Upgrade-Insecure-Requests": "1",
};

function buildTextFromHtml(html: string): string {
  const $ = cheerio.load(html);

  $("script, style, nav, footer, iframe, noscript").remove();

  const title = $("title").first().text().trim();
  const headings = $("h1, h2, h3")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);
  const paragraphs = $("p, li")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((text) => text.length > 40);

  const combined = [
    title ? `Title: ${title}` : "",
    headings.length ? `Headings:\n${headings.join("\n")}` : "",
    paragraphs.length ? `Content:\n${paragraphs.join("\n\n")}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  if (!combined.trim()) {
    throw new Error("No readable content found on this page");
  }

  return combined.slice(0, MAX_CHARS);
}

async function fetchDirect(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: BROWSER_HEADERS,
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`direct:${response.status}`);
    }

    const html = await response.text();
    return buildTextFromHtml(html);
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchViaJina(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  const headers: HeadersInit = {
    Accept: "text/plain",
    "X-Return-Format": "text",
  };

  const apiKey = process.env.JINA_API_KEY;
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  try {
    const response = await fetch(`https://r.jina.ai/${url}`, {
      signal: controller.signal,
      headers,
    });

    if (!response.ok) {
      throw new Error(`jina:${response.status}`);
    }

    const text = (await response.text()).trim();
    if (!text || text.length < 100) {
      throw new Error("No readable content found on this page");
    }

    return text.slice(0, MAX_CHARS);
  } finally {
    clearTimeout(timeout);
  }
}

function isBlockedStatus(message: string): boolean {
  return /^direct:(403|401|429|503)$/.test(message);
}

export async function extractPageText(url: string): Promise<string> {
  try {
    return await fetchDirect(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (isBlockedStatus(message) || message === "direct:403") {
      try {
        return await fetchViaJina(url);
      } catch {
        throw new Error(
          "This site blocked automated access. Try a different URL, paste the article text into Prompt mode, or add JINA_API_KEY for better URL support.",
        );
      }
    }

    if (message.startsWith("direct:")) {
      const status = message.replace("direct:", "");
      throw new Error(`Failed to fetch URL (${status})`);
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out while fetching the URL");
    }

    throw error instanceof Error ? error : new Error("Failed to fetch URL");
  }
}
