"use client";

import { useEffect, useState } from "react";
import { Award, Keyboard, Sparkles, X } from "lucide-react";

export function HelpCheatsheet() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    function onKey(e: KeyboardEvent) {
      // Ignore typing inside form controls so '?' doesn't hijack inputs.
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.key === "?") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("mason-os:open-help", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mason-os:open-help", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        className="w-[min(560px,100%)] overflow-hidden rounded-xl border border-stroke bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]"
      >
        <header className="flex items-center justify-between border-b border-stroke px-4 py-3">
          <h2
            id="help-title"
            className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft"
          >
            help · cheatsheet
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="grid h-7 w-7 place-items-center rounded-md text-ink-mute transition-colors hover:bg-panel-2 hover:text-ink"
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex flex-col gap-6 px-5 py-5">
          <Section icon={Keyboard} title="Keyboard shortcuts">
            <KeyRow keys={["⌘", "K"]}>open command palette</KeyRow>
            <KeyRow keys={["?"]}>toggle this help</KeyRow>
            <KeyRow keys={["↑", "↓"]}>navigate palette</KeyRow>
            <KeyRow keys={["⏎"]}>pick / send</KeyRow>
            <KeyRow keys={["esc"]}>close any overlay</KeyRow>
          </Section>

          <Section icon={Sparkles} title="Konami code">
            <CmdRow cmd="↑ ↑ ↓ ↓ ← → ← → b a">
              press anywhere · alt theme + 🥚 achievement
            </CmdRow>
          </Section>

          <Section
            icon={Sparkles}
            title="Palette commands · open with ⌘K, then type"
          >
            <CmdRow cmd="sudo hire mason">opens contact</CmdRow>
            <CmdRow cmd="whoami">prints profile</CmdRow>
            <CmdRow cmd="iddqd">god mode flair</CmdRow>
            <CmdRow cmd="git log">recent commits on GitHub</CmdRow>
          </Section>

          <Section icon={Award} title="Achievements">
            <p className="text-[13px] leading-relaxed text-ink-soft">
              11 to find, including a meta one. The status bar tracks your
              progress. Reset from{" "}
              <span className="font-mono text-accent">~/profile</span> when you
              want a clean slate.
            </p>
          </Section>
        </div>

        <footer className="flex items-center justify-between border-t border-stroke bg-bg-2 px-4 py-2 font-mono text-[10px] text-ink-mute">
          <span>powered by Claude · mason.os</span>
          <span>
            press <kbd className="rounded border border-stroke bg-panel-2 px-1 py-px">?</kbd>{" "}
            anywhere
          </span>
        </footer>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
        <Icon size={11} aria-hidden={true} />
        {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

function KeyRow({
  keys,
  children,
}: {
  keys: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-[13px]">
      <span className="flex shrink-0 gap-1">
        {keys.map((k) => (
          <kbd
            key={k}
            className="rounded border border-stroke bg-panel-2 px-1.5 py-px font-mono text-[11px] text-ink-soft"
          >
            {k}
          </kbd>
        ))}
      </span>
      <span className="text-ink-soft">{children}</span>
    </div>
  );
}

function CmdRow({
  cmd,
  children,
}: {
  cmd: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-3 text-[13px]">
      <code className="shrink-0 rounded-md border border-stroke bg-bg-2 px-2 py-px font-mono text-[11px] text-accent">
        {cmd}
      </code>
      <span className="text-ink-soft">{children}</span>
    </div>
  );
}
