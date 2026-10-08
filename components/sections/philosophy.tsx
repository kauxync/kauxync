"use client";

import { philosophyContent } from "@/config/content";
import { Section } from "@/components/ui/section";
import { AnimateStagger, AnimateItem } from "@/components/ui/animate-ui";

const PRINCIPLES = [
  {
    index: "01",
    title: "Pragmatic Over Dogmatic",
    body: "I choose technologies that solve real user problems with minimal complexity, not whatever is hyped on tech Twitter this week.",
    theme: {
      bg: "bg-[#f5eeff] dark:bg-[#1a0f2e]",
      shadow: "shadow-[6px_6px_0px_#a855f7] dark:shadow-[6px_6px_0px_#7e22ce]",
      badge: "bg-[#ede4fc] text-[#581c87] border-[#d8b4fe] dark:bg-[#2e1065] dark:text-[#d8b4fe]",
      title: "text-[#2e1065] dark:text-[#f3e8ff]",
    },
  },
  {
    index: "02",
    title: "Speed Is a Core Feature",
    body: "User respect starts with performance. Fast initial paints, snappy transitions, and lightweight payloads create delightful digital experiences.",
    theme: {
      bg: "bg-[#ecfeff] dark:bg-[#08222c]",
      shadow: "shadow-[6px_6px_0px_#06b6d4] dark:shadow-[6px_6px_0px_#0891b2]",
      badge: "bg-[#cffafe] text-[#0e7490] border-[#a5f3fc] dark:bg-[#164e63] dark:text-[#67e8f9]",
      title: "text-[#083344] dark:text-[#e0f2fe]",
    },
  },
  {
    index: "03",
    title: "Write Once, Read 100 Times",
    body: "Code is read far more often than it is written. Clean architectures, explicit naming, and tight type safety outshine clever one-liners every time.",
    theme: {
      bg: "bg-[#f0fdf4] dark:bg-[#091b11]",
      shadow: "shadow-[6px_6px_0px_#22c55e] dark:shadow-[6px_6px_0px_#16a34a]",
      badge: "bg-[#dcfce7] text-[#166534] border-[#bbf7d0] dark:bg-[#14532d] dark:text-[#dcfce7]",
      title: "text-[#166534] dark:text-[#dcfce7]",
    },
  },
  {
    index: "04",
    title: "Deep Fundamentals First",
    body: "Frameworks come and go, but protocols, the DOM, memory layouts, algorithms, and human psychology remain the bedrock of timeless software engineering.",
    theme: {
      bg: "bg-[#fffbeb] dark:bg-[#291b05]",
      shadow: "shadow-[6px_6px_0px_#f59e0b] dark:shadow-[6px_6px_0px_#d97706]",
      badge: "bg-[#fef3c7] text-[#b45309] border-[#fde68a] dark:bg-[#451a03] dark:text-[#fcd34d]",
      title: "text-[#451a03] dark:text-[#fef3c7]",
    },
  },
];

export function Philosophy() {
  return (
    <Section
      id="philosophy"
      index={philosophyContent.index}
      heading={philosophyContent.heading}
    >
      <AnimateStagger
        stagger={0.12}
        delay={0.06}
        className="grid gap-5 sm:grid-cols-2"
      >
        {PRINCIPLES.map((item) => (
          <AnimateItem
            key={item.title}
            variant="scale"
            className={`card-hover border-2 border-foreground ${item.theme.bg} ${item.theme.shadow} p-6 sm:p-7 flex flex-col justify-between`}
          >
            <div>
              <span
                aria-hidden
                className={`inline-flex items-center border px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider ${item.theme.badge}`}
              >
                RULE {item.index}
              </span>
              <h3 className={`mt-4 font-display text-2xl font-bold tracking-tight ${item.theme.title}`}>
                {item.title}
              </h3>
              <p className="mt-3 text-[0.975rem] leading-relaxed text-foreground/80 font-medium">
                {item.body}
              </p>
            </div>
          </AnimateItem>
        ))}
      </AnimateStagger>
    </Section>
  );
}
