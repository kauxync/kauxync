import { aboutContent } from "@/config/content";
import { siteConfig } from "@/config/site";
import { Section } from "@/components/ui/section";
import { CopyButton } from "@/components/ui/copy-button";

export function About() {
  const facts = [
    { label: "Role", value: "Full-Stack Engineer & Builder" },
    { label: "Location", value: "India (IST / Remote Worldwide)" },
    { label: "Core Stack", value: "Next.js, TypeScript, Node.js, Postgres" },
    { label: "Availability", value: "Open for freelance & engineering roles" },
    { label: "Direct", value: siteConfig.email },
  ];

  return (
    <Section
      id="about"
      index={aboutContent.index}
      heading={aboutContent.heading}
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <div className="max-w-[62ch] space-y-5 text-lg leading-relaxed text-foreground/85 sm:text-xl">
          {aboutContent.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <aside className="card border border-foreground bg-surface p-6 shadow-[var(--shadow-card)]">
          <p className="eyebrow">At A Glance</p>
          <dl className="mt-4 divide-y divide-line border-y border-line text-xs font-mono">
            {facts.map((fact) => (
              <div key={fact.label} className="py-3">
                <dt className="text-muted uppercase tracking-wider">{fact.label}</dt>
                <dd className="mt-1 font-bold text-foreground break-words">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 pt-2">
            <CopyButton
              variant="outline"
              className="w-full justify-center !min-h-10 text-xs"
              label="Copy Email"
              copiedLabel="Copied!"
            />
          </div>
        </aside>
      </div>
    </Section>
  );
}
