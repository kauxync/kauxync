"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/post-utils";
import { PostRow } from "@/components/ui/post-row";
import { AnimateStagger, AnimateIn } from "@/components/ui/animate-ui";

interface BlogListProps {
  posts: PostMeta[];
  pagePosts: PostMeta[];
  currentPage: number;
  totalPages: number;
}

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const windowed = new Set<number>([
    1,
    2,
    current - 1,
    current,
    current + 1,
    total - 1,
    total,
  ]);
  const pages = [...windowed]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i] - pages[i - 1] > 1) out.push("…");
    out.push(pages[i]);
  }
  return out;
}

function pageHref(page: number): string {
  return page === 1 ? "/blog" : `/blog?page=${page}`;
}

export function BlogList({ posts, pagePosts, currentPage, totalPages }: BlogListProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (event.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return posts.filter((post) =>
      [post.title, post.description, ...(post.tags ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [posts, query]);

  const visible = filtered ?? pagePosts;

  return (
    <>
      <AnimateIn variant="up" className="mb-8 flex items-center gap-4">
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter posts…  ( / )"
          aria-label="Filter posts"
          autoComplete="off"
          className="h-12 w-full max-w-md border border-foreground bg-transparent px-4 text-sm font-medium outline-none placeholder:text-muted focus:border-accent"
        />
        <span className="eyebrow">
          {filtered ? `${filtered.length}/${posts.length}` : `Page ${currentPage}/${totalPages}`}
        </span>
      </AnimateIn>

      {visible.length > 0 ? (
        <AnimateStagger
          key={query}
          stagger={0.08}
          delay={0.05}
          as="ul"
          className="divide-y divide-line border-y border-line"
        >
          {visible.map((post, index) => (
            <PostRow key={post.slug} post={post} index={index} />
          ))}
        </AnimateStagger>
      ) : (
        <p className="border-y border-line py-10 text-sm text-muted">
          No posts match “{query}”.
        </p>
      )}

      {!filtered && totalPages > 1 ? (
        <AnimateIn variant="up" delay={0.15} as="nav" aria-label="Blog pages" className="mt-10 flex flex-wrap items-center gap-2">
          {currentPage > 1 ? (
            <Link
              href={pageHref(currentPage - 1)}
              className="inline-flex h-11 items-center border border-foreground px-4 text-xs font-bold uppercase tracking-widest transition-colors duration-200 hover:bg-foreground hover:text-background"
            >
              ← Prev
            </Link>
          ) : null}
          {pageNumbers(currentPage, totalPages).map((page, i) =>
            page === "…" ? (
              <span key={`gap-${i}`} aria-hidden className="px-1 text-sm text-muted">
                …
              </span>
            ) : (
              <Link
                key={page}
                href={pageHref(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
                className={`inline-flex h-11 min-w-11 items-center justify-center border px-3 text-xs font-bold tracking-widest transition-colors duration-200 ${
                  page === currentPage
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground hover:bg-foreground hover:text-background"
                }`}
              >
                {page}
              </Link>
            ),
          )}
          {currentPage < totalPages ? (
            <Link
              href={pageHref(currentPage + 1)}
              className="inline-flex h-11 items-center border border-foreground px-4 text-xs font-bold uppercase tracking-widest transition-colors duration-200 hover:bg-foreground hover:text-background"
            >
              Next →
            </Link>
          ) : null}
        </AnimateIn>
      ) : null}
    </>
  );
}
