"use client";

import { IconMoon, IconSun } from "@/components/ui/icons";
import { toggleTheme } from "@/lib/theme";

export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={() => toggleTheme()}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className="inline-flex h-10 w-10 items-center justify-center rounded-none text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-foreground"
    >
      <IconMoon className="h-[1.15rem] w-[1.15rem] dark:hidden" />
      <IconSun className="hidden h-[1.15rem] w-[1.15rem] dark:block" />
    </button>
  );
}
