"use client";

import { useEffect, useRef, useState } from "react";

export type HookName =
  | "useState"
  | "useEffect"
  | "useMemo"
  | "useRef"
  | "useCallback";

export type SourceFragment =
  | { type: "text"; value: string }
  | { type: "slot"; id: string };

export interface Puzzle {
  id: string;
  title: string;
  description: string;
  /** Source lines — each line is an array of fragments. */
  source: SourceFragment[][];
  /** Ordered slot IDs (the user fills these). */
  slotIds: string[];
  /** Correct answer for each slot. */
  expected: Record<string, HookName>;
  /** Hooks offered in the tray. */
  available: HookName[];
  /** Live preview component — renders broken or fixed based on `correct`. */
  Preview: React.ComponentType<{ correct: boolean }>;
  /** Why this is the right answer. Shown after solving. */
  hint: string;
}

/* ---------- Puzzle 1 · useState ---------- */

function P1Broken() {
  // Bug: just a plain number. The click handler "increments" via a no-op
  // expression — React has no reason to re-render so the visible count stays 0.
  const count = 0;
  return (
    <button
      type="button"
      onClick={() => {
        /* nothing to update: count isn't state */
      }}
      className="rounded-md border border-stroke bg-bg-2 px-4 py-2 font-mono text-sm text-ink-soft hover:border-accent hover:text-accent"
    >
      Clicked {count} times
    </button>
  );
}

function P1Fixed() {
  const [count, setCount] = useState(0);
  return (
    <button
      type="button"
      onClick={() => setCount((c) => c + 1)}
      className="rounded-md border border-accent bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-4 py-2 font-mono text-sm text-accent"
    >
      Clicked {count} times
    </button>
  );
}

function Puzzle1Preview({ correct }: { correct: boolean }) {
  return correct ? <P1Fixed /> : <P1Broken />;
}

/* ---------- Puzzle 2 · useEffect ---------- */

function P2Broken() {
  // Bug: time captured at mount, never updated.
  const initial = new Date().toLocaleTimeString();
  return (
    <div className="font-mono text-sm">
      <span className="text-ink-mute">time → </span>
      <span className="text-ink-soft">{initial}</span>
      <span className="ml-2 text-[10px] uppercase tracking-[0.08em] text-danger">
        frozen
      </span>
    </div>
  );
}

function P2Fixed() {
  const [now, setNow] = useState(() => new Date().toLocaleTimeString());
  useEffect(() => {
    const id = window.setInterval(
      () => setNow(new Date().toLocaleTimeString()),
      1000,
    );
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="font-mono text-sm">
      <span className="text-ink-mute">time → </span>
      <span className="text-accent">{now}</span>
      <span className="ml-2 text-[10px] uppercase tracking-[0.08em] text-accent">
        live
      </span>
    </div>
  );
}

function Puzzle2Preview({ correct }: { correct: boolean }) {
  return correct ? <P2Fixed /> : <P2Broken />;
}

/* ---------- Puzzle 3 · useRef ---------- */

function P3Broken() {
  // Bug: no ref attached, button can't reach the input.
  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="type here…"
        className="rounded-md border border-stroke bg-bg-2 px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <button
        type="button"
        onClick={() => {
          /* no ref to grab */
        }}
        className="rounded-md border border-stroke bg-bg-2 px-3 py-2 font-mono text-sm text-ink-soft hover:border-accent hover:text-accent"
      >
        Focus the input
      </button>
    </div>
  );
}

function P3Fixed() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="text"
        placeholder="type here…"
        className="rounded-md border border-stroke bg-bg-2 px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-accent"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.focus()}
        className="rounded-md border border-accent bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] px-3 py-2 font-mono text-sm text-accent"
      >
        Focus the input
      </button>
    </div>
  );
}

function Puzzle3Preview({ correct }: { correct: boolean }) {
  return correct ? <P3Fixed /> : <P3Broken />;
}

/* ---------- Puzzle list ---------- */

const T = (value: string): SourceFragment => ({ type: "text", value });
const S = (id: string): SourceFragment => ({ type: "slot", id });

export const PUZZLES: Puzzle[] = [
  {
    id: "counter",
    title: "Counter that never counts",
    description:
      "Click the button → the count should go up. It doesn't. What's missing?",
    source: [
      [T("function Counter() {")],
      [T("  const [count, setCount] = "), S("slot1"), T("(0);")],
      [T("  return (")],
      [T('    <button onClick={() => setCount(c => c + 1)}>')],
      [T("      Clicked {count} times")],
      [T("    </button>")],
      [T("  );")],
      [T("}")],
    ],
    slotIds: ["slot1"],
    expected: { slot1: "useState" },
    available: ["useState", "useEffect", "useMemo", "useRef"],
    Preview: Puzzle1Preview,
    hint: "useState gives you a value that triggers a re-render when you call its setter. Plain variables don't — React has no way to know they changed.",
  },
  {
    id: "clock",
    title: "Clock frozen in time",
    description:
      "The clock shows the current time… and never moves. Add the hook that runs a side-effect after render.",
    source: [
      [T("function Clock() {")],
      [
        T("  const [time, setTime] = useState(() ="),
        T("> new Date().toLocaleTimeString());"),
      ],
      [T("  "), S("slot1"), T("(() => {")],
      [T("    const id = setInterval(")],
      [
        T("      () => setTime(new Date().toLocaleTimeString()),"),
      ],
      [T("      1000")],
      [T("    );")],
      [T("    return () => clearInterval(id);")],
      [T("  }, []);")],
      [T("  return <div>{time}</div>;")],
      [T("}")],
    ],
    slotIds: ["slot1"],
    expected: { slot1: "useEffect" },
    available: ["useEffect", "useMemo", "useCallback", "useRef"],
    Preview: Puzzle2Preview,
    hint: "useEffect runs after render and lets you set up subscriptions, intervals, or fetches. The cleanup function clears the interval when the component unmounts.",
  },
  {
    id: "focus-button",
    title: "The focus button that doesn't focus",
    description:
      "Click the button → it should focus the input. Add the hook that holds a stable reference to a DOM node across renders.",
    source: [
      [T("function FocusButton() {")],
      [T("  const inputRef = "), S("slot1"), T("(null);")],
      [T("  return (")],
      [T("    <>")],
      [T("      <input ref={inputRef} />")],
      [
        T("      <button onClick={() => inputRef.current"),
        T("?.focus()}>"),
      ],
      [T("        Focus the input")],
      [T("      </button>")],
      [T("    </>")],
      [T("  );")],
      [T("}")],
    ],
    slotIds: ["slot1"],
    expected: { slot1: "useRef" },
    available: ["useRef", "useState", "useMemo", "useEffect"],
    Preview: Puzzle3Preview,
    hint: "useRef gives you a mutable .current container that React keeps stable across renders. Perfect for DOM references — useState would re-render every time you assigned a node.",
  },
];
