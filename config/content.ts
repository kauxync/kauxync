export const heroContent = {
  tagline:
    "Full-stack developer and software builder focused on scalable web apps, clean systems architecture, and useful digital products.",
  actions: {
    primaryLabel: "GitHub",
    secondaryLabel: "Get in Touch",
    secondaryHref: "#connect",
  },
} as const;

export const aboutContent = {
  heading: "About",
  index: "01",
  paragraphs: [
    "I'm Kaushalendra Kumar, known online as Kauxync. I'm a full-stack developer and software builder working across web and mobile — crafting high-performance interfaces, scalable backends, databases, and apps.",
    "My focus is on turning ambitious ideas into resilient, well-crafted software. I work extensively with Next.js, TypeScript, React, Node.js, and modern cloud infrastructure, prioritizing speed, clean architecture, and delightful user experiences.",
    "Beyond software engineering, I'm passionate about open-source collaboration, writing in-depth technical guides, and empowering regional developer communities.",
  ],
} as const;

export const identityContent = {
  heading: "What I Do",
  index: "02",
  blocks: [
    {
      index: "01",
      title: "Build",
      body: "High-performance web applications, robust APIs, mobile apps, and developer tools engineered for reliability and scale.",
    },
    {
      index: "02",
      title: "Explore",
      body: "Distributed systems, modern software architecture, frontend performance optimizations, and emerging developer platforms.",
    },
    {
      index: "03",
      title: "Create",
      body: "Open-source repositories, community platforms, deep-dive technical tutorials, and minimalist digital experiences.",
    },
  ],
} as const;

export const technologyContent = {
  heading: "Technology",
  index: "03",
  groups: [
    {
      label: "Frontend",
      items: [
        "TypeScript",
        "React",
        "Next.js",
        "Tailwind CSS",
        "HTML5",
        "CSS3",
        "JavaScript (ESNext)",
      ],
    },
    { label: "Backend", items: ["Node.js", "PHP", "Laravel", "REST APIs", "GraphQL"] },
    { label: "Database", items: ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "Prisma"] },
    { label: "Mobile", items: ["React Native", "Expo", "Android", "Java"] },
    { label: "Tools & Cloud", items: ["Git", "GitHub", "Linux", "AWS", "Vercel", "Docker"] },
  ],
} as const;

export const workContent = {
  heading: "Selected Work",
  index: "04",
} as const;

export const philosophyContent = {
  heading: "Philosophy & Principles",
  index: "05",
} as const;

export const timelineContent = {
  heading: "Journey & Milestones",
  index: "06",
} as const;

export const writingContent = {
  heading: "Latest Writing",
  index: "07",
} as const;

export const currentlyContent = {
  heading: "Currently",
  index: "08",
  items: [
    { status: "Building", detail: "Next.js applications & open-source developer toolkits" },
    { status: "Exploring", detail: "Low-latency systems & cloud architectures" },
    { status: "Writing", detail: "Deep-dive technical guides on systems & programming" },
    { status: "Collaborating", detail: "With founders & builders on ambitious digital products" },
  ],
} as const;

export const guestbookContent = {
  heading: "Community Guestbook",
  index: "09",
} as const;

export const connectContent = {
  heading: "Find Me",
  index: "10",
  contactPrompt: "Have a project, role, or idea you'd like to bring to life?",
  contactAction: "Email Me Directly",
} as const;
