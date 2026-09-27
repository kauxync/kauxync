import { siteConfig } from "@/config/site";
import { socialLinks } from "@/config/social";
import { projects } from "@/config/projects";
import { getAllPosts } from "@/lib/posts";
import { aboutContent, technologyContent } from "@/config/content";

export function GET(): Response {
  const lines: string[] = [
    `# ${siteConfig.name}`,
    ``,
    `> ${siteConfig.description}`,
    ``,
    `## About`,
    ``,
    ...aboutContent.paragraphs,
    ``,
    `## Technology`,
    ``,
    ...technologyContent.groups.map(
      (group) => `- ${group.label}: ${group.items.join(", ")}`,
    ),
    ``,
    `## Projects`,
    ``,
    ...projects.flatMap((project) => [
      `### ${project.title}`,
      ``,
      project.summary,
      ``,
      `- Stack: ${project.tech.join(", ")}`,
      ...(project.links ?? []).map(
        (link) => `- ${link.label}: ${link.url}`,
      ),
      ``,
    ]),
    `## Blog`,
    ``,
    ...getAllPosts().map(
      (post) =>
        `- [${post.title}](${siteConfig.url}/blog/${post.slug}): ${post.description}`,
    ),
    ``,
    `## Links`,
    ``,
    ...socialLinks
      .filter((link) => link.external)
      .map((link) => `- ${link.name}: ${link.url}`),
    ``,
    `## Contact`,
    ``,
    `- Email: ${siteConfig.email}`,
    ``,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
