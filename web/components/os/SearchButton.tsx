"use client";

import { Search } from "lucide-react";

/**
 * Search button — fires the command palette open event so mobile users
 * have a way to trigger the palette without a keyboard shortcut.
 */
export function SearchButton() {
  return (
    <button
      type="button"
      aria-label="Search"
      title="Search (⌘K)"
      onClick={() => window.dispatchEvent(new Event("mason-os:open-palette"))}
      className="inline-grid h-[22px] w-[26px] place-items-center rounded-md text-ink-mute transition-colors hover:bg-panel-2 hover:text-ink"
    >
      <Search size={14} aria-hidden="true" />
    </button>
  );
}
