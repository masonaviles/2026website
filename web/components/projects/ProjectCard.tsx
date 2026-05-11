import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  const Wrapper = project.href ? "a" : "div";

  return (
    <Wrapper
      {...(project.href
        ? {
            href: project.href,
            target: project.href.startsWith("http") ? "_blank" : undefined,
            rel: project.href.startsWith("http")
              ? "noopener noreferrer"
              : undefined,
          }
        : {})}
      className={clsx(
        "group relative flex flex-col rounded-2xl border border-stroke bg-panel p-5 transition-all",
        project.href && "hover:-translate-y-0.5 hover:border-accent",
      )}
    >
      {project.meta && (
        <span
          className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border px-2 py-px font-mono text-[10px]"
          style={{
            background: "var(--eyebrow-bg)",
            borderColor: "var(--eyebrow-stroke)",
            color: "var(--accent)",
          }}
        >
          <span
            className="h-1 w-1 rounded-full bg-accent"
            style={{ boxShadow: "var(--pulse-shadow)" }}
          />
          meta · this site
        </span>
      )}

      <header className="mb-2 flex items-start justify-between gap-3 pr-2">
        <h3 className="text-lg font-semibold leading-tight tracking-tight text-ink">
          {project.title}
        </h3>
        {project.href && (
          <ArrowUpRight
            size={16}
            aria-hidden="true"
            className="mt-1 flex-shrink-0 text-ink-mute transition-colors group-hover:text-accent"
          />
        )}
      </header>

      <p className="font-mono text-[11px] text-ink-mute">
        {project.context} · {project.era}
      </p>

      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        {project.summary}
      </p>

      <ul className="mt-3 flex flex-col gap-1 text-[13px] leading-relaxed text-ink-soft">
        {project.highlights.map((h, i) => (
          <li key={i} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-2 inline-block h-[3px] w-[3px] flex-shrink-0 rounded-full bg-accent" />
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-4">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-md border border-stroke bg-bg-2 px-1.5 py-px font-mono text-[10px] text-ink-soft"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-md px-1.5 py-px font-mono text-[10px] text-ink-mute"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
