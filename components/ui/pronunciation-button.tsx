"use client";

import { useState, useCallback } from "react";

export function PronunciationButton() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = useCallback(() => {
    if (typeof window === "undefined") return;

    const win = window as unknown as {
      speechSynthesis?: SpeechSynthesis;
      AudioContext?: typeof AudioContext;
      webkitAudioContext?: typeof AudioContext;
    };

    if (win.speechSynthesis) {
      win.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Kaushalendra Kumar");
      utterance.rate = 0.88;
      utterance.pitch = 1.0;
      utterance.lang = "en-IN";

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      win.speechSynthesis.speak(utterance);
      return;
    }

    // Audio API tone fallback
    try {
      const AudioCtxClass = win.AudioContext || win.webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      setIsPlaying(true);
      setTimeout(() => {
        osc.stop();
        ctx.close();
        setIsPlaying(false);
      }, 600);
    } catch {
      setIsPlaying(false);
    }
  }, []);

  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label="Listen to pronunciation of Kaushalendra Kumar"
      title="Click to hear pronunciation"
      className="inline-flex items-center gap-2 border-2 border-foreground bg-[#fffbeb] dark:bg-[#281b07] px-3 py-1 text-xs font-mono font-bold text-[#b45309] dark:text-[#fde68a] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#fef3c7] dark:hover:bg-[#3d290b] shadow-[3px_3px_0px_#f59e0b]"
    >
      <span className="text-foreground/80 dark:text-foreground/90 tracking-normal">
        [ kaw-shuh-len-druh ]
      </span>
      <span className="flex items-center gap-1 text-foreground">
        {isPlaying ? (
          <span className="flex items-center gap-0.5 h-3">
            <span className="w-1 bg-[#d97706] animate-[pulse_0.4s_ease-in-out_infinite] h-3" />
            <span className="w-1 bg-[#d97706] animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
            <span className="w-1 bg-[#d97706] animate-[pulse_0.5s_ease-in-out_infinite] h-4" />
          </span>
        ) : (
          <svg
            className="h-3.5 w-3.5 text-[#b45309] dark:text-[#fcd34d]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </span>
    </button>
  );
}
