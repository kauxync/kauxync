"use client";

import { useEffect, useSyncExternalStore } from "react";
import { isSoundEnabled, setSoundEnabled, playMechanicalClick } from "@/lib/sound";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("kauxync-sound-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("kauxync-sound-change", callback);
  };
}

export function SoundToggle() {
  const enabled = useSyncExternalStore(
    subscribe,
    isSoundEnabled,
    () => false
  );

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest("button") ||
        target?.closest("a") ||
        target?.closest(".card-hover")
      ) {
        playMechanicalClick();
      }
    };

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const handleToggle = () => {
    const next = !enabled;
    setSoundEnabled(next);
    window.dispatchEvent(new Event("kauxync-sound-change"));
    if (next) {
      setTimeout(() => playMechanicalClick(1.2), 50);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={enabled ? "Disable mechanical click sounds" : "Enable mechanical click sounds"}
      title={enabled ? "Sound FX: ON (Click to mute)" : "Sound FX: OFF (Click to enable mechanical clicks)"}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-none border border-line text-xs font-mono font-bold transition-all duration-200 ${
        enabled
          ? "border-foreground bg-[#dcfce7] text-[#15803d] dark:bg-[#052e16] dark:text-[#86efac] shadow-[2px_2px_0px_#16a34a]"
          : "text-muted hover:border-foreground hover:text-foreground"
      }`}
    >
      {enabled ? (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
