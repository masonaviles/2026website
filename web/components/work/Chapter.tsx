import clsx from "clsx";
import { ACCENT_COLORS, type WorkEntry } from "@/lib/work";

export function Chapter({ entry }: { entry: WorkEntry }) {
  const accent = ACCENT_COLORS[entry.accent];

  return (
    <article
      data-chapter={entry.id}
      className="scroll-mt-6 rounded-2xl border border-stroke bg-panel p-6 transition-colors"
      style={
        {
          // Per-chapter accent — scoped, doesn't leak globally.
          "--chapter-fg": accent.fg,
          "--chapter-bg": accent.bg,
          background: `linear-gradient(180deg, ${accent.bg}, transparent 80%), var(--panel)`,
        } as React.CSSProperties
      }
    >
      <header className="mb-4 flex flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-mute">
            <span style={{ color: "var(--chapter-fg)" }}>●</span>{" "}
            {entry.dates}
            {entry.location ? ` · ${entry.location}` : null}
            {entry.current ? (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-stroke px-1.5 py-px text-[10px] text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> current
              </span>
            ) : null}
          </h2>
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-ink">
          {entry.role}
          <span className="text-ink-soft"> · {entry.company}</span>
        </h3>
        <p className="text-sm leading-relaxed text-ink-soft" style={{ maxWidth: "70ch" }}>
          {entry.summary}
        </p>
      </header>

      {entry.metrics && entry.metrics.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {entry.metrics.map((m) => (
            <span
              key={m.label}
              className="inline-flex items-center gap-1.5 rounded-md border border-stroke bg-bg-2 px-2.5 py-1 font-mono text-[11px] text-ink-soft"
              style={{ borderColor: "color-mix(in srgb, var(--chapter-fg) 35%, var(--stroke))" }}
            >
              <span className="text-ink-mute">{m.label}</span>
              <span className="font-semibold" style={{ color: "var(--chapter-fg)" }}>
                {m.value}
              </span>
            </span>
          ))}
        </div>
      )}

      <ul className="mb-4 flex flex-col gap-2 text-[14px] leading-relaxed text-ink-soft">
        {entry.bullets.map((b, i) => (
          <li key={i} className="flex gap-3" style={{ maxWidth: "75ch" }}>
            <span
              aria-hidden="true"
              className="mt-2 inline-block h-[3px] w-[3px] flex-shrink-0 rounded-full"
              style={{ background: "var(--chapter-fg)" }}
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5">
        {entry.stack.map((s) => (
          <span
            key={s}
            className={clsx(
              "rounded-md border border-stroke px-1.5 py-px font-mono text-[10px] text-ink-mute",
            )}
          >
            {s}
          </span>
        ))}
      </div>
    </article>
  );
}
