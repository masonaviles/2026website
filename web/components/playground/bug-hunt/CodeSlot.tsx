"use client";

import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { X } from "lucide-react";
import type { HookName } from "./puzzles";

export function CodeSlot({
  slotId,
  puzzleId,
  filled,
  isCorrect,
  onClear,
}: {
  slotId: string;
  puzzleId: string;
  filled: HookName | null;
  isCorrect: boolean;
  onClear: () => void;
}) {
  const id = `${puzzleId}:slot:${slotId}`;
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { slotId, puzzleId },
  });

  if (filled) {
    return (
      <span
        ref={setNodeRef}
        className={clsx(
          "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[12.5px]",
          isCorrect
            ? "border-accent text-accent"
            : "border-danger text-danger",
        )}
        style={
          isCorrect
            ? { background: "color-mix(in srgb, var(--accent) 12%, transparent)" }
            : { background: "color-mix(in srgb, var(--danger) 12%, transparent)" }
        }
      >
        {filled}
        <button
          type="button"
          onClick={onClear}
          aria-label="Remove hook"
          className="grid h-3.5 w-3.5 place-items-center rounded-sm hover:bg-bg-2"
        >
          <X size={10} aria-hidden="true" />
        </button>
      </span>
    );
  }

  return (
    <span
      ref={setNodeRef}
      className={clsx(
        "inline-flex items-center rounded-md border border-dashed px-3 py-0.5 font-mono text-[12.5px] transition-colors",
        isOver
          ? "border-accent bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-accent"
          : "border-ink-mute/40 text-ink-mute",
      )}
    >
      {"_____"}
    </span>
  );
}
