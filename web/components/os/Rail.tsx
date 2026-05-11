"use client";

import { Folder, Circle, Award, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";
import {
  ACHIEVEMENT_IDS,
  ACHIEVEMENTS,
  type AchievementId,
} from "@/lib/achievements/registry";
import { useAchievements } from "@/lib/achievements/useAchievements";

interface WorkspaceItem {
  label: string;
  href: string;
  badge?: { text: string; tone: "accent" | "accent-2" };
}

const WORKSPACE: WorkspaceItem[] = [
  { label: "~/profile", href: "/", badge: { text: "main", tone: "accent" } },
  { label: "~/work", href: "/work" },
  { label: "~/projects", href: "/projects" },
  { label: "~/blog", href: "/blog", badge: { text: "3", tone: "accent-2" } },
  { label: "~/system", href: "/system" },
  { label: "~/playground", href: "/playground" },
  { label: "~/contact", href: "/contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/**
 * Rail renders two ways:
 *   - On lg+ screens (≥1024px): inline sidebar column (always visible)
 *   - Below lg: hidden by default; listens for the `mason-os:toggle-nav`
 *     event and renders as a slide-out drawer overlay.
 *
 * The toggle event is decoupled (no shared state needed) — the
 * Hamburger button dispatches; the Rail listens.
 */
const MAX_RAIL_ROWS = 3;

export function Rail() {
  const pathname = usePathname() ?? "/";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const achievementState = useAchievements();

  // Latest unlocked first, then fill (or fully expand) with locked rows.
  const unlocked = Object.entries(achievementState.unlocked)
    .filter(([id]) => (ACHIEVEMENT_IDS as readonly string[]).includes(id))
    .map(([id, info]) => ({ id: id as AchievementId, at: info?.at ?? "" }))
    .sort((a, b) => b.at.localeCompare(a.at));
  const lockedAll = ACHIEVEMENT_IDS.filter(
    (id) => !achievementState.unlocked[id],
  );
  const lockedWired = lockedAll.filter((id) => ACHIEVEMENTS[id].wired);

  const railRows: { id: AchievementId; unlocked: boolean }[] =
    showAllAchievements
      ? [
          ...unlocked.map((u) => ({ id: u.id, unlocked: true })),
          ...lockedAll.map((id) => ({ id, unlocked: false })),
        ]
      : [
          ...unlocked
            .slice(0, MAX_RAIL_ROWS)
            .map((u) => ({ id: u.id, unlocked: true })),
          ...lockedWired
            .slice(0, Math.max(0, MAX_RAIL_ROWS - unlocked.length))
            .map((id) => ({ id, unlocked: false })),
        ];
  const unlockedCount = unlocked.length;
  const totalCount = ACHIEVEMENT_IDS.length;

  // Toggle event listener — decoupled comms with the Hamburger button.
  useEffect(() => {
    const onToggle = () => setDrawerOpen((v) => !v);
    const onClose = () => setDrawerOpen(false);
    window.addEventListener("mason-os:toggle-nav", onToggle);
    window.addEventListener("mason-os:close-nav", onClose);
    return () => {
      window.removeEventListener("mason-os:toggle-nav", onToggle);
      window.removeEventListener("mason-os:close-nav", onClose);
    };
  }, []);

  // Close drawer on route change. Reading the new pathname and clearing
  // the open flag is the canonical sync-from-external-state pattern.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawerOpen(false);
  }, [pathname]);

  // Close on Esc when drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const railBody = (
    <div className="scrollbar-themed flex h-full flex-col gap-3 overflow-y-auto font-mono">
      <div className="lg:hidden flex items-center justify-between px-1 pt-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute">
          workspace
        </span>
        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close menu"
          className="grid h-7 w-7 place-items-center rounded-md text-ink-mute transition-colors hover:bg-panel-2 hover:text-ink"
        >
          <X size={14} />
        </button>
      </div>

      <div>
        <RailHeading className="hidden lg:block">Workspace</RailHeading>
        <ul className="flex flex-col gap-0.5" role="list">
          {WORKSPACE.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors",
                    active ? "text-accent" : "text-ink-soft hover:bg-panel hover:text-ink",
                  )}
                  style={active ? { background: "var(--rail-active)" } : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="w-2.5 text-ink-mute">{active ? "▾" : "▸"}</span>
                  <span className="grid w-3.5 place-items-center text-ink-mute">
                    <Folder size={12} aria-hidden="true" />
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className={clsx(
                        "rounded-full border px-1.5 text-[10px] leading-tight",
                        item.badge.tone === "accent"
                          ? "border-[color-mix(in_srgb,var(--accent)_28%,transparent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-accent"
                          : "border-[color-mix(in_srgb,var(--accent-2)_28%,transparent)] bg-[color-mix(in_srgb,var(--accent-2)_14%,transparent)] text-accent-2",
                      )}
                    >
                      {item.badge.text}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <RailHeading>Outline</RailHeading>
        <ul className="flex flex-col gap-0.5" role="list">
          <OutlineRow>summary</OutlineRow>
          <OutlineRow>stack</OutlineRow>
          <OutlineRow>social</OutlineRow>
        </ul>
      </div>

      <div>
        <RailHeading>
          Achievements · {unlockedCount}/{totalCount}
        </RailHeading>
        <ul className="flex flex-col gap-0.5" role="list">
          {railRows.map((row) => (
            <AchievementRow
              key={row.id}
              unlocked={row.unlocked}
              label={row.unlocked ? row.id : `${row.id} (locked)`}
            />
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setShowAllAchievements((v) => !v)}
          aria-expanded={showAllAchievements}
          className="mt-1 ml-2.5 inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-mute transition-colors hover:text-accent"
        >
          {showAllAchievements ? (
            <>show less ▴</>
          ) : (
            <>show all · {totalCount} ▾</>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop inline rail */}
      <aside
        className="scrollbar-themed hidden overflow-y-auto border-r border-stroke px-2 py-3.5 font-mono lg:block"
        style={{ background: "var(--rail-bg)" }}
        aria-label="Workspace"
      >
        {railBody}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Workspace"
        >
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="relative ml-0 h-full w-[280px] max-w-[80vw] overflow-y-auto border-r border-stroke px-2 py-3"
            style={{ background: "var(--rail-bg)" }}
          >
            {railBody}
          </aside>
        </div>
      )}
    </>
  );
}

function RailHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "px-2.5 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-mute",
        className,
      )}
    >
      {children}
    </div>
  );
}

function OutlineRow({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex cursor-default items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-ink-soft">
      <span className="w-2.5" />
      <span className="grid w-3.5 place-items-center text-accent-2">
        <Circle size={10} aria-hidden="true" />
      </span>
      {children}
    </li>
  );
}

function AchievementRow({
  label,
  unlocked,
}: {
  label: string;
  unlocked?: boolean;
}) {
  return (
    <li
      className={clsx(
        "flex cursor-default items-center gap-2 rounded-md px-2.5 py-1.5 text-xs",
        unlocked ? "text-ink-soft" : "text-ink-soft opacity-55",
      )}
    >
      <span className="w-2.5" />
      <span
        className={clsx(
          "grid w-3.5 place-items-center",
          unlocked ? "text-gold" : "text-ink-mute",
        )}
      >
        <Award size={12} aria-hidden="true" />
      </span>
      {label}
    </li>
  );
}
