export const heroContent = {
  tagline:
    "I build software, explore technology, and turn ideas into useful digital experiences.",
  actions: {
    primaryLabel: "GitHub",
    secondaryLabel: "Connect",
    secondaryHref: "#connect",
  },
} as const;

export const aboutContent = {
  heading: "About",
  index: "01",
  paragraphs: [
    "I'm Kaushalendra Kumar, known online as Kauxync. I'm a full-stack developer and software builder working across web and mobile — interfaces, backends, databases, and apps.",
    "I enjoy turning ideas into practical digital products, and I'm always exploring new technologies and better ways to build software.",
  ],
} as const;

export const identityContent = {
  heading: "What I Do",
  index: "02",
  blocks: [
    {
      index: "01",
      title: "Build",
      body: "I build web applications, mobile apps, developer tools, and digital products.",
    },
    {
      index: "02",
      title: "Explore",
      body: "I explore programming, software architecture, emerging technologies, and new ideas.",
    },
    {
      index: "03",
      title: "Create",
      body: "I create projects, experiments, tools, and digital experiences.",
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
        "HTML",
        "CSS",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Tailwind CSS",
      ],
    },
    { label: "Backend", items: ["Node.js", "PHP", "Laravel"] },
    { label: "Database", items: ["MySQL", "PostgreSQL", "MongoDB"] },
    { label: "Mobile", items: ["Java", "Android", "React Native", "Expo"] },
    { label: "Tools", items: ["Git", "GitHub", "Linux", "AWS", "Vercel"] },
  ],
} as const;

export const workContent = {
  heading: "Selected Work",
  index: "04",
} as const;

export const writingContent = {
  heading: "Latest Writing",
  index: "05",
} as const;

export const currentlyContent = {
  heading: "Currently",
  index: "06",
  items: [
    { status: "Building", detail: "with Next.js" },
    { status: "Exploring", detail: "software architecture" },
    { status: "Learning", detail: "new technologies" },
    { status: "Experimenting", detail: "with digital products" },
  ],
} as const;

export const connectContent = {
  heading: "Find Me",
  index: "07",
  contactPrompt: "Have something interesting to discuss?",
  contactAction: "Email Me",
} as const;
