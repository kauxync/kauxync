"use client";

import { connectContent } from "@/config/content";
import { siteConfig } from "@/config/site";
import { socialLinks } from "@/config/social";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button-link";
import { CopyButton } from "@/components/ui/copy-button";
import { ContactForm } from "@/components/ui/contact-form";
import { IconArrowUpRight, IconMail, SocialIcon } from "@/components/ui/icons";
import { AnimateStagger, AnimateItem, AnimateIn } from "@/components/ui/animate-ui";

export function Connect() {
  const collaborationTopics = [
    {
      title: "Freelance & Contract Projects",
      badge: "bg-[#fff7ed] text-[#c2410c] border-[#fdba74] dark:bg-[#431407]/60 dark:text-[#fdba74] dark:border-[#c2410c]",
    },
    {
      title: "Full-Stack Engineering Roles",
      badge: "bg-[#f0fdf4] text-[#15803d] border-[#86efac] dark:bg-[#052e16]/60 dark:text-[#86efac] dark:border-[#15803d]",
    },
    {
      title: "Open Source & Developer Tools",
      badge: "bg-[#f5f3ff] text-[#6d28d9] border-[#c4b5fd] dark:bg-[#2e1065]/60 dark:text-[#c4b5fd] dark:border-[#6d28d9]",
    },
    {
      title: "Architecture Consultations",
      badge: "bg-[#f0f9ff] text-[#0369a1] border-[#7dd3fc] dark:bg-[#082f49]/60 dark:text-[#7dd3fc] dark:border-[#0369a1]",
    },
    {
      title: "Virtual Coffee & Tech Exchanges",
      badge: "bg-[#fffbeb] text-[#b45309] border-[#fde68a] dark:bg-[#451a03]/60 dark:text-[#fcd34d] dark:border-[#b45309]",
    },
  ];

  return (
    <Section
      id="connect"
      index={connectContent.index}
      heading={connectContent.heading}
    >
      <div className="mb-8">
        <p className="eyebrow">Collaboration Interests</p>
        <AnimateStagger
          stagger={0.05}
          delay={0.05}
          className="mt-3 flex flex-wrap gap-2.5"
        >
          {collaborationTopics.map((topic) => (
            <AnimateItem
              key={topic.title}
              as="span"
              variant="badge"
              className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,0.06)] ${topic.badge}`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {topic.title}
            </AnimateItem>
          ))}
        </AnimateStagger>
      </div>

      <AnimateStagger
        stagger={0.08}
        delay={0.06}
        as="ul"
        className="grid grid-cols-1 gap-px overflow-hidden border-2 border-foreground bg-line shadow-[6px_6px_0px_#18181b] dark:shadow-[6px_6px_0px_rgba(255,255,255,0.15)] sm:grid-cols-2 lg:grid-cols-3"
      >
        {socialLinks.map((link) => (
          <AnimateItem key={link.icon} as="li" variant="up" className="bg-background">
            <a
              href={link.url}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="group flex h-full min-h-[4.75rem] items-center gap-4 p-5 transition-all duration-200 hover:bg-surface-2 sm:p-6"
            >
              <SocialIcon
                name={link.icon}
                className="h-5 w-5 shrink-0 text-muted transition-colors duration-200 group-hover:text-accent"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold tracking-tight text-foreground group-hover:text-accent">
                  {link.name}
                </span>
                <span className="mt-0.5 block truncate text-xs font-mono text-muted">
                  {link.handle}
                </span>
              </span>
              <IconArrowUpRight className="h-4 w-4 shrink-0 -translate-x-1 text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-accent group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:text-accent group-focus-visible:opacity-100" />
              {link.external ? (
                <span className="sr-only">(opens in a new tab)</span>
              ) : null}
            </a>
          </AnimateItem>
        ))}
      </AnimateStagger>

      {/* Interactive Quick Contact Form */}
      <AnimateIn variant="up" delay={0.15}>
        <ContactForm />
      </AnimateIn>

      <AnimateIn variant="up" delay={0.2} className="mt-12 flex flex-col items-start gap-5 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div>
          <p className="max-w-[34ch] font-display text-xl font-bold tracking-tight sm:max-w-none sm:text-2xl">
            {connectContent.contactPrompt}
          </p>
          <p className="mt-1 text-xs font-mono text-muted">
            Preferred: <span className="font-bold text-foreground">{siteConfig.email}</span> · Based in India (Remote)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <CopyButton
            variant="outline"
            label="Copy Email"
            copiedLabel="Copied!"
            className="!border-2 !border-foreground bg-surface hover:!bg-[#fef3c7] hover:!text-[#18181b] !shadow-[3px_3px_0px_#f59e0b]"
          />
          <ButtonLink
            href={`mailto:${siteConfig.email}`}
            className="!bg-[#fbbf24] hover:!bg-[#f59e0b] !text-[#18181b] !border-2 !border-foreground !shadow-[3px_3px_0px_#18181b]"
          >
            <IconMail className="h-4 w-4" />
            {connectContent.contactAction}
          </ButtonLink>
        </div>
      </AnimateIn>
    </Section>
  );
}
