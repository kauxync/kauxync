import { getAllPosts } from "@/lib/posts";
import { writingContent } from "@/config/content";
import { Section } from "@/components/ui/section";
import { PostRow } from "@/components/ui/post-row";
import { ButtonLink } from "@/components/ui/button-link";

export function LatestWriting() {
  const posts = getAllPosts().slice(0, 2);
  if (posts.length === 0) return null;

  return (
    <Section
      id="writing"
      index={writingContent.index}
      heading={writingContent.heading}
    >
      <ul className="divide-y divide-line border-y border-line">
        {posts.map((post, index) => (
          <PostRow key={post.slug} post={post} index={index} />
        ))}
      </ul>
      <div className="mt-10">
        <ButtonLink href="/blog" variant="outline">
          View all posts
        </ButtonLink>
      </div>
    </Section>
  );
}
