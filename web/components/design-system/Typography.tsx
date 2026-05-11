const SAMPLES = [
  { label: "display", className: "text-[clamp(36px,4.6vw,60px)] font-extrabold leading-[1.04] tracking-tight" },
  { label: "h1", className: "text-3xl font-bold tracking-tight" },
  { label: "h2", className: "text-xl font-semibold tracking-tight" },
  { label: "body", className: "text-base leading-relaxed text-ink-soft" },
  { label: "small", className: "text-sm text-ink-soft" },
  { label: "mono caption", className: "font-mono text-[11px] uppercase tracking-[0.12em] text-ink-mute" },
];

export function Typography() {
  return (
    <div className="flex flex-col gap-4">
      {SAMPLES.map((s) => (
        <div key={s.label} className="grid grid-cols-[120px_1fr] gap-3">
          <span className="pt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-mute">
            {s.label}
          </span>
          <span className={s.className}>
            The quick brown fox jumps over the lazy dog
          </span>
        </div>
      ))}
    </div>
  );
}
