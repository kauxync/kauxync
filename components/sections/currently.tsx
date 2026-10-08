"use client";

import { currentlyContent } from "@/config/content";
import { Section } from "@/components/ui/section";
import { AnimateStagger, AnimateItem } from "@/components/ui/animate-ui";

const CURRENTLY_THEMES = [
  {
    bg: "bg-[#f0fdf4] dark:bg-[#062013]",
    border: "border-foreground",
    shadow: "shadow-[4px_4px_0px_#22c55e] dark:shadow-[4px_4px_0px_#16a34a]",
    pulse: "bg-[#16a34a]",
    statusText: "text-[#15803d] dark:text-[#4ade80]",
  },
  {
    bg: "bg-[#f0f9ff] dark:bg-[#061e2b]",
    border: "border-foreground",
    shadow: "shadow-[4px_4px_0px_#0ea5e9] dark:shadow-[4px_4px_0px_#0284c7]",
    pulse: "bg-[#0284c7]",
    statusText: "text-[#0369a1] dark:text-[#38bdf8]",
  },
  {
    bg: "bg-[#faf5ff] dark:bg-[#190c29]",
    border: "border-foreground",
    shadow: "shadow-[4px_4px_0px_#a855f7] dark:shadow-[4px_4px_0px_#9333ea]",
    pulse: "bg-[#9333ea]",
    statusText: "text-[#7e22ce] dark:text-[#c084fc]",
  },
  {
    bg: "bg-[#fffbeb] dark:bg-[#261805]",
    border: "border-foreground",
    shadow: "shadow-[4px_4px_0px_#f59e0b] dark:shadow-[4px_4px_0px_#d97706]",
    pulse: "bg-[#d97706]",
    statusText: "text-[#b45309] dark:text-[#fbbf24]",
  },
];

export function Currently() {
  return (
    <Section
      id="currently"
      index={currentlyContent.index}
      heading={currentlyContent.heading}
      variant="blur"
    >
      <AnimateStagger
        stagger={0.1}
        delay={0.06}
        as="ul"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {currentlyContent.items.map((item, idx) => {
          const theme = CURRENTLY_THEMES[idx % CURRENTLY_THEMES.length];
          return (
            <AnimateItem
              key={item.status}
              as="li"
              variant="scale"
              className={`card-hover border-2 ${theme.border} ${theme.bg} ${theme.shadow} flex items-start gap-3.5 p-5`}
            >
              <span
                aria-hidden
                className={`dot-pulse mt-[6px] h-2.5 w-2.5 shrink-0 rounded-full ${theme.pulse}`}
              />
              <div>
                <p className={`text-xs font-mono font-bold uppercase tracking-wider ${theme.statusText}`}>
                  {item.status}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground/85 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </AnimateItem>
          );
        })}
      </AnimateStagger>
      <p className="mt-6 text-xs font-mono text-muted flex items-center gap-2">
        <span className="h-1.5 w-1.5 bg-[#fbbf24] inline-block" />
        <span>Inspired by the /now movement · Actively updated</span>
      </p>
    </Section>
  );
}
