"use client";

import { ACHIEVEMENT_IDS } from "@/lib/achievements/registry";
import { useAchievements } from "@/lib/achievements/useAchievements";

export function StatusBarProgress() {
  const state = useAchievements();
  const count = Object.keys(state.unlocked).filter((id) =>
    (ACHIEVEMENT_IDS as readonly string[]).includes(id),
  ).length;
  const total = ACHIEVEMENT_IDS.length;
  const isDone = count === total;
  const color = isDone ? "text-accent" : count > 0 ? "text-warn" : "text-ink-mute";
  return (
    <span className={`inline-flex items-center gap-1.5 ${color}`}>
      ★ {count}/{total} achievements
    </span>
  );
}
