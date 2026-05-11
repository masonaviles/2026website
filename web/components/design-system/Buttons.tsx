import { ArrowRight, Download } from "lucide-react";

export function Buttons() {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        className="inline-flex items-center gap-2.5 rounded-lg bg-accent px-4 py-2.5 font-mono text-[13px] font-medium transition-transform hover:-translate-y-0.5"
        style={{
          color: "var(--btn-primary-ink)",
          boxShadow: "var(--btn-primary-shadow)",
        }}
      >
        <Download size={14} aria-hidden="true" />
        primary
      </button>
      <button
        type="button"
        className="group inline-flex items-center gap-2.5 rounded-lg border border-stroke bg-panel px-4 py-2.5 font-mono text-[13px] font-medium text-ink transition-colors hover:border-ink-mute hover:bg-panel-2"
      >
        ghost
        <ArrowRight
          size={14}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        />
      </button>
      <button
        type="button"
        disabled
        className="inline-flex items-center gap-2.5 rounded-lg bg-accent px-4 py-2.5 font-mono text-[13px] font-medium opacity-60"
        style={{ color: "var(--btn-primary-ink)" }}
      >
        disabled
      </button>
      <button
        type="button"
        className="inline-grid h-9 w-9 place-items-center rounded-lg border border-stroke bg-panel text-ink-soft transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        aria-label="Icon button"
      >
        <Download size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
