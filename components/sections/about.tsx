"use client";

import { aboutContent } from "@/config/content";
import { siteConfig } from "@/config/site";
import { Section } from "@/components/ui/section";
import { CopyButton } from "@/components/ui/copy-button";
import { AnimateStagger, AnimateItem, AnimateCard } from "@/components/ui/animate-ui";

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
        {/* Paragraphs staggered one by one */}
        <AnimateStagger
          stagger={0.12}
          delay={0.05}
          className="max-w-[62ch] space-y-5 text-lg leading-relaxed text-foreground/85 sm:text-xl"
        >
          {aboutContent.paragraphs.map((paragraph, idx) => (
            <AnimateItem key={idx} variant="up">
              <p>{paragraph}</p>
            </AnimateItem>
          ))}
        </AnimateStagger>

        {/* Aside Glance Card */}
        <AnimateCard
          delay={0.2}
          className="card-hover border-2 border-foreground bg-[#fffdf5] dark:bg-[#1a140a] p-6 shadow-[6px_6px_0px_#f59e0b] dark:shadow-[6px_6px_0px_#d97706]"
        >
          <div className="flex items-center justify-between border-b border-line pb-3">
            <p className="eyebrow text-[#b45309] dark:text-[#fcd34d] font-bold">At A Glance</p>
            <span className="h-2 w-2 rounded-full bg-[#f59e0b] animate-ping" />
          </div>

          <AnimateStagger stagger={0.06} delay={0.15} as="dl" className="mt-3 divide-y divide-line border-b border-line text-xs font-mono">
            {facts.map((fact) => (
              <AnimateItem key={fact.label} variant="up" className="py-3">
                <dt className="text-muted uppercase tracking-wider">{fact.label}</dt>
                <dd className="mt-1 font-bold text-foreground break-words">{fact.value}</dd>
              </AnimateItem>
            ))}
          </AnimateStagger>

          <div className="mt-5 pt-1">
            <CopyButton
              variant="outline"
              className="w-full justify-center !min-h-10 text-xs !border-2 !border-foreground bg-background hover:!bg-[#fbbf24] hover:!text-[#18181b] !shadow-[3px_3px_0px_#18181b]"
              label="Copy Email"
              copiedLabel="Copied!"
            />
          </div>
        </AnimateCard>
      </div>
    </Section>
  );
}
