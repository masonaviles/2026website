"use client";

import { useEffect, useRef, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CheckCircle2 } from "lucide-react";
import { emit } from "@/lib/achievements/events";
import { PUZZLES, type HookName } from "./puzzles";
import { PuzzleCard } from "./PuzzleCard";

type PlacementsByPuzzle = Record<string, Record<string, HookName>>;

export function BugHunt() {
  const [placements, setPlacements] = useState<PlacementsByPuzzle>({});
  const solvedNotified = useRef<Set<string>>(new Set());
  const allNotified = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const hookData = active.data.current as
      | { hook: HookName; puzzleId: string }
      | undefined;
    const slotData = over.data.current as
      | { slotId: string; puzzleId: string }
      | undefined;
    if (!hookData || !slotData) return;
    if (hookData.puzzleId !== slotData.puzzleId) return;

    setPlacements((prev) => ({
      ...prev,
      [slotData.puzzleId]: {
        ...(prev[slotData.puzzleId] ?? {}),
        [slotData.slotId]: hookData.hook,
      },
    }));
  }

  function clearSlot(puzzleId: string, slotId: string) {
    setPlacements((prev) => {
      const puzzle = { ...(prev[puzzleId] ?? {}) };
      delete puzzle[slotId];
      return { ...prev, [puzzleId]: puzzle };
    });
  }

  function resetPuzzle(puzzleId: string) {
    setPlacements((prev) => ({ ...prev, [puzzleId]: {} }));
  }

  // Compute solved set + emit achievements when a puzzle is freshly solved.
  const solvedIds = PUZZLES.filter((p) => {
    const pl = placements[p.id] ?? {};
    return p.slotIds.every((id) => pl[id] === p.expected[id]);
  }).map((p) => p.id);
  const solvedCount = solvedIds.length;

  useEffect(() => {
    for (const id of solvedIds) {
      if (!solvedNotified.current.has(id)) {
        solvedNotified.current.add(id);
        emit({ type: "bug-hunt:solved", puzzleId: id });
      }
    }
    if (
      !allNotified.current &&
      solvedCount === PUZZLES.length &&
      PUZZLES.length > 0
    ) {
      allNotified.current = true;
      emit({ type: "bug-hunt:all-solved" });
    }
  }, [solvedIds, solvedCount]);

  return (
    <div className="flex flex-col gap-5">
      <ProgressBar solved={solvedCount} total={PUZZLES.length} />

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-5">
          {PUZZLES.map((puzzle, i) => (
            <PuzzleCard
              key={puzzle.id}
              puzzle={puzzle}
              index={i}
              placements={placements[puzzle.id] ?? {}}
              onClear={(slotId) => clearSlot(puzzle.id, slotId)}
              onReset={() => resetPuzzle(puzzle.id)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

function ProgressBar({ solved, total }: { solved: number; total: number }) {
  const pct = Math.round((solved / total) * 100);
  return (
    <div className="rounded-2xl border border-stroke bg-panel px-5 py-4">
      <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-ink-mute">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2
            size={12}
            aria-hidden="true"
            className={solved === total ? "text-accent" : "text-ink-mute"}
          />
          progress · {solved}/{total} solved
        </span>
        <span>{pct}%</span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full"
        style={{ background: "var(--ach-track)" }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span
          className="block h-full bg-gradient-to-r from-accent to-accent-2 transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
