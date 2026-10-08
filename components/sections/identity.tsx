"use client";

import { identityContent } from "@/config/content";
import { Section } from "@/components/ui/section";
import { AnimateStagger, AnimateItem } from "@/components/ui/animate-ui";
import { Card3D, Card3DItem } from "@/components/ui/card-3d";

const CARD_THEMES = [
  {
    bg: "bg-[#f5eeff] dark:bg-[#1a0f2e]",
    border: "border-foreground",
    shadow: "shadow-[6px_6px_0px_#a855f7] dark:shadow-[6px_6px_0px_#7e22ce]",
    chip: "bg-[#ede4fc] text-[#581c87] border-[#d8b4fe] dark:bg-[#2e1065] dark:text-[#d8b4fe]",
    title: "text-[#2e1065] dark:text-[#f3e8ff]",
    body: "text-[#4c1d95]/85 dark:text-[#d8b4fe]/85",
  },
  {
    bg: "bg-[#ecfeff] dark:bg-[#08222c]",
    border: "border-foreground",
    shadow: "shadow-[6px_6px_0px_#06b6d4] dark:shadow-[6px_6px_0px_#0891b2]",
    chip: "bg-[#cffafe] text-[#0e7490] border-[#a5f3fc] dark:bg-[#164e63] dark:text-[#67e8f9]",
    title: "text-[#083344] dark:text-[#e0f2fe]",
    body: "text-[#155e75]/85 dark:text-[#a5f3fc]/85",
  },
  {
    bg: "bg-[#fffbeb] dark:bg-[#291b05]",
    border: "border-foreground",
    shadow: "shadow-[6px_6px_0px_#f59e0b] dark:shadow-[6px_6px_0px_#d97706]",
    chip: "bg-[#fef3c7] text-[#b45309] border-[#fde68a] dark:bg-[#451a03] dark:text-[#fcd34d]",
    title: "text-[#451a03] dark:text-[#fef3c7]",
    body: "text-[#78350f]/85 dark:text-[#fde68a]/85",
  },
];

export function Identity() {
  return (
    <Section
      id="identity"
      index={identityContent.index}
      heading={identityContent.heading}
      variant="blur"
    >
      <AnimateStagger
        stagger={0.12}
        delay={0.08}
        as="ul"
        className="grid gap-5 sm:grid-cols-3"
      >
        {identityContent.blocks.map((block, idx) => {
          const theme = CARD_THEMES[idx % CARD_THEMES.length];
          return (
            <AnimateItem
              key={block.title}
              as="li"
              variant="scale"
              className="h-full"
            >
              <Card3D
                maxTilt={12}
                scale={1.02}
                containerClassName="h-full"
                className={`card-hover border-2 ${theme.border} ${theme.bg} ${theme.shadow} p-6 sm:p-7 flex flex-col justify-between h-full`}
              >
                <div>
                  <Card3DItem translateZ={25}>
                    <span
                      aria-hidden
                      className={`inline-flex items-center border px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider ${theme.chip}`}
                    >
                      {block.index}
                    </span>
                  </Card3DItem>
                  <Card3DItem translateZ={30}>
                    <h3 className={`mt-4 font-display text-2xl font-bold tracking-tight ${theme.title}`}>
                      {block.title}
                    </h3>
                  </Card3DItem>
                  <Card3DItem translateZ={15}>
                    <p className={`mt-3 text-[0.975rem] leading-relaxed font-medium ${theme.body}`}>
                      {block.body}
                    </p>
                  </Card3DItem>
                </div>
              </Card3D>
            </AnimateItem>
          );
        })}
      </AnimateStagger>
    </Section>
  );
}
