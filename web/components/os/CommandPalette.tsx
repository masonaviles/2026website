"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Folder,
  FileText,
  Sparkles,
  Terminal as TerminalIcon,
} from "lucide-react";
import clsx from "clsx";
import { emit } from "@/lib/achievements/events";

export interface PaletteItem {
  id: string;
  label: string;
  hint?: string;
  href?: string;
  /** Joke command callback — runs and closes the palette. */
  action?: () => void;
  group: "routes" | "blog" | "commands";
  keywords?: string;
}

interface BlogLink {
  slug: string;
  title: string;
}

const ROUTES: PaletteItem[] = [
  { id: "r-profile", label: "~/profile", hint: "hero · summary", href: "/", group: "routes" },
  { id: "r-work", label: "~/work", hint: "career chapters", href: "/work", group: "routes" },
  { id: "r-projects", label: "~/projects", hint: "shipped work", href: "/projects", group: "routes" },
  { id: "r-blog", label: "~/blog", hint: "notes", href: "/blog", group: "routes" },
  { id: "r-system", label: "~/system", hint: "live design system", href: "/system", group: "routes" },
  { id: "r-playground", label: "~/playground", hint: "AI demos", href: "/playground", group: "routes" },
  { id: "r-ask", label: "~/playground/ask", hint: "chat about Mason", href: "/playground/ask", group: "routes" },
  { id: "r-cl", label: "~/playground/cover-letter", hint: "generator", href: "/playground/cover-letter", group: "routes" },
];

