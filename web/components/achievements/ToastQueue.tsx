"use client";

import { useEffect } from "react";
import { Award } from "lucide-react";
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_IDS,
  type AchievementId,
} from "@/lib/achievements/registry";
import { useAchievements } from "@/lib/achievements/useAchievements";
import { dismissToast } from "@/lib/achievements/store";

const TOAST_TIMEOUT_MS = 5000;
const MAX_VISIBLE = 3;

export function ToastQueue() {
  const state = useAchievements();
  const visible = state.toasts.slice(-MAX_VISIBLE);

  // Auto-dismiss after timeout.
  useEffect(() => {
    if (visible.length === 0) return;
    const timers = visible.map((t) =>
      window.setTimeout(() => dismissToast(t.id), TOAST_TIMEOUT_MS),
    );
    return () => {
      for (const t of timers) window.clearTimeout(t);
    };
  }, [visible]);

  if (visible.length === 0) return null;

  const totalUnlocked = Object.keys(state.unlocked).filter((id) =>
    (ACHIEVEMENT_IDS as readonly string[]).includes(id),
  ).length;

  return (
    <div
      className="pointer-events-none fixed bottom-12 right-7 z-50 flex flex-col gap-2"
      role="status"
      aria-live="polite"
      aria-label="Achievement notifications"
    >
      {visible.map((t) => (
        <Toast
          key={t.id}
          achievement={t.achievement}
          onDismiss={() => dismissToast(t.id)}
          count={totalUnlocked}
        />
      ))}
    </div>
  );
}

function Toast({
  achievement,
  onDismiss,
  count,
}: {
  achievement: AchievementId;
  onDismiss: () => void;
  count: number;
}) {
  const def = ACHIEVEMENTS[achievement];
  return (
    <button
      type="button"
      onClick={onDismiss}
      className="pointer-events-auto relative grid w-[320px] grid-cols-[auto_1fr] items-center gap-3 overflow-hidden rounded-[10px] border border-stroke bg-panel p-3.5 text-left font-mono shadow-[0_24px_60px_-22px_rgba(0,0,0,0.6)] outline-none transition-colors hover:bg-panel-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent motion-safe:[animation:rise_.55s_cubic-bezier(.2,.7,.2,1)_both]"
      style={{ boxShadow: "var(--toast-shadow)" }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[2px] rounded-l-[10px] bg-accent"
      />
      <span
        className="grid h-9 w-9 place-items-center rounded-lg border"
        style={{
          background: "var(--trophy-grad)",
          borderColor: "var(--trophy-stroke)",
          color: "var(--gold)",
        }}
      >
        <Award size={18} aria-hidden="true" />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[10px] uppercase tracking-[0.06em] text-accent">
          [ achievement.unlocked ]
        </span>
        <span className="text-[13px] font-semibold text-ink">{def.label}</span>
        <span className="text-[11px] text-ink-mute">
          {def.description.toLowerCase()} · {count}/{ACHIEVEMENT_IDS.length}
        </span>
      </span>
    </button>
  );
}
