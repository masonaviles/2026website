import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

const FrontmatterSchema = z.object({
  title: z.string().min(1).max(140),
  description: z.string().min(1).max(280),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export interface PostSummary {
  slug: string;
  meta: Frontmatter;
  /** Reading time in minutes (rounded). */
  readingMinutes: number;
}

export interface Post extends PostSummary {
  /** Raw MDX body (not compiled yet — the page renderer handles that). */
  content: string;
}

async function readAll(): Promise<Post[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(POSTS_DIR);
  } catch {
    return [];
  }

  const posts: Post[] = [];
  for (const entry of entries) {
    if (!entry.endsWith(".mdx")) continue;
    const raw = await fs.readFile(path.join(POSTS_DIR, entry), "utf-8");
    const { data, content } = matter(raw);
    // Throws on invalid front-matter — fails the build, per spec.
    const meta = FrontmatterSchema.parse(data);
    const slug = entry.replace(/\.mdx$/, "");
    posts.push({
      slug,
      meta,
      content,
      readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    });
  }

  return posts
    .filter((p) => !p.meta.draft)
    .sort((a, b) => b.meta.date.localeCompare(a.meta.date));
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const all = await readAll();
  return all.map(
    ({ slug, meta, readingMinutes }): PostSummary => ({
      slug,
      meta,
      readingMinutes,
    }),
  );
}

export async function getPost(slug: string): Promise<Post | null> {
  const all = await readAll();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getAllPosts();
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const tag of p.meta.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
