export interface UseItem {
  title: string;
  category: string;
  description: string;
  badge?: string;
  url?: string;
}

export const usesCategories = [
  "Workstation & Hardware",
  "Editor & Coding",
  "Terminal & Dev Tools",
  "Daily Productivity & Apps",
] as const;

export const usesData: UseItem[] = [
  // Hardware
  {
    title: "High-Performance Workstation",
    category: "Workstation & Hardware",
    description: "Custom workstation engineered for multi-threaded compilation, local container orchestration, and multi-display output.",
    badge: "Hardware",
  },
  {
    title: "Ultra-Wide High-Resolution Display",
    category: "Workstation & Hardware",
    description: "Wide color gamut monitor providing comfortable split-screen workflows between editor, terminal, and browser devtools.",
    badge: "Display",
  },
  {
    title: "Custom Mechanical Keyboard",
    category: "Workstation & Hardware",
    description: "Tactile switches with PBT keycaps for responsive feedback during long programming and writing sessions.",
    badge: "Peripherals",
  },

  // Editor
  {
    title: "VS Code / Cursor",
    category: "Editor & Coding",
    description: "Minimalist setup with distraction-free layout, vim keybindings, and selective language servers.",
    badge: "Primary Editor",
    url: "https://code.visualstudio.com/",
  },
  {
    title: "JetBrains Mono & TT Firs Neue",
    category: "Editor & Coding",
    description: "Crisp monospaced typography with distinct programming ligatures and clean optical weights.",
    badge: "Typography",
  },
  {
    title: "Tailwind CSS & ESLint",
    category: "Editor & Coding",
    description: "Automated linting, strict TypeScript rules, and utility-first styling for rapid interface development.",
    badge: "Tooling",
  },

  // Terminal
  {
    title: "Windows Terminal & PowerShell",
    category: "Terminal & Dev Tools",
    description: "Fast GPU-accelerated terminal with custom Starship prompt and Git branch telemetry.",
    badge: "Terminal",
  },
  {
    title: "Git & GitHub CLI",
    category: "Terminal & Dev Tools",
    description: "Daily version control, branch management, pull requests, and automated CI/CD workflows.",
    badge: "Version Control",
    url: "https://github.com/kauxync",
  },
  {
    title: "Docker & Container Tools",
    category: "Terminal & Dev Tools",
    description: "Isolated environments for PostgreSQL, Redis, and local microservice prototyping.",
    badge: "DevOps",
  },

  // Productivity
  {
    title: "Notion & Markdown",
    category: "Daily Productivity & Apps",
    description: "Knowledge management, architecture blueprints, article outlines, and personal task tracking.",
    badge: "Notes",
  },
  {
    title: "Raycast",
    category: "Daily Productivity & Apps",
    description: "Instant launcher, clipboard history, quick script execution, and window management.",
    badge: "Productivity",
    url: "https://www.raycast.com/",
  },
  {
    title: "Figma",
    category: "Daily Productivity & Apps",
    description: "Wireframing interfaces, exploring design tokens, and prototyping neo-brutalist component systems.",
    badge: "Design",
    url: "https://www.figma.com/",
  },
];
