import Link from "next/link";
import { Rss, Tag as TagIcon } from "lucide-react";
import { getAllPosts, getAllTags } from "@/lib/blog";

export const metadata = {
  title: "~/blog · mason.os",
  description:
    "Notes on AI-augmented engineering, email infrastructure, React performance, and the design-system mindset.",
};

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);
  const { tag: activeTag } = await searchParams;
  const filtered = activeTag
    ? posts.filter((p) => p.meta.tags.includes(activeTag))
    : posts;

  return (
    <section className="flex flex-col gap-6 pb-8">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
          ~/blog — {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Notes from the editor.</h1>
          <Link
            href="/feed.xml"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-mute transition-colors hover:text-accent"
            aria-label="RSS feed"
          >
            <Rss size={12} aria-hidden="true" />
            rss
          </Link>
        </div>
        <p className="max-w-[60ch] text-sm leading-relaxed text-ink-soft">
          Long-form posts on AI-augmented engineering, email infrastructure,
          design systems, and React performance from a dozen years of shipping.
          MDX in the repo — interactive demos run inline.
        </p>
      </header>

      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-mute">
            <TagIcon size={11} aria-hidden="true" />
            filter
          </span>
          <Link
            href="/blog"
            className={
              !activeTag
                ? "rounded-md border border-accent bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-2 py-0.5 font-mono text-[11px] text-accent"
                : "rounded-md border border-stroke px-2 py-0.5 font-mono text-[11px] text-ink-soft transition-colors hover:border-accent hover:text-accent"
            }
          >
            all
          </Link>
          {tags.map((t) => {
            const active = activeTag === t.tag;
            return (
              <Link
                key={t.tag}
                href={`/blog?tag=${encodeURIComponent(t.tag)}`}
                className={
                  active
                    ? "rounded-md border border-accent bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-2 py-0.5 font-mono text-[11px] text-accent"
                    : "rounded-md border border-stroke px-2 py-0.5 font-mono text-[11px] text-ink-soft transition-colors hover:border-accent hover:text-accent"
                }
              >
                #{t.tag} <span className="text-ink-mute">·{t.count}</span>
              </Link>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-stroke bg-panel p-6 text-sm text-ink-soft">
          No posts {activeTag ? `tagged #${activeTag}` : "yet"}. Check back soon.
        </p>
      ) : (
        <ul className="flex flex-col gap-3" role="list">
          {filtered.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex flex-col gap-1.5 rounded-2xl border border-stroke bg-panel p-5 transition-all hover:-translate-y-0.5 hover:border-accent"
              >
                <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-ink-mute">
                  <time dateTime={p.meta.date}>
                    {new Date(p.meta.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  <span>{p.readingMinutes} min read</span>
                </div>
                <h2 className="text-xl font-semibold leading-tight tracking-tight text-ink transition-colors group-hover:text-accent">
                  {p.meta.title}
                </h2>
                <p className="text-sm leading-relaxed text-ink-soft">
                  {p.meta.description}
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {p.meta.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-stroke bg-bg-2 px-1.5 py-px font-mono text-[10px] text-ink-soft"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
