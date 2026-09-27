import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <>
      <section id="top" className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="container-site pb-12 pt-16 sm:pb-16 sm:pt-24">
          <p className="eyebrow">Error</p>
          <h1 className="mt-4 font-display text-[clamp(4rem,14vw,10rem)] font-bold leading-[0.9] tracking-tight">
            404
          </h1>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted sm:text-lg">
            This page does not exist or was moved. The rest of{" "}
            {siteConfig.name} is still here.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/" className="btn btn-primary">
              Back home
            </Link>
            <Link href="/blog" className="btn btn-outline">
              Read the blog
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Sitemap">
        <div className="container-site section-pad">
          <ul className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Home", href: "/", detail: "Identity, technology, contact" },
              { label: "Projects", href: "/projects", detail: "Selected work" },
              { label: "Blog", href: "/blog", detail: "Notes on building software" },
            ].map((item) => (
              <li key={item.href} className="card card-hover p-6">
                <Link href={item.href} className="block">
                  <p className="font-display text-xl font-semibold tracking-tight">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm text-muted">{item.detail}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
