"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type Lang = "tsx" | "md" | "py" | "css";

interface Tab {
  name: string;
  lang: Lang;
  href: string;
}

const TABS: Tab[] = [
  { name: "profile.tsx", lang: "tsx", href: "/" },
  { name: "work.tsx", lang: "tsx", href: "/work" },
  { name: "blog/index.mdx", lang: "md", href: "/blog" },
  { name: "playground/api.py", lang: "py", href: "/playground" },
  { name: "system/tokens.css", lang: "css", href: "/system" },
];

const dotColor: Record<Lang, string> = {
  tsx: "bg-accent-2",
  md: "bg-[#a472ff] dark:bg-[#a472ff]",
  py: "bg-warn",
  css: "bg-danger",
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Tabs() {
  const pathname = usePathname() ?? "/";
  return (
    <nav
      className="scrollbar-themed flex items-stretch overflow-x-auto border-b border-stroke"
      style={{ background: "var(--tabs-bg)" }}
      aria-label="Open files"
    >
      {TABS.map((tab) => {
        const active = isActive(pathname, tab.href);
        return (
          <Link
            key={tab.name}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "relative flex flex-shrink-0 items-center gap-2 border-r border-stroke px-3.5 py-2 font-mono text-xs transition-colors",
              active
                ? "bg-panel text-ink"
                : "text-ink-mute hover:bg-panel hover:text-ink-soft",
            )}
          >
            {active && (
              <span className="absolute inset-x-0 -top-px h-px bg-accent" />
            )}
            <span
              className={clsx("h-2 w-2 rounded-sm", dotColor[tab.lang])}
              aria-hidden="true"
            />
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}
