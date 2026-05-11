import { Search, Settings } from "lucide-react";
import { TrafficLights } from "./TrafficLights";
import { ThemeToggle } from "./ThemeToggle";
import { InspectorButton } from "./InspectorButton";

export function TopBar() {
  return (
    <header
      className="flex items-center gap-3.5 border-b border-stroke px-3.5"
      style={{ background: "var(--topbar-grad)" }}
    >
      <TrafficLights />
      <div className="font-mono text-xs text-ink-mute">
        <b className="font-semibold text-ink-soft">mason.os</b> ·
        gitaddmason.dev — main
      </div>
      <div className="ml-auto flex gap-1">
        <ThemeToggle />
        <TopBarIcon label="Search">
          <Search size={14} aria-hidden="true" />
        </TopBarIcon>
        <InspectorButton />
        <TopBarIcon label="Settings">
          <Settings size={14} aria-hidden="true" />
        </TopBarIcon>
      </div>
    </header>
  );
}

function TopBarIcon({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="inline-grid h-[22px] w-[26px] place-items-center rounded-md text-ink-mute transition-colors hover:bg-panel-2 hover:text-ink"
    >
      {children}
    </button>
  );
}
