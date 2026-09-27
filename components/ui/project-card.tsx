import { Reveal } from "@/components/ui/reveal";
import { IconArrowUpRight } from "@/components/ui/icons";
import type { Project } from "@/config/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
  delay?: number;
}

export function ProjectCard({ project, index, delay = 0 }: ProjectCardProps) {
  const { title, summary, tech, status, links } = project;

  return (
    <Reveal delay={delay} variant="scale" className="h-full">
      <article className="card card-hover flex h-full flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <span className="chip">{String(index + 1).padStart(2, "0")}</span>
          {status ? (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-muted">
              <span
                aria-hidden
                className="dot-pulse h-1.5 w-1.5 rounded-full bg-accent"
              />
              {status}
            </span>
          ) : null}
        </div>

        <h2 className="mt-4 font-display text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted sm:text-base">
          {summary}
        </p>

        {tech.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {tech.map((item) => (
              <li key={item} className="chip">
                {item}
              </li>
            ))}
          </ul>
        ) : null}

        {links && links.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4">
            {links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors duration-200 hover:text-accent link-underline"
                >
                  {link.label}
                  <IconArrowUpRight className="h-3.5 w-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </article>
    </Reveal>
  );
}
