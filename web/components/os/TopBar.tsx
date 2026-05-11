import { TrafficLights } from "./TrafficLights";
import { ThemeToggle } from "./ThemeToggle";
import { InspectorButton } from "./InspectorButton";
import { HamburgerButton } from "./HamburgerButton";
import { SearchButton } from "./SearchButton";
import { HelpButton } from "./HelpButton";

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
        <HelpButton />
      </div>
    </header>
  );
}
