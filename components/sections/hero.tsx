import { siteConfig } from "@/config/site";
import { getSocial } from "@/config/social";
import { heroContent } from "@/config/content";
import { ButtonLink } from "@/components/ui/button-link";
import { CopyButton } from "@/components/ui/copy-button";
import { IconGithub } from "@/components/ui/icons";
import { Magnetic } from "@/components/ui/magnetic";

export function Hero() {
  const github = getSocial("github");

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />

      <div className="container-site flex min-h-[calc(100svh-3.5rem)] flex-col justify-center gap-6 py-16 sm:min-h-[calc(100svh-4rem)] sm:gap-7 sm:py-20">
        <div className="hero-in hero-delay-1 flex flex-wrap items-center gap-3">
          <span className="eyebrow-badge">
            <span aria-hidden className="dot-pulse" />
            {siteConfig.identity}
          </span>
          <span className="inline-flex items-center gap-2 border border-line bg-surface/80 px-3 py-1 text-xs font-mono font-medium text-foreground backdrop-blur-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Available for new projects & roles
          </span>
        </div>

        <div className="hero-in hero-delay-3 space-y-2">
          <h1 className="font-display text-[clamp(2.8rem,9vw,6.5rem)] font-bold uppercase leading-[0.92] tracking-tight">
            {siteConfig.realName}
          </h1>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted sm:text-sm">
            Known online as <span className="text-foreground">Kauxync</span>
          </p>
        </div>

        <p className="hero-in hero-delay-4 max-w-[50ch] text-base leading-relaxed text-muted sm:text-lg">
          {heroContent.tagline}
        </p>

        <p className="hero-in hero-delay-4 text-xs font-mono text-muted/90 flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 bg-accent" />
          <span>Based in India (IST · UTC+5:30) · Open to Remote worldwide</span>
        </p>

        <div className="hero-in hero-delay-5 flex flex-wrap items-center gap-3 pt-2">
          <Magnetic>
            <ButtonLink href={github.url} external>
              <IconGithub className="h-4 w-4" />
              {heroContent.actions.primaryLabel}
            </ButtonLink>
          </Magnetic>
          <Magnetic>
            <ButtonLink href={heroContent.actions.secondaryHref} variant="outline">
              Get in Touch
            </ButtonLink>
          </Magnetic>
          <Magnetic>
            <CopyButton
              variant="outline"
              label="Copy Email"
              copiedLabel="Email Copied!"
            />
          </Magnetic>
        </div>

        <dl className="hero-in hero-delay-6 mt-4 grid grid-cols-2 divide-y divide-line border-y border-line sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          <div className="py-3 pr-4 sm:px-5 sm:first:pl-0">
            <dt className="eyebrow">Status</dt>
            <dd className="mt-1.5 text-xs font-bold uppercase tracking-wide text-foreground">
              Open to Work
            </dd>
          </div>
          <div className="py-3 px-4 sm:px-5">
            <dt className="eyebrow">Focus</dt>
            <dd className="mt-1.5 text-xs font-bold uppercase tracking-wide text-foreground">
              Full-Stack & Systems
            </dd>
          </div>
          <div className="py-3 px-4 sm:px-5">
            <dt className="eyebrow">Motto</dt>
            <dd className="mt-1.5 text-xs font-bold uppercase tracking-wide text-foreground">
              {siteConfig.brandStatement}
            </dd>
          </div>
          <div className="py-3 pl-4 sm:px-5 sm:last:pr-0">
            <dt className="eyebrow">Direct Contact</dt>
            <dd className="mt-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
              <a
                href={`mailto:${siteConfig.email}`}
                className="transition-colors duration-200 hover:text-accent link-underline truncate"
              >
                {siteConfig.email}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
