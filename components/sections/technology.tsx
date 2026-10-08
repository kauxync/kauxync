"use client";

import { technologyContent } from "@/config/content";
import { Section } from "@/components/ui/section";
import { AnimateStagger, AnimateItem } from "@/components/ui/animate-ui";

const GROUP_STYLES: Record<string, { badge: string; chip: string }> = {
  Frontend: {
    badge: "text-[#0284c7] dark:text-[#38bdf8]",
    chip: "bg-[#f0f9ff] text-[#0369a1] border-[#7dd3fc] hover:bg-[#e0f2fe] dark:bg-[#082f49]/60 dark:text-[#7dd3fc] dark:border-[#0369a1]",
  },
  Backend: {
    badge: "text-[#16a34a] dark:text-[#4ade80]",
    chip: "bg-[#f0fdf4] text-[#15803d] border-[#86efac] hover:bg-[#dcfce7] dark:bg-[#052e16]/60 dark:text-[#86efac] dark:border-[#15803d]",
  },
  Database: {
    badge: "text-[#7c3aed] dark:text-[#a78bfa]",
    chip: "bg-[#f5f3ff] text-[#6d28d9] border-[#c4b5fd] hover:bg-[#ede9fe] dark:bg-[#2e1065]/60 dark:text-[#c4b5fd] dark:border-[#6d28d9]",
  },
  Mobile: {
    badge: "text-[#ea580c] dark:text-[#fb923c]",
    chip: "bg-[#fff7ed] text-[#c2410c] border-[#fdba74] hover:bg-[#ffedd5] dark:bg-[#431407]/60 dark:text-[#fdba74] dark:border-[#c2410c]",
  },
  "Tools & Cloud": {
    badge: "text-[#e11d48] dark:text-[#fb7185]",
    chip: "bg-[#fff1f2] text-[#be123c] border-[#fecdd3] hover:bg-[#ffe4e6] dark:bg-[#4c0519]/60 dark:text-[#fecdd3] dark:border-[#be123c]",
  },
};

const DEFAULT_STYLE = {
  badge: "text-foreground",
  chip: "bg-surface-2 text-foreground border-line",
};

export function Technology() {
  return (
    <Section
      id="technology"
      index={technologyContent.index}
      heading={technologyContent.heading}
    >
      <AnimateStagger
        stagger={0.1}
        delay={0.05}
        as="ul"
        className="divide-y divide-line border-y border-line"
      >
        {technologyContent.groups.map((group) => {
          const style = GROUP_STYLES[group.label] ?? DEFAULT_STYLE;
          return (
            <AnimateItem
              key={group.label}
              as="li"
              variant="up"
              className="grid gap-3 py-5 sm:grid-cols-[9.5rem_1fr] sm:items-center sm:gap-8 sm:py-6"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-current" style={{ color: "currentColor" }} />
                <span className={`font-mono text-xs font-bold uppercase tracking-widest ${style.badge}`}>
                  {group.label}
                </span>
              </div>
              <AnimateStagger
                stagger={0.04}
                delay={0.02}
                className="flex flex-wrap gap-2"
              >
                {group.items.map((item) => (
                  <AnimateItem
                    key={item}
                    as="span"
                    variant="badge"
                    className={`inline-flex items-center border px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-150 hover:-translate-y-0.5 shadow-[2px_2px_0px_rgba(0,0,0,0.06)] dark:shadow-[2px_2px_0px_rgba(0,0,0,0.3)] ${style.chip}`}
                  >
                    {item}
                  </AnimateItem>
                ))}
              </AnimateStagger>
            </AnimateItem>
          );
        })}
      </AnimateStagger>
    </Section>
  );
}