export function CommandPalette({ posts }: { posts: BlogLink[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build the full item list (memoized over posts only — joke commands are static).
  const allItems: PaletteItem[] = useMemo(() => {
    const blog: PaletteItem[] = posts.map((p) => ({
      id: `b-${p.slug}`,
      label: p.title,
      hint: `~/blog/${p.slug}`,
      href: `/blog/${p.slug}`,
      group: "blog",
      keywords: p.slug,
    }));
    const commands: PaletteItem[] = [
      {
        id: "c-hire",
        label: "sudo hire mason",
        hint: "opens contact",
        group: "commands",
        keywords: "contact email hire job",
        action: () => {
          emit({ type: "easter:cmd", cmd: "sudo hire mason" });
          // Click the actual Contact CTA if visible; otherwise mailto: fallback.
          const btn = document.querySelector<HTMLButtonElement>(
            'button[data-cta="contact"]',
          );
          if (btn) btn.click();
          else window.location.href = "mailto:mce.aviles@gmail.com";
        },
      },
      {
        id: "c-whoami",
        label: "whoami",
        hint: "print profile",
        group: "commands",
        keywords: "profile bio about",
        action: () => {
          emit({ type: "easter:cmd", cmd: "whoami" });
          router.push("/");
        },
      },
      {
        id: "c-iddqd",
        label: "iddqd",
        hint: "god mode",
        group: "commands",
        keywords: "easter egg cheat",
        action: () => {
          emit({ type: "easter:cmd", cmd: "iddqd" });
          document.documentElement.classList.add("god-mode");
          window.setTimeout(
            () => document.documentElement.classList.remove("god-mode"),
            2000,
          );
        },
      },
      {
        id: "c-gitlog",
        label: "git log",
        hint: "recent activity",
        group: "commands",
        keywords: "history commits",
        action: () => {
          emit({ type: "easter:cmd", cmd: "git log" });
          window.open("https://github.com/masonaviles/2026website/commits/main", "_blank");
        },
      },
    ];
    return [...ROUTES, ...blog, ...commands];
  }, [posts, router]);

  // Filter on every query change.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((item) => {
      const haystack = `${item.label} ${item.hint ?? ""} ${item.keywords ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [allItems, query]);

  useEffect(() => {
    // Reset selection when the filter set changes — synchronizing internal
    // cursor with external (memoized) state is the canonical use of an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCursor(0);
  }, [filtered.length]);

  // Open / close shortcut + external open event (used by the topbar search
  // button so mobile users can trigger the palette without a keyboard).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    function onExternalOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mason-os:open-palette", onExternalOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mason-os:open-palette", onExternalOpen);
    };
  }, []);

  // Focus the input + reset query when opened.
  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 10);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
    }
  }, [open]);

  function run(item: PaletteItem) {
    setOpen(false);
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }
  }

  function onPaletteKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(filtered.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[cursor];
      if (item) run(item);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 px-4 pt-[14vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onPaletteKey}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-[min(560px,100%)] overflow-hidden rounded-xl border border-stroke bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]"
      >
        <div className="flex items-center gap-2 border-b border-stroke px-4 py-3">
          <span className="font-mono text-xs text-ink-mute">›</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a route, post, or command…"
            className="w-full bg-transparent font-mono text-sm text-ink placeholder:text-ink-mute focus:outline-none"
          />
          <kbd className="rounded border border-stroke bg-panel-2 px-1.5 py-px font-mono text-[10px] text-ink-soft">
            esc
          </kbd>
        </div>

        <div className="max-h-[55vh] overflow-y-auto scrollbar-themed">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center font-mono text-xs text-ink-mute">
              No matches.
            </div>
          ) : (
            <Groups items={filtered} cursor={cursor} onRun={run} />
          )}
        </div>

        <footer className="flex items-center justify-between border-t border-stroke bg-bg-2 px-3 py-2 font-mono text-[10px] text-ink-mute">
          <span className="flex items-center gap-2">
            <kbd className="rounded border border-stroke bg-panel-2 px-1 py-px">↑↓</kbd>
            navigate
            <kbd className="rounded border border-stroke bg-panel-2 px-1 py-px">enter</kbd>
            run
          </span>
          <span>{filtered.length} results</span>
        </footer>
      </div>
    </div>
  );
}

function Groups({
  items,
  cursor,
  onRun,
}: {
  items: PaletteItem[];
  cursor: number;
  onRun: (i: PaletteItem) => void;
}) {
  // Preserve filtered order but group with header rows.
  const groups: { id: PaletteItem["group"]; title: string; items: PaletteItem[] }[] = [
    { id: "routes", title: "routes", items: items.filter((i) => i.group === "routes") },
    { id: "blog", title: "blog", items: items.filter((i) => i.group === "blog") },
    { id: "commands", title: "commands", items: items.filter((i) => i.group === "commands") },
  ];

  const globalIndex = (id: string) => items.findIndex((i) => i.id === id);

  return (
    <div className="flex flex-col gap-1 py-2">
      {groups.map((g) =>
        g.items.length === 0 ? null : (
          <div key={g.id}>
            <div className="px-3 pt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute">
              {g.title}
            </div>
            <ul role="list" className="flex flex-col">
              {g.items.map((it) => {
                const idx = globalIndex(it.id);
                const active = idx === cursor;
                return (
                  <li key={it.id}>
                    <button
                      type="button"
                      onMouseEnter={() => {
                        // Soft pointer affordance — keyboard remains primary.
                      }}
                      onClick={() => onRun(it)}
                      className={clsx(
                        "flex w-full items-center gap-2.5 px-3 py-2 text-left font-mono text-[12.5px] outline-none transition-colors",
                        active
                          ? "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-accent"
                          : "text-ink-soft hover:bg-panel-2 hover:text-ink",
                      )}
                    >
                      <span className="text-ink-mute">
                        {it.group === "routes" ? (
                          <Folder size={12} aria-hidden="true" />
                        ) : it.group === "blog" ? (
                          <FileText size={12} aria-hidden="true" />
                        ) : (
                          <TerminalIcon size={12} aria-hidden="true" />
                        )}
                      </span>
                      <span className="flex-1">{it.label}</span>
                      {it.hint && (
                        <span className="text-[11px] text-ink-mute">{it.hint}</span>
                      )}
                      {it.group === "commands" && (
                        <Sparkles size={11} aria-hidden="true" className="text-gold" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ),
      )}
    </div>
  );
}
