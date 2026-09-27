export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author?: string;
  ogImage?: string;
  tags?: string[];
}

export const BLOG_PAGE_SIZE = 10;

export interface TocEntry {
  id: string;
  text: string;
}

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function readingTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function getToc(content: string): TocEntry[] {
  return content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.replace(/^##\s+/, "").trim())
    .filter((text) => text.length > 0)
    .map((text) => ({ id: slugify(text), text }));
}
