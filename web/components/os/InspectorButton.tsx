"use client";

import { LayoutGrid } from "lucide-react";
import { emit } from "@/lib/achievements/events";

export function InspectorButton() {
  return (
    <button
      type="button"
      title="Inspector (Phase 7 — overlay coming soon)"
      aria-label="Inspector"
      onClick={() => emit({ type: "inspector:opened" })}
      className="inline-grid h-[22px] w-[26px] place-items-center rounded-md text-ink-mute transition-colors hover:bg-panel-2 hover:text-ink"
    >
      <LayoutGrid size={14} aria-hidden="true" />
    </button>
  );
}
