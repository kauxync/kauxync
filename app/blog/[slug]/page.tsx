import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost } from "@/lib/posts";
import { getToc, formatDate, readingTime } from "@/lib/post-utils";
import { siteConfig } from "@/config/site";
import { mdxComponents } from "@/components/ui/mdx";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { TableOfContents } from "@/components/ui/table-of-contents";
import { PostShare } from "@/components/ui/post-share";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const description = post.description || siteConfig.description;
  const author = post.author ?? siteConfig.realName;
  const ogImage = post.ogImage ?? `/og/blog-${post.slug}.png`;
  return {
    title: `${post.title} — ${siteConfig.name}`,
    description,
    authors: [{ name: author }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      siteName: siteConfig.name,
      title: `${post.title} — ${siteConfig.name}`,
      description,
      url: `/blog/${post.slug}`,
      locale: "en_US",
      publishedTime: post.date,
      authors: [author],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} — ${siteConfig.name}`,
      description,
      images: [ogImage],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const toc = getToc(post.content);
  const author = post.author ?? siteConfig.realName;
  const ogImageUrl = post.ogImage
    ? `${siteConfig.url}${post.ogImage.startsWith("/") ? "" : "/"}${post.ogImage}`
    : `${siteConfig.url}/og/og.png`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: [ogImageUrl],
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: author,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.realName,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section id="top" className="border-b border-line">
        <div className="container-site pb-10 pt-16 sm:pb-12 sm:pt-24">
          <nav aria-label="Breadcrumb">
            <Link
              href="/blog"
              className="eyebrow transition-colors duration-200 hover:text-accent link-underline"
            >
              Blog
            </Link>
          </nav>
          <h1 className="mt-5 max-w-[20ch] font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.75rem]">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="eyebrow">By {author}</span>
            <time dateTime={post.date} className="eyebrow">
              {formatDate(post.date)}
            </time>
            <span className="eyebrow" aria-label="Reading time">
              {readingTime(post.content)} min read
            </span>
            {post.tags && post.tags.length > 0 ? (
              <p className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </p>
            ) : null}
          </div>
          {post.description ? (
            <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-muted sm:text-lg">
              {post.description}
            </p>
          ) : null}
        </div>
      </section>

      <section aria-label="Post content">
        <div className="container-site section-pad">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_13rem]">
            <div className="min-w-0 max-w-[68ch]">
              <article className="prose-post">
                <MDXRemote source={post.content} components={mdxComponents} />
              </article>

              {/* Share & Feedback */}
              <div className="mt-14 border-t border-line pt-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <PostShare title={post.title} slug={post.slug} />
                  <Link
                    href="/blog"
                    className="text-xs font-mono font-bold uppercase tracking-widest text-muted transition-colors duration-200 hover:text-accent"
                  >
                    ← Back to all posts
                  </Link>
                </div>
              </div>

              {/* Author Card & Discussion Prompt */}
              <div className="card mt-10 border border-foreground bg-surface p-6 shadow-[var(--shadow-card)] sm:p-7">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-foreground bg-surface-2 font-display text-2xl font-bold uppercase text-accent">
                    K
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="eyebrow">Author</p>
                    <h3 className="mt-1 font-display text-lg font-bold tracking-tight">
                      {author}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      Full-Stack Developer and Software Builder. Building software, exploring modern web architectures, and sharing technical breakdowns.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
                  <p className="text-xs text-muted font-mono">
                    Thoughts or corrections? Let&apos;s talk:{" "}
                    <a
                      href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(`Feedback on: ${post.title}`)}`}
                      className="font-bold text-foreground underline hover:text-accent"
                    >
                      {siteConfig.email}
                    </a>
                  </p>
                  <a
                    href="https://x.com/kauxync"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono font-bold uppercase tracking-wider text-muted hover:text-foreground underline"
                  >
                    @kauxync on X →
                  </a>
                </div>
              </div>
            </div>

            {toc.length > 0 ? (
              <aside className="hidden lg:block">
                <TableOfContents entries={toc} />
              </aside>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
