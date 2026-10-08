"use client";

import { projects, projectsContent } from "@/config/projects";
import { workContent } from "@/config/content";
import { Section } from "@/components/ui/section";
import { ProjectCard } from "@/components/ui/project-card";
import { ButtonLink } from "@/components/ui/button-link";
import { AnimateStagger, AnimateItem, AnimateIn } from "@/components/ui/animate-ui";

export function FeaturedWork() {
  const featured = projects.filter((p) => p.featured !== false).slice(0, 4);
  if (featured.length === 0) return null;

  return (
    <Section
      id="work"
      index={workContent.index}
      heading={workContent.heading}
    >
      <AnimateStagger
        stagger={0.14}
        delay={0.06}
        as="ul"
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        {featured.map((project, index) => (
          <AnimateItem key={project.title} as="li" variant="scale" className="h-full">
            <ProjectCard
              project={project}
              index={index}
            />
          </AnimateItem>
        ))}
      </AnimateStagger>

      <AnimateIn variant="up" delay={0.2} className="mt-10">
        <ButtonLink href="/projects" variant="outline">
          View all {projectsContent.heading.toLowerCase()}
        </ButtonLink>
      </AnimateIn>
    </Section>
  );
}
