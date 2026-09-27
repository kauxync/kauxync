import { siteConfig } from "@/config/site";
import { socialLinks } from "@/config/social";
import { SiteLogo } from "@/components/ui/logo";
import { SocialIcon } from "@/components/ui/icons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-foreground">
      <div className="container-site section-pad flex flex-col items-center gap-7 text-center">
        <SiteLogo className="w-40 sm:w-48" />

        <div className="space-y-1.5">
          <p className="font-display text-base font-medium tracking-tight sm:text-lg">
            {siteConfig.realName}
          </p>
          <p className="text-sm text-muted">{siteConfig.identity}</p>
        </div>

        <p className="font-display text-xs font-medium tracking-[0.3em] text-muted uppercase sm:text-sm">
          {siteConfig.brandStatement}
        </p>

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

        <p className="text-xs text-muted">
          © {year} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
