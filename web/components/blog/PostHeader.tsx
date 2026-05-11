import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Frontmatter } from "@/lib/blog";

export function PostHeader({
  meta,
  readingMinutes,
}: {
  meta: Frontmatter;
  readingMinutes: number;
}) {
  return (
    <header className="not-prose mb-8 flex flex-col gap-3">
      <Link
        href="/blog"
        className="inline-flex w-fit items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-mute transition-colors hover:text-accent"
      >
        <ChevronLeft size={12} aria-hidden="true" />
        ~/blog
      </Link>

      <h1 className="text-[clamp(28px,3.6vw,44px)] font-bold leading-[1.08] tracking-tight">
        {meta.title}
      </h1>

      <p className="max-w-[60ch] text-sm leading-relaxed text-ink-soft">
        {meta.description}
      </p>

      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-ink-mute">
        <time dateTime={meta.date}>
          {new Date(meta.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <span aria-hidden="true">·</span>
        <span>{readingMinutes} min read</span>
        {meta.tags.length > 0 && (
          <>
            <span aria-hidden="true">·</span>
            <span className="flex flex-wrap gap-1.5">
              {meta.tags.map((t) => (
                <Link
                  key={t}
                  href={`/blog?tag=${encodeURIComponent(t)}`}
                  className="rounded-md border border-stroke bg-bg-2 px-1.5 py-px text-ink-soft transition-colors hover:border-accent hover:text-accent"
                >
                  #{t}
                </Link>
              ))}
            </span>
          </>
        )}
      </div>
    </header>
  );
}
