import { timelineContent } from "@/config/content";
import { Section } from "@/components/ui/section";

const MILESTONES = [
  {
    year: "2026",
    title: "Kauxync Digital Identity & Systems Publication",
    description: "Designed and built Kauxync as a personal brand platform. Launched deep-dive technical engineering series covering C systems and web internals.",
    badge: "Current Era",
    theme: {
      yearBadge: "bg-[#fbbf24] text-[#18181b] border-foreground",
      card: "bg-[#fffdf5] dark:bg-[#1f1606] shadow-[6px_6px_0px_#f59e0b]",
    },
  },
  {
    year: "2025",
    title: "Founded Project Bihar Community & Platform",
    description: "Initiated Project Bihar (projectbihar.org) to foster open-source collaboration, developer education, and localized technology initiatives across the region.",
    badge: "Ecosystem",
    theme: {
      yearBadge: "bg-[#ffedd5] text-[#9a3412] border-[#fdba74]",
      card: "bg-[#fffaf5] dark:bg-[#201206] shadow-[6px_6px_0px_#f97316]",
    },
  },
  {
    year: "2024",
    title: "PostPencil & Modern Next.js Architectures",
    description: "Built PostPencil for minimalist markdown writing, alongside high-conversion SaaS interfaces, design systems, and mobile prototypes.",
    badge: "Full-Stack",
    theme: {
      yearBadge: "bg-[#dcfce7] text-[#166534] border-[#86efac]",
      card: "bg-[#f6fdf8] dark:bg-[#071f13] shadow-[6px_6px_0px_#22c55e]",
    },
  },
  {
    year: "2023",
    title: "Cloud Infrastructure & Scalable Backends",
    description: "Expanded into PostgreSQL, relational database architecture, Docker containers, authentication, and REST/GraphQL APIs.",
    badge: "Cloud & APIs",
    theme: {
      yearBadge: "bg-[#e0e7ff] text-[#3730a3] border-[#a5b4fc]",
      card: "bg-[#f8f9ff] dark:bg-[#0f122e] shadow-[6px_6px_0px_#6366f1]",
    },
  },
  {
    year: "2022",
    title: "The First Line of Code",
    description: "Began programming journey with C, Java, and low-level algorithms, establishing a lifelong passion for computer science and software craftsmanship.",
    badge: "Genesis",
    theme: {
      yearBadge: "bg-[#f3e8ff] text-[#6b21a8] border-[#d8b4fe]",
      card: "bg-[#faf5ff] dark:bg-[#1a0c2b] shadow-[6px_6px_0px_#a855f7]",
    },
  },
];

export function Timeline() {
  return (
    <Section
      id="journey"
      index={timelineContent.index}
      heading={timelineContent.heading}
    >
      <div className="relative pl-6 sm:pl-8 before:absolute before:bottom-0 before:top-2 before:left-[11px] sm:before:left-[15px] before:w-[3px] before:bg-foreground">
        <div className="space-y-8 sm:space-y-10">
          {MILESTONES.map((item) => (
            <div key={item.year} className="relative group">
              {/* Timeline marker node */}
              <div
                aria-hidden
                className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-5 w-5 rounded-none border-2 border-foreground bg-[#fbbf24] shadow-[2px_2px_0px_#18181b] transition-transform duration-200 group-hover:scale-125"
              />

              <div
                className={`card-hover border-2 border-foreground p-6 sm:p-7 ${item.theme.card}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center border-2 px-3 py-0.5 text-xs font-mono font-bold tracking-wider ${item.theme.yearBadge}`}
                    >
                      {item.year}
                    </span>
                    <span className="text-[0.6875rem] font-mono font-bold uppercase tracking-widest text-muted">
                      {item.badge}
                    </span>
                  </div>
                </div>

                <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-foreground/80 sm:text-base">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
