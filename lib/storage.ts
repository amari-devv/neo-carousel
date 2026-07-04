import type { CarouselProject } from "./schema";

const STORAGE_KEY = "neo-carousel-project";

export function saveProject(project: CarouselProject): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
}

export function loadProject(): CarouselProject | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CarouselProject;
  } catch {
    return null;
  }
}

export function clearProject(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
