export const siteConfig = {
  name: "Kauxync",
  realName: "Kaushalendra Kumar",
  identity: "Developer · Creator · Builder",
  brandStatement: "Build. Create. Sync.",
  url: "https://kauxync.in",
  email: "owner@kauxync.in",
  title: "Kauxync — Kaushalendra Kumar | Developer, Creator & Builder",
  description:
    "Kauxync is the personal digital identity of Kaushalendra Kumar, a developer and technology enthusiast building software, exploring technology, and creating digital experiences.",
  keywords: [
    "Kauxync",
    "Kaushalendra Kumar",
    "developer",
    "creator",
    "builder",
    "web developer",
    "software builder",
    "full-stack developer",
    "Next.js",
    "React",
    "portfolio",
  ],
  themeStorageKey: "kauxync-theme",
  nav: [
    { label: "About", href: "/#about" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Connect", href: "/#connect" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
