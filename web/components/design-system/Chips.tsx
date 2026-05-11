export function Chips() {
  return (
    <div className="flex flex-col gap-3">
      <Row label="eyebrow">
        <span
          className="inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-[11px] text-accent"
          style={{
            background: "var(--eyebrow-bg)",
            borderColor: "var(--eyebrow-stroke)",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-accent"
            style={{
              boxShadow: "var(--pulse-shadow)",
              animation: "pulse 2s infinite",
            }}
            aria-hidden="true"
          />
          status chip
        </span>
      </Row>

      <Row label="meta-row">
        <div className="inline-flex items-center gap-2.5 rounded-lg border border-stroke bg-panel px-3 py-2 font-mono text-xs text-ink-soft">
          <span className="min-w-[80px] text-ink-mute">key</span>
          <span className="text-ink">value</span>
        </div>
        <div className="inline-flex items-center gap-2.5 rounded-lg border border-stroke bg-panel px-3 py-2 font-mono text-xs text-ink-soft">
          <span className="min-w-[80px] text-ink-mute">status</span>
          <span className="text-accent">ok</span>
        </div>
      </Row>

      <Row label="tag">
        <span className="rounded-md border border-stroke bg-bg-2 px-1.5 py-px font-mono text-[10px] text-ink-soft">
          frontend
        </span>
        <span className="rounded-md border border-stroke bg-bg-2 px-1.5 py-px font-mono text-[10px] text-ink-soft">
          design-system
        </span>
        <span className="rounded-md px-1.5 py-px font-mono text-[10px] text-ink-mute">stack-token</span>
      </Row>

      <Row label="badge">
        <span className="rounded-full border border-[color-mix(in_srgb,var(--accent)_28%,transparent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-1.5 text-[10px] leading-tight text-accent">
          main
        </span>
        <span className="rounded-full border border-[color-mix(in_srgb,var(--accent-2)_28%,transparent)] bg-[color-mix(in_srgb,var(--accent-2)_14%,transparent)] px-1.5 text-[10px] leading-tight text-accent-2">
          3
        </span>
      </Row>

      <Row label="kbd">
        <kbd className="rounded border border-stroke bg-panel-2 px-1.5 py-px font-mono text-[10px] text-ink-soft">
          ⌘K
        </kbd>
        <kbd className="rounded border border-stroke bg-panel-2 px-1.5 py-px font-mono text-[10px] text-ink-soft">
          esc
        </kbd>
      </Row>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-center gap-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-mute">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
