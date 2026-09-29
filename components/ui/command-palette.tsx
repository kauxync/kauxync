"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toggleTheme, cyclePalette, setPalette, PALETTES, type PaletteName } from "@/lib/theme";
import { siteConfig } from "@/config/site";
import { socialLinks } from "@/config/social";

export interface PaletteItem {
  label: string;
  hint?: string;
  href?: string;
  action?: "theme" | "cycle-palette" | "set-palette" | "copy-email" | "external";
  paletteId?: PaletteName;
  externalUrl?: string;
}

export function CommandPalette({ items }: { items: PaletteItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    setFeedback(null);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const defaultActions: PaletteItem[] = useMemo(
    () => [
      { label: "Copy email address", hint: "Action", action: "copy-email" },
      { label: "Cycle color theme", hint: "Theme", action: "cycle-palette" },
      { label: "Toggle dark / light mode", hint: "Theme", action: "theme" },
      ...PALETTES.map((p) => ({
        label: `Theme: ${p.name}`,
        hint: "Palette",
        action: "set-palette" as const,
        paletteId: p.id,
      })),
      { label: "Send a message", hint: "Connect", href: "/#connect" },
      ...socialLinks
        .filter((l) => l.external)
        .map((l) => ({
          label: `${l.name} (${l.handle})`,
          hint: "Social",
          action: "external" as const,
          externalUrl: l.url,
        })),
    ],
    [],
  );

  const results = useMemo(() => {
    const all: PaletteItem[] = [...items, ...defaultActions];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        (item.hint ?? "").toLowerCase().includes(q),
    );
  }, [items, defaultActions, query]);

  const clamped = results.length === 0 ? 0 : Math.min(active, results.length - 1);

  const run = useCallback(
    async (index: number) => {
      const item = results[index];
      if (!item) return;

      if (item.action === "theme") {
        toggleTheme();
        setFeedback("Theme toggled!");
        setTimeout(close, 400);
      } else if (item.action === "cycle-palette") {
        const next = cyclePalette();
        const found = PALETTES.find((p) => p.id === next);
        setFeedback(`Switched to ${found?.name ?? next}!`);
        setTimeout(close, 500);
      } else if (item.action === "set-palette" && item.paletteId) {
        setPalette(item.paletteId);
        const found = PALETTES.find((p) => p.id === item.paletteId);
        setFeedback(`Switched to ${found?.name}!`);
        setTimeout(close, 500);
      } else if (item.action === "copy-email") {
        try {
          if (navigator?.clipboard?.writeText) {
            await navigator.clipboard.writeText(siteConfig.email);
          }
          setFeedback(`Copied ${siteConfig.email}!`);
          setTimeout(close, 700);
        } catch {
          setFeedback("Could not copy email");
        }
      } else if (item.action === "external" && item.externalUrl) {
        window.open(item.externalUrl, "_blank", "noopener,noreferrer");
        close();
      } else if (item.href) {
        router.push(item.href);
        close();
      }
    },
    [results, close, router],
  );

  const onInputKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((value) => Math.min(value + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) => Math.max(value - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(clamped);
    } else if (event.key === "Escape") {
      close();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="hidden h-10 items-center gap-1.5 border border-line px-3 text-xs font-bold tracking-widest text-muted transition-colors duration-200 hover:border-foreground hover:text-foreground sm:inline-flex"
      >
        <span aria-hidden>⌘</span>K
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="fixed inset-0 z-[70] p-4"
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={close}
          />
          <div className="card relative mx-auto mt-[10vh] max-w-xl overflow-hidden shadow-[var(--shadow-lift)]">
            <div className="relative">
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Type a command or search… (e.g. email, theme, blog)"
                aria-label="Search commands"
                autoComplete="off"
                className="w-full border-b border-line bg-transparent px-5 py-4 text-sm font-medium outline-none placeholder:text-muted"
              />
              {feedback ? (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-none border border-accent bg-surface-2 px-2.5 py-1 text-xs font-mono font-bold text-accent">
                  {feedback}
                </div>
              ) : null}
            </div>
            <ul className="max-h-[44vh] overflow-y-auto p-2">
              {results.map((item, index) => (
                <li key={`${item.label}-${index}`}>
                  <button
                    type="button"
                    onClick={() => run(index)}
                    onMouseMove={() => setActive(index)}
                    className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-semibold transition-colors duration-100 ${
                      index === clamped
                        ? "bg-foreground text-background"
                        : "text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.action === "set-palette" && item.paletteId ? (
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full border border-line"
                          style={{
                            backgroundColor:
                              PALETTES.find((p) => p.id === item.paletteId)?.accent ??
                              "currentColor",
                          }}
                        />
                      ) : null}
                      <span>{item.label}</span>
                    </span>
                    {item.hint ? (
                      <span
                        className={`text-[0.6875rem] font-bold uppercase tracking-widest ${
                          index === clamped ? "text-background/70" : "text-muted"
                        }`}
                      >
                        {item.hint}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
              {results.length === 0 ? (
                <li className="px-4 py-6 text-sm text-muted">No matches found for “{query}”.</li>
              ) : null}
            </ul>
            <div className="flex items-center justify-between border-t border-line px-5 py-2.5 text-[0.6875rem] font-bold uppercase tracking-widest text-muted">
              <span>↑↓ navigate · Enter select · Esc close</span>
              <span>Kauxync</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
