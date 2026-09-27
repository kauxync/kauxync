"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed right-6 bottom-6 z-[60] flex h-11 w-11 items-center justify-center border border-foreground bg-background text-lg font-bold shadow-[var(--shadow-card)] transition-colors duration-200 hover:bg-foreground hover:text-background"
    >
      <span aria-hidden>↑</span>
    </button>
  );
}
