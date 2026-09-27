"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toggleTheme } from "@/lib/theme";

export interface PaletteItem {
  label: string;
  hint?: string;
  href?: string;
  action?: "theme";
}

export function CommandPalette({ items }: { items: PaletteItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
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
  }, [open ]);

  const results = useMemo(() => {
    const all: PaletteItem[] = [
      ...items,
      { label: "Toggle theme", hint: "Action", action: "theme" },
    ];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        (item.hint ?? "").toLowerCase().includes(q),
    );
  }, [items, query]);

  const clamped = results.length === 0 ? 0 : Math.min(active, results.length - 1);

  const run = useCallback(
    (index: number) => {
      const item = results[index];
      if (!item) return;
      if (item.action === "theme") toggleTheme();
      else if (item.href) router.push(item.href);
      close();
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
          <div className="card relative mx-auto mt-[10vh] max-w-xl overflow-hidden">
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKey}
              placeholder="Type a command or search…"
              aria-label="Search commands"
              autoComplete="off"
              className="w-full border-b border-line bg-transparent px-5 py-4 text-sm font-medium outline-none placeholder:text-muted"
            />
            <ul className="max-h-[40vh] overflow-y-auto p-2">
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
                    <span>{item.label}</span>
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
                <li className="px-4 py-6 text-sm text-muted">No matches.</li>
              ) : null}
            </ul>
            <p className="border-t border-line px-5 py-2.5 text-[0.6875rem] font-bold uppercase tracking-widest text-muted">
              ↑↓ navigate · Enter open · Esc close
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
