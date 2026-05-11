import { Settings } from "lucide-react";
import { TrafficLights } from "./TrafficLights";
import { ThemeToggle } from "./ThemeToggle";
import { InspectorButton } from "./InspectorButton";
import { HamburgerButton } from "./HamburgerButton";
import { SearchButton } from "./SearchButton";

export function TopBar() {
  return (
    <header
      className="flex items-center gap-2 border-b border-stroke px-2 sm:px-3.5"
      style={{ background: "var(--topbar-grad)" }}
    >
      <HamburgerButton />
      <span className="hidden sm:flex">
        <TrafficLights />
      </span>
      <div className="min-w-0 truncate font-mono text-[11px] sm:text-xs text-ink-mute">
        <b className="font-semibold text-ink-soft">mason.os</b>
        <span className="hidden sm:inline"> · gitaddmason.dev — main</span>
      </div>
      <div className="ml-auto flex gap-1">
        <ThemeToggle />
        <SearchButton />
        <InspectorButton />
        <span className="hidden sm:flex">
          <TopBarIcon label="Settings">
            <Settings size={14} aria-hidden="true" />
          </TopBarIcon>
        </span>
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
