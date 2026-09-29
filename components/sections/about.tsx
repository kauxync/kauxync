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

        <aside className="card-hover border-2 border-foreground bg-[#fffdf5] dark:bg-[#1a140a] p-6 shadow-[6px_6px_0px_#f59e0b] dark:shadow-[6px_6px_0px_#d97706]">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <p className="eyebrow text-[#b45309] dark:text-[#fcd34d] font-bold">At A Glance</p>
            <span className="h-2 w-2 rounded-full bg-[#f59e0b] animate-ping" />
          </div>
          <dl className="mt-3 divide-y divide-line border-b border-line text-xs font-mono">
            {facts.map((fact) => (
              <div key={fact.label} className="py-3">
                <dt className="text-muted uppercase tracking-wider">{fact.label}</dt>
                <dd className="mt-1 font-bold text-foreground break-words">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 pt-1">
            <CopyButton
              variant="outline"
              className="w-full justify-center !min-h-10 text-xs !border-2 !border-foreground bg-background hover:!bg-[#fbbf24] hover:!text-[#18181b] !shadow-[3px_3px_0px_#18181b]"
              label="Copy Email"
              copiedLabel="Copied!"
            />
          </div>
        </aside>
      </div>
    </Section>
  );
}
