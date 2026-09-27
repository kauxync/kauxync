import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { PostMeta } from "./post-utils";

export type { PostMeta, TocEntry } from "./post-utils";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");
const SLUG_PATTERN = /^[a-z0-9-]+$/i;

export interface Post extends PostMeta {
  content: string;
}

function postFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));
}

function parseMeta(slug: string, raw: string): PostMeta {
  const { data } = matter(raw);
  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : "",
    date: typeof data.date === "string" ? data.date : "",
    author: typeof data.author === "string" ? data.author : undefined,
    ogImage: typeof data.ogImage === "string" ? data.ogImage : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
  };
}

export function getAllPosts(): PostMeta[] {
  return postFiles()
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      return parseMeta(slug, raw);
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | null {
  if (!SLUG_PATTERN.test(slug)) return null;
  const ext = [".mdx", ".md"].find((e) =>
    fs.existsSync(path.join(POSTS_DIR, `${slug}${e}`)),
  );
  if (!ext) return null;
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}${ext}`), "utf8");
  const { content } = matter(raw);
  return { ...parseMeta(slug, raw), content };
}
