import * as cheerio from "cheerio";

const MAX_CHARS = 8000;

export async function extractPageText(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; NEO-Carousel-Bot/1.0; +https://neo-carousel.app)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL (${response.status})`);
    }

    const html = await response.text();
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
  } finally {
    clearTimeout(timeout);
  }
}
