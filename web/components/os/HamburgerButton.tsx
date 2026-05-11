"use client";

import { Menu } from "lucide-react";

export function HamburgerButton() {
  return (
    <button
      type="button"
      aria-label="Open menu"
      title="Open menu"
      onClick={() => window.dispatchEvent(new Event("mason-os:toggle-nav"))}
      className="inline-grid h-[22px] w-[26px] place-items-center rounded-md text-ink-mute transition-colors hover:bg-panel-2 hover:text-ink lg:hidden"
    >
      <Menu size={14} aria-hidden="true" />
    </button>
  );
}
