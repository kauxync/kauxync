export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  title: string;
  summary: string;
  tech: string[];
  status?: string;
  links?: ProjectLink[];
}

export const projectsContent = {
  eyebrow: "Selected Work",
  heading: "Projects",
  intro: "Web and mobile applications, developer tools, and digital products I build and experiment with.",
} as const;

export const projects: Project[] = [
  {
    title: "Bihar Hate Archive",
    summary:
      "Placeholder entry — replace this with a real project: what it does, who it is for, and what makes it interesting.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Postgres"],
    status: "LIVE",
    links: [{ label: "GitHub", url: "https://github.com/kauxync"},{label: "Live URL", url: "https://biharhatearchive.org/" }],
  },
  {
    title: "Project Bihar",
    summary:
      "Placeholder entry — replace this with a real project: what it does, who it is for, and what makes it interesting.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Postgres"],
    status: "LIVE",
    links: [{ label: "GitHub", url: "https://github.com/kauxync"},{label: "Live URL", url: "https://projectbihar.org/" }],
  },
];
