"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/post-utils";

export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string | null>(
    entries.length > 0 ? entries[0].id : null,
  );

  useEffect(() => {
    const headings = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (observed) => {
        for (const entry of observed) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [entries]);

  return (
    <nav aria-label="Table of contents" className="sticky top-24 border-l border-line pl-5">
      <p className="eyebrow">On this page</p>
      <ul className="mt-3 space-y-2.5">
        {entries.map((entry) => {
          const isActive = entry.id === active;
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`link-underline inline-flex items-center gap-2 text-sm transition-colors duration-200 ${
                  isActive
                    ? "font-semibold text-accent"
                    : "text-muted hover:text-accent"
                }`}
              >
                <span
                  aria-hidden
                  className={`h-1.5 w-1.5 shrink-0 ${isActive ? "bg-accent" : "bg-line"}`}
                />
                {entry.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
