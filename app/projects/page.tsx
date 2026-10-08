import type { Metadata } from "next";
import { projects, projectsContent } from "@/config/projects";
import { siteConfig } from "@/config/site";
import { ProjectCard } from "@/components/ui/project-card";
import { LeetcodeActivity } from "@/components/sections/leetcode-activity";
import { GithubContributions } from "@/components/sections/github-contributions";
import { AnimateStagger, AnimateItem } from "@/components/ui/animate-ui";

const description = `Selected projects by ${siteConfig.realName} — web and mobile applications, developer tools, and digital products built by Kauxync.`;

export const metadata: Metadata = {
  title: `Projects — ${siteConfig.name}`,
  description,
  alternates: { canonical: "/projects" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `Projects — ${siteConfig.name}`,
    description,
    url: "/projects",
    locale: "en_US",
    images: [
      {
        url: "/og/og.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Projects`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects — ${siteConfig.name}`,
    description,
    images: ["/og/og.png"],
  },
};

export default function ProjectsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: `${siteConfig.url}/projects`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: `${siteConfig.name} Projects Portfolio`,
        description,
        itemListElement: projects.map((p, i) => ({
          "@type": "SoftwareApplication",
          position: i + 1,
          name: p.title,
          description: p.summary,
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web, Cross-platform",
          author: {
            "@type": "Person",
            name: siteConfig.realName,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        id="projects-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section id="top" className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="container-site pb-12 pt-16 sm:pb-16 sm:pt-24">
          <AnimateStagger stagger={0.08} delay={0.05}>
            <AnimateItem variant="up">
              <p className="eyebrow">{projectsContent.eyebrow}</p>
            </AnimateItem>
            <AnimateItem variant="up">
              <h1 className="mt-4 font-display text-5xl font-bold uppercase tracking-tight sm:text-6xl md:text-7xl">
                {projectsContent.heading}
              </h1>
            </AnimateItem>
            <AnimateItem variant="up">
              <p className="mt-5 max-w-[56ch] text-base leading-relaxed text-muted sm:text-lg">
                {projectsContent.intro}
              </p>
            </AnimateItem>
          </AnimateStagger>
        </div>
      </section>

      <section aria-label="Projects">
        <div className="container-site section-pad">
          {projects.length > 0 ? (
            <AnimateStagger
              stagger={0.1}
              delay={0.05}
              as="ul"
              className="grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              {projects.map((project, index) => (
                <AnimateItem key={project.title} as="li" variant="scale" className="h-full">
                  <ProjectCard
                    project={project}
                    index={index}
                  />
                </AnimateItem>
              ))}
            </AnimateStagger>
          ) : (
            <p className="text-sm text-muted">
              New projects will be listed here soon.
            </p>
          )}
        </div>
      </section>

      <GithubContributions />
      <LeetcodeActivity />
    </>
  );
}
