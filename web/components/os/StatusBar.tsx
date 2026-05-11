import { StatusBarProgress } from "@/components/achievements/StatusBarProgress";

export function StatusBar() {
  return (
    <footer
      className="flex items-center gap-2.5 overflow-x-auto border-t border-stroke px-3 font-mono text-[11px] text-ink-mute sm:gap-3.5 sm:px-3.5"
      style={{ background: "var(--status-grad)" }}
      role="status"
      aria-live="polite"
    >
      <span className="inline-flex shrink-0 items-center gap-1.5">
        ⎇ <span className="text-accent">main</span>
      </span>
      <Sep />
      <span className="inline-flex shrink-0 items-center gap-1.5 text-accent">
        ● deployed
      </span>
      <span className="hidden sm:contents">
        <Sep />
        <span className="inline-flex shrink-0 items-center gap-1.5 text-accent-2">
          ⚡ Lighthouse ≥ 98
        </span>
      </span>
      <Sep />
      <StatusBarProgress />
      <span className="flex-1" />
      <span className="hidden sm:inline-flex shrink-0 items-center gap-1.5">
        FastAPI · fly · ok
      </span>
      <span className="hidden sm:contents">
        <Sep />
      </span>
      <span className="hidden md:inline-flex shrink-0 items-center gap-1.5">
        powered by Claude
      </span>
      <span className="hidden md:contents">
        <Sep />
      </span>
      <kbd className="shrink-0 rounded border border-stroke bg-panel-2 px-1.5 py-px text-[10px] text-ink-soft">
        ⌘K
      </kbd>
    </footer>
  );
}

function Sep() {
  return <span className="h-3 w-px shrink-0 bg-stroke" aria-hidden="true" />;
}
