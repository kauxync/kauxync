import type { Metadata } from "next";
import { projects, projectsContent } from "@/config/projects";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/ui/project-card";
import { LeetcodeActivity } from "@/components/sections/leetcode-activity";
import { GithubContributions } from "@/components/sections/github-contributions";

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
};

export default function ProjectsPage() {
  return (
    <>
      <section id="top" className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="container-site pb-12 pt-16 sm:pb-16 sm:pt-24">
          <Reveal>
            <p className="eyebrow">{projectsContent.eyebrow}</p>
            <h1 className="mt-4 font-display text-5xl font-bold uppercase tracking-tight sm:text-6xl md:text-7xl">
              {projectsContent.heading}
            </h1>
            <p className="mt-5 max-w-[56ch] text-base leading-relaxed text-muted sm:text-lg">
              {projectsContent.intro}
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-label="Projects">
        <div className="container-site section-pad">
          {projects.length > 0 ? (
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {projects.map((project, index) => (
                <li key={project.title} className="h-full">
                  <ProjectCard
                    project={project}
                    index={index}
                    delay={(index % 2) * 100}
                  />
                </li>
              ))}
            </ul>
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
