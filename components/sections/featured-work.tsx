import { projects, projectsContent } from "@/config/projects";
import { workContent } from "@/config/content";
import { Section } from "@/components/ui/section";
import { ProjectCard } from "@/components/ui/project-card";
import { ButtonLink } from "@/components/ui/button-link";

export function FeaturedWork() {
  const featured = projects.slice(0, 2);
  if (featured.length === 0) return null;

  return (
    <Section
      id="work"
      index={workContent.index}
      heading={workContent.heading}
    >
      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {featured.map((project, index) => (
          <li key={project.title} className="h-full">
            <ProjectCard
              project={project}
              index={index}
              delay={(index % 2) * 100}
            />
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <ButtonLink href="/projects" variant="outline">
          View all {projectsContent.heading.toLowerCase()}
        </ButtonLink>
      </div>
    </Section>
  );
}
