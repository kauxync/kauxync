import { connectContent } from "@/config/content";
import { siteConfig } from "@/config/site";
import { socialLinks } from "@/config/social";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button-link";
import { CopyButton } from "@/components/ui/copy-button";
import { ContactForm } from "@/components/ui/contact-form";
import { IconArrowUpRight, IconMail, SocialIcon } from "@/components/ui/icons";

export function Connect() {
  const collaborationTopics = [
    "Freelance & Contract Projects",
    "Full-Stack Engineering Roles",
    "Open Source & Developer Tools",
    "Architecture Consultations",
    "Virtual Coffee & Tech Exchanges",
  ];

  return (
    <Section
      id="connect"
      index={connectContent.index}
      heading={connectContent.heading}
    >
      <div className="mb-8">
        <p className="eyebrow">Collaboration Interests</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {collaborationTopics.map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center gap-1.5 border border-line bg-surface-2 px-3 py-1 text-xs font-mono font-medium text-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {topic}
            </span>
          ))}
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-px overflow-hidden border border-foreground bg-line shadow-[var(--shadow-card)] sm:grid-cols-2 lg:grid-cols-3">
        {socialLinks.map((link) => (
          <li key={link.icon} className="bg-background">
            <a
              href={link.url}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="group flex h-full min-h-[4.75rem] items-center gap-4 p-5 transition-colors duration-200 hover:bg-foreground sm:p-6"
            >
              <SocialIcon
                name={link.icon}
                className="h-5 w-5 shrink-0 text-muted transition-colors duration-200 group-hover:text-accent"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold tracking-tight group-hover:text-background">
                  {link.name}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted group-hover:text-background/70">
                  {link.handle}
                </span>
              </span>
              <IconArrowUpRight className="h-4 w-4 shrink-0 -translate-x-1 text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-accent group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:text-accent group-focus-visible:opacity-100" />
              {link.external ? (
                <span className="sr-only">(opens in a new tab)</span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>

      {/* Interactive Quick Contact Form */}
      <ContactForm />

      <div className="mt-12 flex flex-col items-start gap-5 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div>
          <p className="max-w-[34ch] font-display text-xl font-medium tracking-tight sm:max-w-none sm:text-2xl">
            {connectContent.contactPrompt}
          </p>
          <p className="mt-1 text-xs font-mono text-muted">
            Preferred: <span className="text-foreground">{siteConfig.email}</span> · Based in India (Remote)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <CopyButton
            variant="outline"
            label="Copy Email"
            copiedLabel="Copied!"
          />
          <ButtonLink href={`mailto:${siteConfig.email}`}>
            <IconMail className="h-4 w-4" />
            {connectContent.contactAction}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
