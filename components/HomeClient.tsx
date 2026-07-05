"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
} from "lucide-react";
import type { CarouselProject, Slide } from "@/lib/schema";
import { DEFAULT_ACCENT, normalizeProject } from "@/lib/schema";
import { DEFAULT_BACKGROUNDS } from "@/lib/templates";
import { clearProject, saveProject } from "@/lib/storage";
import { CarouselEditor } from "./CarouselEditor";
import { ExportButton } from "./ExportButton";
import { GenerateForm } from "./GenerateForm";
import { SlideCanvas } from "./SlideCanvas";

function loadStoredProject(): CarouselProject | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("neo-carousel-project");
  if (!stored) return null;
  try {
    return normalizeProject(JSON.parse(stored) as CarouselProject);
  } catch {
    clearProject();
    return null;
  }
}

export function HomeClient() {
  const [project, setProject] = useState<CarouselProject | null>(loadStoredProject);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);

  useEffect(() => {
    if (project) saveProject(project);
  }, [project]);

  useEffect(() => {
    function updateScale() {
      if (!previewRef.current) return;
      const width = previewRef.current.clientWidth - 32;
      setScale(Math.min(width / 1080, 0.45));
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [project]);

  const handleGenerated = useCallback((newProject: CarouselProject) => {
    setProject(newProject);
    setActiveIndex(0);
  }, []);

  const updateProject = useCallback(
    (updater: (prev: CarouselProject) => CarouselProject) => {
      setProject((prev) => (prev ? updater(prev) : prev));
    },
    [],
  );

  const updateSlide = useCallback(
    (index: number, updater: (slide: Slide) => Slide) => {
      updateProject((prev) => ({
        ...prev,
        slides: prev.slides.map((slide, i) =>
          i === index ? updater(slide) : slide,
        ),
      }));
    },
    [updateProject],
  );

  const moveSlide = useCallback(
    (index: number, direction: -1 | 1) => {
      updateProject((prev) => {
        const next = [...prev.slides];
        const target = index + direction;
        if (target < 0 || target >= next.length) return prev;
        [next[index], next[target]] = [next[target], next[index]];
        setActiveIndex(target);
        return { ...prev, slides: next };
      });
    },
    [updateProject],
  );

  const handleLogoUpload = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      updateProject((prev) => ({
        ...prev,
        brand: { ...prev.brand, logoUrl: url, accentColor: prev.brand?.accentColor ?? DEFAULT_ACCENT },
      }));
    },
    [updateProject],
  );

  const handleBackgroundUpload = useCallback(
    (index: number, file: File) => {
      const url = URL.createObjectURL(file);
      updateSlide(index, (slide) => ({ ...slide, backgroundUrl: url }));
    },
    [updateSlide],
  );

  const resetBackground = useCallback(
    (index: number) => {
      updateSlide(index, (slide) => ({
        ...slide,
        backgroundUrl: DEFAULT_BACKGROUNDS[index % DEFAULT_BACKGROUNDS.length],
      }));
    },
    [updateSlide],
  );

  const handleImageUpload = useCallback(
    (
      index: number,
      field: "subjectUrl" | "cutoutLeftUrl" | "cutoutRightUrl",
      file: File,
    ) => {
      const url = URL.createObjectURL(file);
      updateSlide(index, (slide) => ({ ...slide, [field]: url }));
    },
    [updateSlide],
  );

  const handleImageRemove = useCallback(
    (
      index: number,
      field: "subjectUrl" | "cutoutLeftUrl" | "cutoutRightUrl",
    ) => {
      updateSlide(index, (slide) => ({
        ...slide,
        [field]: undefined,
      }));
    },
    [updateSlide],
  );

  const handlePlacedIconMove = useCallback(
    (index: number, id: string, x: number, y: number) => {
      updateSlide(index, (slide) => ({
        ...slide,
        placedIcons: (slide.placedIcons ?? []).map((icon) =>
          icon.id === id ? { ...icon, x, y } : icon,
        ),
      }));
    },
    [updateSlide],
  );

  const activeSlide = useMemo(
    () => (project ? project.slides[activeIndex] : null),
    [project, activeIndex],
  );

  if (!project) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-16">
        <GenerateForm onGenerated={handleGenerated} />
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              if (confirm("Start a new carousel? Unsaved blob URLs will be lost.")) {
                clearProject();
                setProject(null);
                setActiveIndex(0);
              }
            }}
            className="flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            New carousel
          </button>
          <h1 className="text-lg font-semibold text-white">{project.title}</h1>
        </div>
        <ExportButton project={project} />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 shrink-0 overflow-y-auto border-r border-zinc-800 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Slides
          </p>
          <div className="space-y-2">
            {project.slides.map((slide, index) => (
              <div key={index} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveIndex(index);
                    setSelectedIconId(null);
                  }}
                  className={`flex-1 rounded-lg border px-3 py-2 text-left text-sm transition ${
                    activeIndex === index
                      ? "border-red-500 bg-red-500/10 text-white"
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  {index + 1}. {slide.headlineBottom}
                </button>
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveSlide(index, -1)}
                    disabled={index === 0}
                    className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white disabled:opacity-30"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSlide(index, 1)}
                    disabled={index === project.slides.length - 1}
                    className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white disabled:opacity-30"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main
          ref={previewRef}
          className="flex flex-1 items-center justify-center overflow-auto bg-zinc-900/50 p-8"
        >
          {activeSlide && (
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "center center",
              }}
            >
              <SlideCanvas
                slide={activeSlide}
                brand={project.brand}
                projectDefaultStyle={project.defaultStyle}
                editable
                selectedIconId={selectedIconId}
                onPlacedIconMove={(id, x, y) =>
                  handlePlacedIconMove(activeIndex, id, x, y)
                }
                onPlacedIconSelect={setSelectedIconId}
              />
            </div>
          )}
        </main>

        <aside className="w-96 shrink-0 overflow-y-auto border-l border-zinc-800 p-4">
          <CarouselEditor
            project={project}
            activeIndex={activeIndex}
            selectedIconId={selectedIconId}
            onPlacedIconSelect={setSelectedIconId}
            onProjectChange={updateProject}
            onSlideChange={updateSlide}
            onLogoUpload={handleLogoUpload}
            onBackgroundUpload={handleBackgroundUpload}
            onResetBackground={resetBackground}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
          />
        </aside>
      </div>
    </div>
  );
}
