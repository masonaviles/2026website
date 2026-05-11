"use client";

import clsx from "clsx";
import { CheckCircle2, Lightbulb, RotateCcw } from "lucide-react";
import { CodeSlot } from "./CodeSlot";
import { HookChip } from "./HookChip";
import type { HookName, Puzzle } from "./puzzles";

export function PuzzleCard({
  puzzle,
  index,
  placements,
  onClear,
  onReset,
}: {
  puzzle: Puzzle;
  index: number;
  placements: Record<string, HookName>;
  onClear: (slotId: string) => void;
  onReset: () => void;
}) {
  const allFilled = puzzle.slotIds.every((id) => placements[id]);
  const correctness: Record<string, boolean> = Object.fromEntries(
    puzzle.slotIds.map((id) => [id, placements[id] === puzzle.expected[id]]),
  );
  const solved =
    allFilled && puzzle.slotIds.every((id) => correctness[id]);

  // Hooks already correctly placed shouldn't appear in the tray.
  const usedHooks = new Set(
    puzzle.slotIds
      .filter((id) => correctness[id])
      .map((id) => placements[id]),
  );

  return (
    <article
      className={clsx(
        "rounded-2xl border bg-panel transition-colors",
        solved ? "border-accent" : "border-stroke",
      )}
    >
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-stroke px-5 py-3.5">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
            puzzle {index + 1} of 3
          </span>
          <h2 className="text-lg font-semibold text-ink">{puzzle.title}</h2>
        </div>
        {solved && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-2.5 py-0.5 font-mono text-[11px] text-accent">
            <CheckCircle2 size={12} aria-hidden="true" />
            solved
          </span>
        )}
      </header>

      <p className="border-b border-stroke px-5 py-3 text-[13px] leading-relaxed text-ink-soft">
        {puzzle.description}
      </p>

      <div className="grid gap-5 p-5 lg:grid-cols-[1.5fr_1fr]">
        {/* Left: code + tray */}
        <div className="flex flex-col gap-4">
          <pre
            className="overflow-x-auto rounded-lg border border-stroke px-4 py-3 font-mono text-[12.5px] leading-[1.65] text-ink-soft"
            style={{ background: "var(--term-bg)" }}
          >
            {puzzle.source.map((line, i) => (
              <div key={i} className="whitespace-pre">
                {line.map((frag, j) =>
                  frag.type === "text" ? (
                    <span key={j}>{frag.value}</span>
                  ) : (
                    <CodeSlot
                      key={frag.id}
                      slotId={frag.id}
                      puzzleId={puzzle.id}
                      filled={placements[frag.id] ?? null}
                      isCorrect={correctness[frag.id] ?? false}
                      onClear={() => onClear(frag.id)}
                    />
                  ),
                )}
              </div>
            ))}
          </pre>

          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute">
              available hooks · drag into the slot
            </div>
            <div className="flex flex-wrap gap-2">
              {puzzle.available.map((hook) => (
                <HookChip
                  key={hook}
                  hook={hook}
                  puzzleId={puzzle.id}
                  disabled={usedHooks.has(hook)}
                />
              ))}
              <button
                type="button"
                onClick={onReset}
                className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-stroke bg-bg-2 px-2 py-1 font-mono text-[10px] text-ink-mute transition-colors hover:border-accent hover:text-accent"
              >
                <RotateCcw size={10} aria-hidden="true" />
                reset
              </button>
            </div>
          </div>

          {solved && (
            <div
              className="flex items-start gap-2.5 rounded-lg border border-accent/50 px-3 py-2.5 text-[12.5px] leading-relaxed text-ink-soft"
              style={{
                background: "color-mix(in srgb, var(--accent) 8%, transparent)",
              }}
            >
              <Lightbulb
                size={14}
                className="mt-0.5 flex-shrink-0 text-accent"
                aria-hidden="true"
              />
              <span>
                <b className="font-semibold text-ink">why it works:</b>{" "}
                {puzzle.hint}
              </span>
            </div>
          )}
        </div>

        {/* Right: live preview */}
        <div className="flex flex-col gap-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute">
            live preview
          </div>
          <div
            className={clsx(
              "flex min-h-[140px] flex-col justify-center rounded-lg border p-4",
              solved
                ? "border-accent"
                : allFilled
                  ? "border-danger"
                  : "border-stroke",
            )}
            style={{ background: "var(--bg-2)" }}
          >
            <puzzle.Preview correct={solved} />
          </div>
          {allFilled && !solved && (
            <p className="font-mono text-[11px] text-danger">
              not quite — try a different hook.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
