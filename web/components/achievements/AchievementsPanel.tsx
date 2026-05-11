"use client";

import clsx from "clsx";
import { RotateCcw } from "lucide-react";
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_IDS,
  type AchievementId,
} from "@/lib/achievements/registry";
import { reset } from "@/lib/achievements/store";
import { useAchievements } from "@/lib/achievements/useAchievements";

export function AchievementsPanel({
  allowReset = false,
}: {
  allowReset?: boolean;
}) {
  const state = useAchievements();
  const unlockedSet = new Set(
    Object.keys(state.unlocked).filter((id) =>
      (ACHIEVEMENT_IDS as readonly string[]).includes(id),
    ),
  ) as Set<AchievementId>;
  const count = unlockedSet.size;
  const total = ACHIEVEMENT_IDS.length;
  const percent = Math.round((count / total) * 100);

  return (
    <div
      className="rounded-[10px] border border-stroke bg-panel px-3.5 py-3"
      aria-label="Achievement progress"
    >
      <div className="mb-2.5 flex items-center justify-between font-mono text-[11px] text-ink-mute">
        <span>
          <b className="font-semibold text-ink">achievements</b> · {count} /{" "}
          {total} unlocked
        </span>
        <span>{percent}%</span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full"
        style={{ background: "var(--ach-track)" }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span
          className="block h-full bg-gradient-to-r from-accent to-accent-2 transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div
        className="mt-2.5 grid gap-1.5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(34px, 1fr))" }}
      >
        {ACHIEVEMENT_IDS.map((id) => {
          const def = ACHIEVEMENTS[id];
          const isUnlocked = unlockedSet.has(id);
          return (
            <div
              key={id}
              title={`${def.label} — ${def.description}`}
              className={clsx(
                "grid aspect-square place-items-center rounded-md border font-mono text-[11px] transition-colors",
                isUnlocked ? "text-accent" : "border-stroke text-ink-mute",
              )}
              style={
                isUnlocked
                  ? {
                      background: "var(--ach-unlocked)",
                      borderColor: "var(--ach-unlocked-stroke)",
                    }
                  : { background: "var(--ach-cell-bg)" }
              }
            >
              {isUnlocked ? def.mark : id === "completionist" ? "?" : "·"}
            </div>
          );
        })}
      </div>
      {allowReset && count > 0 && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Reset all achievement progress?")) reset();
          }}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-stroke bg-bg-2 px-2 py-1 font-mono text-[10px] text-ink-mute transition-colors hover:border-accent hover:text-accent"
        >
          <RotateCcw size={10} aria-hidden="true" /> reset progress
        </button>
      )}
    </div>
  );
}
