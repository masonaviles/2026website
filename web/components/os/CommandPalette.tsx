"use client";

import { useEffect, useState } from "react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-[14vh]"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-[min(560px,92vw)] overflow-hidden rounded-xl border border-stroke bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]"
      >
        <div className="flex items-center gap-2 border-b border-stroke px-4 py-3">
          <span className="font-mono text-xs text-ink-mute">›</span>
          <input
            autoFocus
            type="text"
            placeholder="Type a command — palette ships in phase 5"
            className="w-full bg-transparent font-mono text-sm text-ink placeholder:text-ink-mute focus:outline-none"
          />
          <kbd className="rounded border border-stroke bg-panel-2 px-1.5 py-px font-mono text-[10px] text-ink-soft">
            esc
          </kbd>
        </div>
        <div className="px-4 py-3 font-mono text-xs text-ink-mute">
          phase 1 · placeholder. real palette + joke commands land in phase 5.
        </div>
      </div>
    </div>
  );
}
