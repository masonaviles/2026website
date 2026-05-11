import clsx from "clsx";

type Lang = "tsx" | "md" | "py" | "css";

interface Tab {
  name: string;
  lang: Lang;
  active?: boolean;
}

const TABS: Tab[] = [
  { name: "profile.tsx", lang: "tsx", active: true },
  { name: "work.tsx", lang: "tsx" },
  { name: "blog/index.mdx", lang: "md" },
  { name: "api/main.py", lang: "py" },
  { name: "system/tokens.css", lang: "css" },
];

const dotColor: Record<Lang, string> = {
  tsx: "bg-accent-2",
  md: "bg-[#a472ff] dark:bg-[#a472ff]",
  py: "bg-warn",
  css: "bg-danger",
};

export function Tabs() {
  return (
    <nav
      className="scrollbar-themed flex items-stretch overflow-x-auto border-b border-stroke"
      style={{ background: "var(--tabs-bg)" }}
      aria-label="Open files"
    >
      {TABS.map((tab) => (
        <div
          key={tab.name}
          className={clsx(
            "relative flex flex-shrink-0 cursor-pointer items-center gap-2 border-r border-stroke px-3.5 py-2 font-mono text-xs transition-colors",
            tab.active
              ? "bg-panel text-ink"
              : "text-ink-mute hover:bg-panel hover:text-ink-soft",
          )}
        >
          {tab.active && (
            <span className="absolute inset-x-0 -top-px h-px bg-accent" />
          )}
          <span
            className={clsx("h-2 w-2 rounded-sm", dotColor[tab.lang])}
            aria-hidden="true"
          />
          {tab.name}
        </div>
      ))}
    </nav>
  );
}
