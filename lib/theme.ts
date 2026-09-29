import { siteConfig } from "@/config/site";

export type ThemeName = "light" | "dark";

export type PaletteName = "teal" | "lime" | "cobalt" | "vermillion" | "violet";

export interface PaletteInfo {
  id: PaletteName;
  name: string;
  accent: string;
  description: string;
}

export const PALETTES: PaletteInfo[] = [
  { id: "teal", name: "Emerald Teal", accent: "#0f766e", description: "Default editorial cyan/teal" },
  { id: "lime", name: "Electric Lime", accent: "#4d7c0f", description: "Bold ink & vibrant lime" },
  { id: "cobalt", name: "Swiss Cobalt", accent: "#1d4ed8", description: "Sharp international blue" },
  { id: "vermillion", name: "Vermillion Poster", accent: "#c0300f", description: "Warm terracotta & red" },
  { id: "violet", name: "Electric Violet", accent: "#6d28d9", description: "Deep synthwave purple" },
];

export const PALETTE_STORAGE_KEY = "kauxync-palette";

export function getTheme(): ThemeName {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function toggleTheme(): ThemeName {
  const root = document.documentElement;
  const dark = !root.classList.contains("dark");
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
  try {
    window.localStorage.setItem(
      siteConfig.themeStorageKey,
      dark ? "dark" : "light",
    );
  } catch {
    /* storage unavailable */
  }
  return dark ? "dark" : "light";
}

export function getPalette(): PaletteName {
  if (typeof document === "undefined") return "teal";
  const attr = document.documentElement.getAttribute("data-palette");
  return (attr as PaletteName) || "teal";
}

export function setPalette(palette: PaletteName): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-palette", palette);
  try {
    window.localStorage.setItem(PALETTE_STORAGE_KEY, palette);
  } catch {
    /* storage unavailable */
  }
}

export function cyclePalette(): PaletteName {
  const current = getPalette();
  const currentIndex = PALETTES.findIndex((p) => p.id === current);
  const nextIndex = (currentIndex + 1) % PALETTES.length;
  const nextPalette = PALETTES[nextIndex].id;
  setPalette(nextPalette);
  return nextPalette;
}
