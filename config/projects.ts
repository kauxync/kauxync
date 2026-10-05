export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  title: string;
  summary: string;
  tech: string[];
  status?: string;
  badge?: string;
  featured?: boolean;
  links?: ProjectLink[];
}

export const projectsContent = {
  eyebrow: "Selected Work",
  heading: "Projects",
  intro:
    "Web and mobile applications, developer tools, and digital platforms I build, experiment with, and maintain.",
} as const;

export const projects: Project[] = [
  {
    title: "PostPencil",
    summary:
      "Minimalist, distraction-free markdown publishing toolkit and content creation suite designed for modern writers and developers, featuring instant live preview and zero-clutter typography.",
    tech: ["TypeScript", "Next.js", "React", "Tailwind CSS"],
    status: "LIVE",
    badge: "Open Source Tool",
    featured: true,
    links: [
      { label: "Live App", url: "https://postpencil.vercel.app" },
      { label: "GitHub", url: "https://github.com/kauxync/postpencil" },
    ],
  },
  {
    title: "FlexStudio",
    summary:
      "Premium digital marketplace and freelancing platform for buying and selling web templates, UI kits, and full-stack source code packages with interactive previews, multi-role auth, and checkout flow.",
    tech: ["Next.js 16", "React 19", "Tailwind CSS v4", "Prisma", "Neon PostgreSQL"],
    status: "LIVE",
    badge: "Digital Marketplace",
    featured: true,
    links: [
      { label: "Live Platform", url: "https://flexstudio.kauxync.in" },
      { label: "GitHub", url: "https://github.com/kauxync/flexstudio" },
    ],
  },
  {
    title: "Omni Article",
    summary:
      "Universal article reader and multi-language translation platform built to streamline article reading and localization across 30+ languages with clean responsive output, dual-view, and interactive vocabulary.",
    tech: ["JavaScript", "Node.js", "Express", "Vercel"],
    status: "LIVE",
    badge: "Universal Reader",
    featured: false,
    links: [
      { label: "Live App", url: "https://project-omniarticle.kauxync.in/" },
      { label: "GitHub", url: "https://github.com/kauxync/OmniArticle" },
    ],
  },
  {
    title: "Kauxync Platform",
    summary:
      "The personal digital identity and MDX publishing engine featuring live GitHub telemetry streaming, multi-palette theming, keyboard-driven command palette, and neo-brutalist editorial design.",
    tech: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4"],
    status: "FLAGSHIP",
    badge: "Identity Engine",
    featured: false,
    links: [
      { label: "Live URL", url: "https://kauxync.in" },
      { label: "GitHub", url: "https://github.com/kauxync/kauxync" },
    ],
  },
];
