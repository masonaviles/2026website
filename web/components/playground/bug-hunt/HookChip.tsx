"use client";

import { useDraggable } from "@dnd-kit/core";
import clsx from "clsx";
import type { HookName } from "./puzzles";

export function HookChip({
  hook,
  puzzleId,
  disabled = false,
}: {
  hook: HookName;
  puzzleId: string;
  disabled?: boolean;
}) {
  const id = `${puzzleId}:hook:${hook}`;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { hook, puzzleId },
    disabled,
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      disabled={disabled}
      className={clsx(
        "inline-flex shrink-0 cursor-grab items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[12px] transition-all",
        disabled
          ? "cursor-not-allowed border-stroke bg-bg-2 text-ink-mute opacity-50"
          : "border-stroke bg-panel text-ink-soft hover:border-accent hover:text-accent active:cursor-grabbing",
        isDragging && "opacity-30",
      )}
    >
      <span className="text-ink-mute">{"<"}</span>
      {hook}
      <span className="text-ink-mute">{">"}</span>
    </button>
  );
}
