"use client";

import { HelpCircle } from "lucide-react";

export function HelpButton() {
  return (
    <button
      type="button"
      title="Help (?)"
      aria-label="Help"
      onClick={() => window.dispatchEvent(new Event("mason-os:open-help"))}
      className="inline-grid h-[22px] w-[26px] place-items-center rounded-md text-ink-mute transition-colors hover:bg-panel-2 hover:text-ink"
    >
      <HelpCircle size={14} aria-hidden="true" />
    </button>
  );
}
