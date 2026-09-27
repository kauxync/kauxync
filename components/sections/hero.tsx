import { siteConfig } from "@/config/site";
import { getSocial } from "@/config/social";
import { heroContent } from "@/config/content";
// import { SiteLogo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button-link";
import { IconGithub } from "@/components/ui/icons";
import { Magnetic } from "@/components/ui/magnetic";

export function Hero() {
  const github = getSocial("github");

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />

      <div className="container-site flex min-h-[calc(100svh-3.5rem)] flex-col justify-center gap-6 py-16 sm:min-h-[calc(100svh-4rem)] sm:gap-7 sm:py-20">
        <p className="hero-in hero-delay-1">
          <span className="eyebrow-badge">
            <span aria-hidden className="dot-pulse" />
            {siteConfig.identity}
          </span>
        </p>

        {/* <h1 className="hero-in hero-delay-2 w-[min(94vw,44rem)]">
          <SiteLogo eager />
        </h1> */}

        <h1 className="hero-in hero-delay-3 font-display text-[clamp(2.8rem,9vw,7rem)] font-bold uppercase leading-[0.92] tracking-tight">
          {siteConfig.realName}
        </h1>

        <p className="hero-in hero-delay-4 max-w-[46ch] text-base leading-relaxed text-muted sm:text-lg">
          {heroContent.tagline}
        </p>

        <div className="hero-in hero-delay-5 flex flex-wrap items-center gap-4">
          <Magnetic>
            <ButtonLink href={github.url} external>
              <IconGithub className="h-4 w-4" />
              {heroContent.actions.primaryLabel}
            </ButtonLink>
          </Magnetic>
          <Magnetic>
            <ButtonLink href={heroContent.actions.secondaryHref} variant="outline">
              {heroContent.actions.secondaryLabel}
            </ButtonLink>
          </Magnetic>
        </div>

        <dl className="hero-in hero-delay-6 mt-2 grid grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <div className="py-3 sm:px-6 sm:first:pl-0 sm:last:pr-0">
            <dt className="eyebrow">Motto</dt>
            <dd className="mt-1.5 text-sm font-bold uppercase tracking-wide">
              {siteConfig.brandStatement}
            </dd>
          </div>
          <div className="py-3 sm:px-6 sm:first:pl-0 sm:last:pr-0">
            <dt className="eyebrow">Contact</dt>
            <dd className="mt-1.5 text-sm font-bold uppercase tracking-wide">
              <a
                href={`mailto:${siteConfig.email}`}
                className="transition-colors duration-200 hover:text-accent link-underline"
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
