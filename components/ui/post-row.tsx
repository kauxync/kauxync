import Link from "next/link";
import { formatDate, type PostMeta } from "@/lib/post-utils";
import { Reveal } from "@/components/ui/reveal";
import { IconArrowUpRight } from "@/components/ui/icons";

interface PostRowProps {
  post: PostMeta;
  index?: number;
}

export function PostRow({ post, index = 0 }: PostRowProps) {
  return (
    <li>
      <Reveal delay={index * 80}>
        <Link
          href={`/blog/${post.slug}`}
          className="group grid gap-2 rounded-none px-4 py-6 transition-colors duration-200 -mx-4 hover:bg-surface sm:grid-cols-[8.5rem_1fr_auto] sm:items-baseline sm:gap-8 sm:py-7 sm:px-6 sm:-mx-6"
        >
          <div className="flex flex-col gap-1 sm:translate-y-[2px]">
            <time dateTime={post.date} className="eyebrow">
              {formatDate(post.date)}
            </time>
            {post.readingTime ? (
              <span className="text-[0.6875rem] font-mono font-medium text-muted">
                {post.readingTime} min read
              </span>
            ) : null}
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold tracking-tight transition-colors duration-200 group-hover:text-accent sm:text-2xl link-underline">
              {post.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
              {post.description}
            </p>
            {post.tags && post.tags.length > 0 ? (
              <p className="mt-3 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </p>
            ) : null}
          </div>
          <IconArrowUpRight className="hidden h-4 w-4 shrink-0 text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100 group-focus-visible:opacity-100 sm:block" />
        </Link>
      </Reveal>
    </li>
  );
}
