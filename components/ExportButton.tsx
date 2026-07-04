"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import JSZip from "jszip";
import type { CarouselProject } from "@/lib/schema";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@/lib/templates";
import { SlideCanvas } from "./SlideCanvas";

type ExportButtonProps = {
  project: CarouselProject;
};

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-|-$/g, "") || "carousel";
}

export function ExportButton({ project }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);

    try {
      const { toPng } = await import("html-to-image");
      const zip = new JSZip();
      const container = document.getElementById("export-container");

      if (!container) {
        throw new Error("Export container not found");
      }

      const slideNodes = container.querySelectorAll<HTMLElement>("[data-slide-export]");

      for (let i = 0; i < slideNodes.length; i++) {
        const node = slideNodes[i];
        const dataUrl = await toPng(node, {
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          pixelRatio: 1,
          cacheBust: true,
        });

        const base64 = dataUrl.split(",")[1];
        if (base64) {
          zip.file(`slide-${String(i + 1).padStart(2, "0")}.png`, base64, {
            base64: true,
          });
        }
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${sanitizeFilename(project.title)}-slides.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Export failed. Try uploading local images if external images block export.",
      );
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleExport}
        disabled={exporting}
        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
      >
        {exporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {exporting ? "Exporting…" : "Export ZIP (1080×1350)"}
      </button>

      <div
        id="export-container"
        aria-hidden
        className="pointer-events-none fixed left-[-9999px] top-0"
      >
        {project.slides.map((slide, index) => (
          <div key={index} data-slide-export>
            <SlideCanvas slide={slide} brand={project.brand} />
          </div>
        ))}
      </div>
    </>
  );
}
