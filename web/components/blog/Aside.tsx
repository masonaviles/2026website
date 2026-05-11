import { Info } from "lucide-react";

export function Aside({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <aside
      className="not-prose my-6 flex gap-3 rounded-xl border border-stroke bg-bg-2 p-4 text-[14px] leading-relaxed text-ink-soft"
      style={{
        borderColor: "color-mix(in srgb, var(--accent-2) 30%, var(--stroke))",
        background: "color-mix(in srgb, var(--accent-2) 5%, var(--bg-2))",
      }}
    >
      <div className="flex-shrink-0 pt-1 text-accent-2">
        <Info size={16} aria-hidden="true" />
      </div>
      <div className="flex-1">
        {title && (
          <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.08em] text-accent-2">
            {title}
          </div>
        )}
        <div>{children}</div>
      </div>
    </aside>
  );
}
