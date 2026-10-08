"use client";

import { IconArrowUpRight } from "@/components/ui/icons";
import type { Project } from "@/config/projects";
import { AnimateStagger, AnimateItem } from "@/components/ui/animate-ui";
import { Card3D, Card3DItem } from "@/components/ui/card-3d";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const PROJECT_THEMES = [
  // 0: Warm Coral / Amber (Project Bihar)
  {
    bg: "bg-[#fffaf5] dark:bg-[#1a110a]",
    border: "border-foreground",
    shadow: "shadow-[6px_6px_0px_#f97316] dark:shadow-[6px_6px_0px_#ea580c]",
    badge: "bg-[#ffedd5] text-[#9a3412] border-[#fed7aa] dark:bg-[#431407] dark:text-[#ffedd5]",
    chip: "bg-[#fff7ed] text-[#c2410c] border-[#fed7aa] dark:bg-[#2b1106] dark:text-[#fed7aa]",
    accentText: "text-[#c2410c] dark:text-[#fb923c]",
    pulse: "bg-[#ea580c]",
  },
  // 1: Fresh Mint / Emerald (PostPencil)
  {
    bg: "bg-[#f6fdf8] dark:bg-[#091b11]",
    border: "border-foreground",
    shadow: "shadow-[6px_6px_0px_#22c55e] dark:shadow-[6px_6px_0px_#16a34a]",
    badge: "bg-[#dcfce7] text-[#166534] border-[#bbf7d0] dark:bg-[#14532d] dark:text-[#dcfce7]",
    chip: "bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0] dark:bg-[#0f381f] dark:text-[#bbf7d0]",
    accentText: "text-[#15803d] dark:text-[#4ade80]",
    pulse: "bg-[#16a34a]",
  },
  // 2: Royal Violet / Electric Indigo (FlexStudio)
  {
    bg: "bg-[#faf5ff] dark:bg-[#1b0d2d]",
    border: "border-foreground",
    shadow: "shadow-[6px_6px_0px_#a855f7] dark:shadow-[6px_6px_0px_#9333ea]",
    badge: "bg-[#f3e8ff] text-[#6b21a8] border-[#e9d5ff] dark:bg-[#3b0764] dark:text-[#f3e8ff]",
    chip: "bg-[#faf5ff] text-[#7e22ce] border-[#e9d5ff] dark:bg-[#2e1065] dark:text-[#e9d5ff]",
    accentText: "text-[#7e22ce] dark:text-[#c084fc]",
    pulse: "bg-[#9333ea]",
  },
  // 3: Electric Indigo (Velox SaaS)
  {
    bg: "bg-[#f8f9ff] dark:bg-[#10122e]",
    border: "border-foreground",
    shadow: "shadow-[6px_6px_0px_#6366f1] dark:shadow-[6px_6px_0px_#4f46e5]",
    badge: "bg-[#e0e7ff] text-[#3730a3] border-[#c7d2fe] dark:bg-[#1e1b4b] dark:text-[#e0e7ff]",
    chip: "bg-[#eef2ff] text-[#4338ca] border-[#c7d2fe] dark:bg-[#181a42] dark:text-[#c7d2fe]",
    accentText: "text-[#4338ca] dark:text-[#818cf8]",
    pulse: "bg-[#4f46e5]",
  },
  // 4: Crisp Sky / Cyan (Omni Article)
  {
    bg: "bg-[#f6fcff] dark:bg-[#071926]",
    border: "border-foreground",
    shadow: "shadow-[6px_6px_0px_#0ea5e9] dark:shadow-[6px_6px_0px_#0284c7]",
    badge: "bg-[#e0f2fe] text-[#075985] border-[#bae6fd] dark:bg-[#082f49] dark:text-[#e0f2fe]",
    chip: "bg-[#f0f9ff] text-[#0369a1] border-[#bae6fd] dark:bg-[#0b2b3f] dark:text-[#bae6fd]",
    accentText: "text-[#0369a1] dark:text-[#38bdf8]",
    pulse: "bg-[#0284c7]",
  },
  // 5: Radiant Rose / Fuchsia (Kauxync Platform)
  {
    bg: "bg-[#fff5f8] dark:bg-[#1a0a14]",
    border: "border-foreground",
    shadow: "shadow-[6px_6px_0px_#f43f5e] dark:shadow-[6px_6px_0px_#e11d48]",
    badge: "bg-[#ffe4e6] text-[#9f1239] border-[#fecdd3] dark:bg-[#4c0519] dark:text-[#ffe4e6]",
    chip: "bg-[#fff1f2] text-[#be123c] border-[#fecdd3] dark:bg-[#320713] dark:text-[#fecdd3]",
    accentText: "text-[#be123c] dark:text-[#fb7185]",
    pulse: "bg-[#e11d48]",
  },
];

export function ProjectCard({ project, index }: ProjectCardProps) {
  const { title, summary, tech, status, links } = project;
  const theme = PROJECT_THEMES[index % PROJECT_THEMES.length];

  return (
    <Card3D
      maxTilt={9}
      scale={1.015}
      containerClassName="h-full"
      className={`card-hover flex h-full flex-col border-2 ${theme.border} ${theme.bg} ${theme.shadow} p-6 sm:p-7`}
    >
      <Card3DItem translateZ={15} className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center border border-foreground bg-background px-2.5 py-0.5 text-xs font-mono font-bold shadow-[2px_2px_0px_#18181b]">
            {String(index + 1).padStart(2, "0")}
          </span>
          {project.badge ? (
            <span
              className={`inline-flex items-center border px-2.5 py-0.5 text-[0.6875rem] font-mono font-bold uppercase tracking-wider ${theme.badge}`}
            >
              {project.badge}
            </span>
          ) : null}
        </div>
        {status ? (
          <span className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted">
            <span
              aria-hidden
              className={`dot-pulse h-2 w-2 rounded-full ${theme.pulse}`}
            />
            {status}
          </span>
        ) : null}
      </Card3DItem>

      <Card3DItem translateZ={25}>
        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
      </Card3DItem>

      <Card3DItem translateZ={15} className="flex-1">
        <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
          {summary}
        </p>
      </Card3DItem>

      {tech.length > 0 ? (
        <Card3DItem translateZ={20}>
          <AnimateStagger
            stagger={0.03}
            delay={0.05}
            as="ul"
            className="mt-5 flex flex-wrap gap-1.5"
          >
            {tech.map((item) => (
              <AnimateItem
                key={item}
                as="li"
                variant="badge"
                className={`inline-flex items-center border px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider ${theme.chip}`}
              >
                {item}
              </AnimateItem>
            ))}
          </AnimateStagger>
        </Card3DItem>
      ) : null}

      {links && links.length > 0 ? (
        <Card3DItem translateZ={25} className="mt-6 border-t border-line/80 pt-4">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-sm font-bold transition-all duration-200 hover:translate-x-0.5 link-underline ${theme.accentText}`}
                >
                  {link.label}
                  <IconArrowUpRight className="h-4 w-4" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Card3DItem>
      ) : null}
    </Card3D>
  );
}
