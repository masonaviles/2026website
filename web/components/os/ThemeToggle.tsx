"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import {
  type Theme,
  resolveInitialTheme,
  setStoredTheme,
} from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // Read the post-hydration theme from <html data-theme>, which the inline
    // head script already set before paint. Safe — DOM is source of truth.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(
      (document.documentElement.getAttribute("data-theme") as Theme | null) ??
        resolveInitialTheme(),
    );
  }, []);

  function toggle() {
    const next: Theme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setStoredTheme(next);
    setTheme(next);
  }

  // Render once we know the theme (avoid flashing the wrong icon during hydration).
  const isLight = theme === "light";
  const Icon = isLight ? Moon : Sun;
  const label = isLight ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      aria-pressed={isLight}
      title="Toggle theme"
      className="inline-flex h-[22px] items-center gap-1.5 rounded-md px-2 font-mono text-[10px] text-ink-soft transition-colors hover:bg-panel-2 hover:text-ink"
    >
      <Icon size={14} aria-hidden="true" />
      <span suppressHydrationWarning>{theme ? label : ""}</span>
    </button>
  );
}
