export function StatusBar() {
  return (
    <footer
      className="flex items-center gap-3.5 border-t border-stroke px-3.5 font-mono text-[11px] text-ink-mute"
      style={{ background: "var(--status-grad)" }}
      role="status"
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-1.5">
        ⎇ <span className="text-accent">main</span>
      </span>
      <Sep />
      <span className="inline-flex items-center gap-1.5 text-accent">
        ● deployed · netlify
      </span>
      <Sep />
      <span className="inline-flex items-center gap-1.5 text-accent-2">
        ⚡ Lighthouse target ≥ 98
      </span>
      <Sep />
      <span className="inline-flex items-center gap-1.5">↑ phase 1 in flight</span>
      <Sep />
      <span className="inline-flex items-center gap-1.5 text-warn">★ 1/11 achievements</span>
      <span className="flex-1" />
      <span className="inline-flex items-center gap-1.5">FastAPI · fly · ok</span>
      <Sep />
      <span className="inline-flex items-center gap-1.5">powered by Claude</span>
      <Sep />
      <kbd className="rounded border border-stroke bg-panel-2 px-1.5 py-px text-[10px] text-ink-soft">
        ⌘K
      </kbd>
    </footer>
  );
}

function Sep() {
  return <span className="h-3 w-px bg-stroke" aria-hidden="true" />;
}
