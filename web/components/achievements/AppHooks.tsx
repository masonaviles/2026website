"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { emit } from "@/lib/achievements/events";
import { attachKonami } from "@/lib/konami";

/**
 * Mounted once inside the OS shell. Wires:
 *   - hello_world on first mount
 *   - route:mounted on every path change (architect when /system)
 *   - power_user via a global keydown tracker (counts unique key combos)
 *   - Konami code listener
 */
export function AppHooks() {
  const pathname = usePathname();

  // hello_world: first mount.
  useEffect(() => {
    emit({ type: "app:mounted" });
  }, []);

  // route:mounted on every navigation.
  useEffect(() => {
    if (!pathname) return;
    emit({ type: "route:mounted", route: pathname });
  }, [pathname]);

  // Track unique keyboard shortcuts for power_user.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Skip typing in inputs/textareas.
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      // Modifier-based shortcuts only; bare keys aren't "shortcuts."
      const usesMod = e.metaKey || e.ctrlKey || e.altKey;
      if (!usesMod) return;
      const parts: string[] = [];
      if (e.metaKey) parts.push("meta");
      if (e.ctrlKey) parts.push("ctrl");
      if (e.altKey) parts.push("alt");
      if (e.shiftKey) parts.push("shift");
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (["Shift", "Control", "Alt", "Meta"].includes(e.key)) return;
      parts.push(key);
      emit({ type: "kbd:shortcut", combo: parts.join("+") });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Konami code.
  useEffect(() => {
    return attachKonami(() => emit({ type: "easter:konami" }));
  }, []);

  return null;
}
