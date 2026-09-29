import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/posts";
import { SiteLogo, SiteLogoMark } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SoundToggle } from "@/components/ui/sound-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CommandPalette, type PaletteItem } from "@/components/ui/command-palette";

export function Header() {
  const paletteItems: PaletteItem[] = [
    { label: "Home", hint: "Page", href: "/" },
    ...siteConfig.nav.map((item) => ({
      label: item.label,
      hint: "Page",
      href: item.href,
    })),
    ...getAllPosts().map((post) => ({
      label: post.title,
      hint: "Post",
      href: `/blog/${post.slug}`,
    })),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/75 backdrop-blur-md">
      <div className="container-site flex h-14 items-center justify-between gap-3 sm:h-16 sm:gap-6">
        <Link
          href="/"
          aria-label={`${siteConfig.name} — back to top`}
          className="group shrink-0 py-2 transition-opacity duration-300 hover:opacity-70"
        >
          <SiteLogoMark className="h-auto w-[4.75rem] sm:hidden" />
          <SiteLogo className="hidden w-32 sm:block lg:w-36" />
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label="Primary" className="hidden sm:block">
            <ul className="flex items-center">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-10 items-center rounded-none px-2.5 text-sm font-medium text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-foreground sm:px-3"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <MobileNav items={siteConfig.nav} />
          <CommandPalette items={paletteItems} />
          <SoundToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
