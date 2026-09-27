import { connectContent } from "@/config/content";
import { siteConfig } from "@/config/site";
import { socialLinks } from "@/config/social";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button-link";
import { IconArrowUpRight, IconMail, SocialIcon } from "@/components/ui/icons";

export function Connect() {
  return (
    <Section
      id="connect"
      index={connectContent.index}
      heading={connectContent.heading}
    >
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

      <div className="mt-12 flex flex-col items-start gap-5 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <p className="max-w-[34ch] font-display text-xl font-medium tracking-tight sm:max-w-none sm:text-2xl">
          {connectContent.contactPrompt}
        </p>
        <ButtonLink href={`mailto:${siteConfig.email}`} variant="outline">
          <IconMail className="h-4 w-4" />
          {connectContent.contactAction}
        </ButtonLink>
      </div>
    </Section>
  );
}
