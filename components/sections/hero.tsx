"use client";

import { siteConfig } from "@/config/site";
import { getSocial } from "@/config/social";
import { heroContent } from "@/config/content";
import { ButtonLink } from "@/components/ui/button-link";
import { CopyButton } from "@/components/ui/copy-button";
import { IconGithub } from "@/components/ui/icons";
import { Magnetic } from "@/components/ui/magnetic";
import { PronunciationButton } from "@/components/ui/pronunciation-button";
import { Avatar3D } from "@/components/ui/avatar-3d";
import { AnimateStagger, AnimateItem, AnimateText, AnimateIn } from "@/components/ui/animate-ui";

export function Hero() {
  const github = getSocial("github");

  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* Ambient pastel glow behind grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 opacity-50 dark:opacity-25 blur-3xl overflow-hidden"
      >
        <div className="absolute -top-[10%] left-[5%] h-80 w-80 rounded-full bg-[#f3e8ff] dark:bg-[#581c87]" />
        <div className="absolute top-[20%] right-[10%] h-96 w-96 rounded-full bg-[#e0f2fe] dark:bg-[#0369a1]" />
        <div className="absolute bottom-[5%] left-[35%] h-72 w-72 rounded-full bg-[#fef3c7] dark:bg-[#b45309]" />
      </div>

      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />

      <div className="container-site flex min-h-[calc(100svh-3.5rem)] flex-col justify-center py-16 sm:min-h-[calc(100svh-4rem)] sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-14">
          <AnimateStagger stagger={0.09} delay={0.05} className="space-y-6">
            {/* Badges */}
            <AnimateItem variant="badge" className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 border-2 border-foreground bg-[#f3e8ff] text-[#581c87] px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider shadow-[3px_3px_0px_#9333ea] dark:bg-[#2e1065] dark:text-[#f3e8ff] dark:shadow-[3px_3px_0px_#a855f7]">
                <span aria-hidden className="h-2 w-2 rounded-full bg-[#9333ea]" />
                {siteConfig.identity}
              </span>
              <span className="inline-flex items-center gap-2 border-2 border-foreground bg-[#dcfce7] text-[#14532d] px-3 py-1 text-xs font-mono font-bold shadow-[3px_3px_0px_#16a34a] dark:bg-[#052e16] dark:text-[#86efac] dark:shadow-[3px_3px_0px_#22c55e]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Available for new projects & roles
              </span>
            </AnimateItem>

            {/* Heading & Nickname */}
            <AnimateItem variant="up" className="space-y-3">
              <h1 className="font-display text-[clamp(2.8rem,8vw,5.75rem)] font-bold uppercase leading-[0.92] tracking-tight">
                <AnimateText text={siteConfig.realName} delay={0.15} stagger={0.08} as="span" />
              </h1>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted sm:text-sm">
                  Known online as <strong className="text-foreground underline decoration-[#fbbf24] decoration-2">Kauxync</strong>
                </span>
                <PronunciationButton />
              </div>
            </AnimateItem>

            {/* Tagline */}
            <AnimateItem variant="up">
              <p className="max-w-[50ch] text-base leading-relaxed text-muted sm:text-lg">
                {heroContent.tagline}
              </p>
            </AnimateItem>

            {/* Location & Status */}
            <AnimateItem variant="up">
              <p className="text-xs font-mono text-muted/90 flex items-center gap-2">
                <span className="inline-block h-2 w-2 bg-[#fbbf24] border border-foreground" />
                <span>Based in India (IST · UTC+5:30) · Open to Remote worldwide</span>
              </p>
            </AnimateItem>

            {/* CTA Buttons */}
            <AnimateItem variant="up" className="flex flex-wrap items-center gap-3.5 pt-2">
              <Magnetic>
                <ButtonLink
                  href={github.url}
                  external
                  className="!bg-[#fbbf24] hover:!bg-[#f59e0b] !text-[#18181b] !border-2 !border-foreground !shadow-[4px_4px_0px_#18181b] dark:!shadow-[4px_4px_0px_#fbbf24]"
                >
                  <IconGithub className="h-4 w-4" />
                  {heroContent.actions.primaryLabel}
                </ButtonLink>
              </Magnetic>
              <Magnetic>
                <ButtonLink
                  href={heroContent.actions.secondaryHref}
                  variant="outline"
                  className="!border-2 !border-foreground bg-surface hover:!bg-[#e0f2fe] dark:hover:!bg-[#0c2b42] !shadow-[4px_4px_0px_#0284c7]"
                >
                  Get in Touch
                </ButtonLink>
              </Magnetic>
              <Magnetic>
                <CopyButton
                  variant="outline"
                  label="Copy Email"
                  copiedLabel="Email Copied!"
                  className="!border-2 !border-foreground bg-surface hover:!bg-[#f3e8ff] dark:hover:!bg-[#2e1065] !shadow-[4px_4px_0px_#9333ea]"
                />
              </Magnetic>
            </AnimateItem>
          </AnimateStagger>

          {/* Right Column / Mobile Centered: 3D Interactive Avatar */}
          <AnimateIn variant="scale" delay={0.25} duration={0.8} className="w-full flex justify-center lg:justify-center lg:-translate-x-8 xl:-translate-x-12">
            <Avatar3D />
          </AnimateIn>
        </div>

        {/* 4-Stat Box Banner */}
        <AnimateStagger
          stagger={0.08}
          delay={0.35}
          as="dl"
          className="mt-8 grid grid-cols-2 divide-y divide-line border-2 border-foreground bg-surface shadow-[6px_6px_0px_#18181b] dark:shadow-[6px_6px_0px_rgba(255,255,255,0.2)] sm:grid-cols-4 sm:divide-x sm:divide-y-0"
        >
          <AnimateItem variant="up" className="p-4 sm:px-5">
            <dt className="eyebrow flex items-center gap-1.5 text-[#15803d] dark:text-[#4ade80]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
              Status
            </dt>
            <dd className="mt-1.5 text-xs font-bold uppercase tracking-wide text-foreground">
              Open to Work
            </dd>
          </AnimateItem>
          <AnimateItem variant="up" className="p-4 sm:px-5">
            <dt className="eyebrow flex items-center gap-1.5 text-[#7e22ce] dark:text-[#c084fc]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9333ea]" />
              Focus
            </dt>
            <dd className="mt-1.5 text-xs font-bold uppercase tracking-wide text-foreground">
              Full-Stack & Systems
            </dd>
          </AnimateItem>
          <AnimateItem variant="up" className="p-4 sm:px-5">
            <dt className="eyebrow flex items-center gap-1.5 text-[#b45309] dark:text-[#fbbf24]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d97706]" />
              Motto
            </dt>
            <dd className="mt-1.5 text-xs font-bold uppercase tracking-wide text-foreground">
              {siteConfig.brandStatement}
            </dd>
          </AnimateItem>
          <AnimateItem variant="up" className="p-4 sm:px-5">
            <dt className="eyebrow flex items-center gap-1.5 text-[#0369a1] dark:text-[#38bdf8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0284c7]" />
              Direct Contact
            </dt>
            <dd className="mt-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
              <a
                href={`mailto:${siteConfig.email}`}
                className="transition-colors duration-200 hover:text-accent link-underline truncate"
              >
                {siteConfig.email}
              </a>
            </dd>
          </AnimateItem>
        </AnimateStagger>
      </div>
    </section>
  );
}
