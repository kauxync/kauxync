"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { socialLinks } from "@/config/social";
import { SiteLogo } from "@/components/ui/logo";
import { SocialIcon } from "@/components/ui/icons";
import { CopyButton } from "@/components/ui/copy-button";
import { AnimateStagger, AnimateItem } from "@/components/ui/animate-ui";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-foreground bg-surface">
      <AnimateStagger
        stagger={0.08}
        delay={0.05}
        className="container-site section-pad flex flex-col items-center gap-7 text-center"
      >
        <AnimateItem variant="scale">
          <SiteLogo className="w-40 sm:w-48" />
        </AnimateItem>

        <AnimateItem variant="up" className="space-y-1.5">
          <p className="font-display text-base font-medium tracking-tight sm:text-lg">
            {siteConfig.realName}
          </p>
          <p className="text-sm text-muted">{siteConfig.identity}</p>
        </AnimateItem>

        <AnimateItem variant="up">
          <p className="font-display text-xs font-medium tracking-[0.3em] text-muted uppercase sm:text-sm">
            {siteConfig.brandStatement}
          </p>
        </AnimateItem>

        {/* Quick Nav Links */}
        <AnimateItem variant="up">
          <nav aria-label="Footer Navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono uppercase tracking-wider text-muted">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors duration-200 hover:text-foreground link-underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </AnimateItem>

        {/* Social Icons & Email Copy */}
        <AnimateItem variant="up" className="flex flex-col items-center gap-4">
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {socialLinks.map((link) => (
              <li key={link.icon}>
                <a
                  href={link.url}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  aria-label={`${siteConfig.name} on ${link.name}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-none border border-line text-muted transition-all duration-200 hover:border-accent hover:text-accent hover:shadow-[var(--shadow-glow)]"
                >
                  <SocialIcon name={link.icon} className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
          <CopyButton
            variant="compact"
            label={`Copy ${siteConfig.email}`}
            copiedLabel="Email Copied!"
          />
        </AnimateItem>

        <AnimateItem variant="fade" className="border-t border-line w-full pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-muted">
          <p>
            © {year} {siteConfig.name} · All rights reserved.
          </p>
          <p>
            India (IST · UTC+5:30) · Open to Remote
          </p>
        </AnimateItem>
      </AnimateStagger>
    </footer>
  );
}
