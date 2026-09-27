import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/reveal";
import { BlogList } from "@/components/ui/blog-list";
import { BLOG_PAGE_SIZE } from "@/lib/post-utils";

const description =
  "Notes on building software, developer tools, and digital products — written by Kauxync.";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const raw = (await searchParams).page;
  const parsed = Number.parseInt(raw ?? "", 10);
  const page = Number.isFinite(parsed) && parsed > 1 ? parsed : 1;
  const canonical = page > 1 ? `/blog?page=${page}` : "/blog";
  return {
    title: `Blog — ${siteConfig.name}`,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: `Blog — ${siteConfig.name}`,
      description,
      url: canonical,
      locale: "en_US",
      images: [
        {
          url: "/og/og.png",
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — Blog`,
        },
      ],
    },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const all = getAllPosts();
  const totalPages = Math.max(1, Math.ceil(all.length / BLOG_PAGE_SIZE));
  const raw = (await searchParams).page;
  const parsed = Number.parseInt(raw ?? "", 10);
  const currentPage =
    Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, totalPages) : 1;
  const pagePosts = all.slice(
    (currentPage - 1) * BLOG_PAGE_SIZE,
    currentPage * BLOG_PAGE_SIZE,
  );

  return (
    <>
      <section id="top" className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="container-site pb-12 pt-16 sm:pb-16 sm:pt-24">
          <Reveal>
            <p className="eyebrow">Writing</p>
            <h1 className="mt-4 font-display text-5xl font-bold uppercase tracking-tight sm:text-6xl md:text-7xl">
              Blog
            </h1>
            <p className="mt-5 max-w-[56ch] text-base leading-relaxed text-muted sm:text-lg">
              Notes on building software, developer tools, and digital products.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-label="Posts">
        <div className="container-site section-pad">
          {all.length > 0 ? (
            <BlogList
              posts={all}
              pagePosts={pagePosts}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          ) : (
            <p className="text-sm text-muted">New posts will be listed here soon.</p>
          )}
        </div>
      </section>
    </>
  );
}
