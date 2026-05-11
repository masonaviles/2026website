export function Motion() {
  return (
    <div className="flex flex-col gap-4">
      <Row label="pulse">
        <span
          className="inline-block h-3 w-3 rounded-full bg-accent"
          style={{
            boxShadow: "var(--pulse-shadow)",
            animation: "pulse 2s infinite",
          }}
        />
        <span className="font-mono text-[11px] text-ink-mute">
          @keyframes pulse · 2s loop · honors prefers-reduced-motion
        </span>
      </Row>
      <Row label="blink">
        <span
          aria-hidden="true"
          className="inline-block h-4 w-1 bg-accent"
          style={{ animation: "blink 1.05s steps(1) infinite" }}
        />
        <span className="font-mono text-[11px] text-ink-mute">
          @keyframes blink · steps(1) · terminal cursor
        </span>
      </Row>
      <Row label="lift">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-panel px-3 py-2 text-xs text-ink-soft transition-all duration-150 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        >
          hover me
        </button>
        <span className="font-mono text-[11px] text-ink-mute">
          translate-y(-2px) · 150ms · used on icon links + cards
        </span>
      </Row>
      <Row label="focus ring">
        <button
          type="button"
          className="rounded-md border border-stroke bg-panel px-3 py-2 text-xs text-ink-soft"
        >
          tab to me
        </button>
        <span className="font-mono text-[11px] text-ink-mute">
          2px solid accent · offset 2px · global :focus-visible
        </span>
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
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
