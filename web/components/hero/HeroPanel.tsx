import clsx from "clsx";
import { profile } from "@/lib/profile";
import { AchievementsPanel } from "@/components/achievements/AchievementsPanel";
import { Tagline } from "./Tagline";
import { JsonBio } from "./JsonBio";
import { IconLinks } from "./IconLinks";
import { HeroCtas } from "./HeroCtas";

export function HeroPanel() {
  return (
    <section className="grid grid-cols-1 items-start gap-6 pb-7 pt-1 sm:gap-7 sm:pt-2 min-[1101px]:grid-cols-[1.4fr_1fr]">
      {/* Left column */}
      <div>
        <Eyebrow text={profile.statusChip} />
        <h1 className="my-3 text-[clamp(30px,5.2vw,60px)] font-extrabold leading-[1.05] tracking-tight">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(110deg, var(--ink) 0%, var(--accent) 50%, var(--accent-2) 100%)",
            }}
          >
            {profile.headline.line1}
            <br />
            {profile.headline.line2}
          </span>
          <Cursor />
        </h1>
        <Tagline source={profile.tagline} />

        <div className="my-6 grid max-w-[580px] grid-cols-1 gap-2 min-[701px]:grid-cols-2">
          {profile.meta.map((row) => (
            <div
              key={row.key}
              className="flex items-center gap-2.5 rounded-lg border border-stroke bg-panel px-3 py-2 font-mono text-xs text-ink-soft"
            >
              <span className="min-w-[80px] text-ink-mute">{row.key}</span>
              <span className={clsx(row.ok ? "text-accent" : "text-ink")}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mb-5">
          <HeroCtas />
        </div>

        <IconLinks />
      </div>

      {/* Right column — stacks below the hero on mobile (single column),
          sits side-by-side at ≥1101px. */}
      <div>
        <JsonBio />
        <div className="mt-3.5">
          <AchievementsPanel allowReset />
        </div>
      </div>
    </section>
  );
}

function Eyebrow({ text }: { text: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-[11px] text-accent"
      style={{
        background: "var(--eyebrow-bg)",
        borderColor: "var(--eyebrow-stroke)",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-accent"
        style={{
          boxShadow: "var(--pulse-shadow)",
          animation: "pulse 2s infinite",
        }}
        aria-hidden="true"
      />
      {text}
    </span>
  );
}

function Cursor() {
  return (
    <span
      aria-hidden="true"
      className="ml-1 inline-block h-[0.9em] w-[0.5ch] translate-y-[8px] bg-accent"
      style={{ animation: "blink 1.05s steps(1) infinite" }}
    />
  );
}
