import { siteConfig } from "@/config/site";

export type ThemeName = "light" | "dark";

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
