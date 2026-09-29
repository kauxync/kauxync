import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { usesCategories, usesData } from "@/config/uses";
import { Reveal } from "@/components/ui/reveal";
import { IconArrowUpRight } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: `Uses & Setup — ${siteConfig.name}`,
  description:
    "Hardware, development tools, editor setups, and software Kaushalendra Kumar (Kauxync) uses daily.",
  alternates: { canonical: "/uses" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `Uses & Setup — ${siteConfig.name}`,
    description:
      "Hardware, development tools, editor setups, and software Kaushalendra Kumar (Kauxync) uses daily.",
    url: "/uses",
    locale: "en_US",
    images: [
      {
        url: "/og/og.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Uses & Setup`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Uses & Setup — ${siteConfig.name}`,
    description:
      "Hardware, development tools, editor setups, and software Kaushalendra Kumar (Kauxync) uses daily.",
    images: ["/og/og.png"],
  },
};

const CATEGORY_COLORS: Record<string, { bg: string; shadow: string; badge: string; accent: string }> = {
  "Workstation & Hardware": {
    bg: "bg-[#fffaf5] dark:bg-[#1a110a]",
    shadow: "shadow-[6px_6px_0px_#f97316]",
    badge: "bg-[#ffedd5] text-[#9a3412] border-[#fed7aa] dark:bg-[#431407] dark:text-[#fed7aa]",
    accent: "text-[#c2410c] dark:text-[#fb923c]",
  },
  "Editor & Coding": {
    bg: "bg-[#f8f9ff] dark:bg-[#10122e]",
    shadow: "shadow-[6px_6px_0px_#6366f1]",
    badge: "bg-[#e0e7ff] text-[#3730a3] border-[#c7d2fe] dark:bg-[#1e1b4b] dark:text-[#c7d2fe]",
    accent: "text-[#4338ca] dark:text-[#818cf8]",
  },
  "Terminal & Dev Tools": {
    bg: "bg-[#f6fcff] dark:bg-[#071926]",
    shadow: "shadow-[6px_6px_0px_#0ea5e9]",
    badge: "bg-[#e0f2fe] text-[#075985] border-[#bae6fd] dark:bg-[#082f49] dark:text-[#bae6fd]",
    accent: "text-[#0369a1] dark:text-[#38bdf8]",
  },
  "Daily Productivity & Apps": {
    bg: "bg-[#f6fdf8] dark:bg-[#091b11]",
    shadow: "shadow-[6px_6px_0px_#22c55e]",
    badge: "bg-[#dcfce7] text-[#166534] border-[#bbf7d0] dark:bg-[#14532d] dark:text-[#dcfce7]",
    accent: "text-[#15803d] dark:text-[#4ade80]",
  },
};

export default function UsesPage() {
  return (
    <>
      <section id="top" className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="container-site pb-12 pt-16 sm:pb-16 sm:pt-24">
          <Reveal>
            <div className="flex items-center gap-2">
              <span className="eyebrow-badge">
                <span className="dot-pulse" />
                Living Arsenal
              </span>
              <span className="border-2 border-foreground bg-[#fbbf24] px-2.5 py-0.5 text-xs font-mono font-bold text-[#18181b] shadow-[2px_2px_0px_#18181b]">
                /uses
              </span>
            </div>
            <h1 className="mt-4 font-display text-5xl font-bold uppercase tracking-tight sm:text-6xl md:text-7xl">
              Tools & Setup
            </h1>
            <p className="mt-5 max-w-[56ch] text-base leading-relaxed text-muted sm:text-lg">
              Hardware, software, developer tools, and workflow systems I rely on daily to design, code, and ship software.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container-site section-pad space-y-16">
        {usesCategories.map((category) => {
          const items = usesData.filter((i) => i.category === category);
          const style = CATEGORY_COLORS[category] ?? CATEGORY_COLORS["Workstation & Hardware"];

          return (
            <section key={category} aria-label={category} className="space-y-6">
              <div className="flex items-center gap-3 border-b-2 border-foreground pb-3">
                <span className="h-3 w-3 bg-[#fbbf24] border border-foreground" />
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl text-foreground">
                  {category}
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, idx) => (
                  <div
                    key={item.title}
                    className={`card-hover border-2 border-foreground ${style.bg} ${style.shadow} p-6 flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-xs font-bold text-muted">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        {item.badge ? (
                          <span
                            className={`border px-2 py-0.5 text-[0.6875rem] font-mono font-bold uppercase tracking-wider ${style.badge}`}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-foreground">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                        {item.description}
                      </p>
                    </div>

                    {item.url ? (
                      <div className="mt-5 border-t border-line/80 pt-3">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider hover:underline ${style.accent}`}
                        >
                          Visit Tool <IconArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
