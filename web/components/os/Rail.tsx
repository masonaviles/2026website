"use client";

import { Folder, Circle, Award } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface WorkspaceItem {
  label: string;
  href: string;
  badge?: { text: string; tone: "accent" | "accent-2" };
}

const WORKSPACE: WorkspaceItem[] = [
  { label: "~/profile", href: "/", badge: { text: "main", tone: "accent" } },
  { label: "~/work", href: "/work" },
  { label: "~/projects", href: "/projects" },
  { label: "~/blog", href: "/blog", badge: { text: "soon", tone: "accent-2" } },
  { label: "~/system", href: "/system" },
  { label: "~/playground", href: "/playground" },
  { label: "~/contact", href: "/contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Rail() {
  const pathname = usePathname() ?? "/";

  return (
    <aside
      className="scrollbar-themed overflow-y-auto border-r border-stroke px-2 py-3.5 font-mono"
      style={{ background: "var(--rail-bg)" }}
      aria-label="Workspace"
    >
      <RailHeading>Workspace</RailHeading>
      <ul className="flex flex-col gap-0.5" role="list">
        {WORKSPACE.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={clsx(
                  "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors",
                  active
                    ? "text-accent"
                    : "text-ink-soft hover:bg-panel hover:text-ink",
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

      <RailHeading className="mt-3.5">Outline</RailHeading>
      <ul className="flex flex-col gap-0.5" role="list">
        <OutlineRow>summary</OutlineRow>
        <OutlineRow>stack</OutlineRow>
        <OutlineRow>social</OutlineRow>
      </ul>

      <RailHeading className="mt-3.5">Achievements · 1/11</RailHeading>
      <ul className="flex flex-col gap-0.5" role="list">
        <AchievementRow unlocked label="hello_world" />
        <AchievementRow label="curious_cat (locked)" />
        <AchievementRow label="polyglot (locked)" />
      </ul>
    </aside>
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
