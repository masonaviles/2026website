import { Section } from "@/components/design-system/Section";
import { ColorPalette } from "@/components/design-system/ColorPalette";
import { Typography } from "@/components/design-system/Typography";
import { Buttons } from "@/components/design-system/Buttons";
import { Chips } from "@/components/design-system/Chips";
import { Motion } from "@/components/design-system/Motion";
import { Tagline } from "@/components/hero/Tagline";
import { JsonBio } from "@/components/hero/JsonBio";
import { AchievementsPanel } from "@/components/achievements/AchievementsPanel";
import { IconLinks } from "@/components/hero/IconLinks";

export const metadata = {
  title: "~/system · mason.os",
  description:
    "Live design system — the same primitives, tokens, and motion the production site uses. Not a Storybook clone — these are the real imports.",
};

export default function SystemPage() {
  return (
    <article className="flex flex-col gap-6 pb-8">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
          ~/system — live
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Design system, in production.
        </h1>
        <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-ink-soft">
          Every primitive on this page is imported from the same module that
          renders the rest of the site. If a chip looks different here than on
          the home hero, the system is broken — that&apos;s the contract.
          Switch the theme in the topbar to see light/dark tokens swap.
        </p>
      </header>

      <Section
        id="color"
        title="01 · Color tokens"
        description="Every surface, ink, and accent on the site flows through these CSS variables. Switch theme to see them reflow."
      >
        <ColorPalette />
      </Section>

      <Section
        id="type"
        title="02 · Typography"
        description="Inter for body, JetBrains Mono for code + UI captions. Display headlines use Inter at variable weight with tight tracking."
      >
        <Typography />
      </Section>

      <Section
        id="buttons"
        title="03 · Buttons"
        description="Primary (accent fill), ghost (panel + stroke), disabled, and icon-only. All meet keyboard + focus contracts."
      >
        <Buttons />
      </Section>

      <Section id="chips" title="04 · Chips · badges · kbd">
        <Chips />
      </Section>

      <Section
        id="motion"
        title="05 · Motion primitives"
        description="All motion respects prefers-reduced-motion globally. Hover/focus transitions stay under 200ms."
      >
        <Motion />
      </Section>

      <Section
        id="icon-row"
        title="06 · Icon links"
        description="Profile-link primitive — same component used in the hero panel."
      >
        <IconLinks />
      </Section>

      <Section
        id="tagline"
        title="07 · Tagline parser"
        description="Inline tokens: **bold** renders as ink emphasis, *mono* renders as accent code chip. Same component as the hero."
      >
        <Tagline source="Senior full-stack — *React*, *TypeScript*, *Next.js* up front and *Python* / *FastAPI* behind. I've shipped at **Apple**, **Smartsheet**, and **Amperity**." />
      </Section>

      <Section
        id="terminal"
        title="08 · Terminal · code blocks"
        description="The whoami terminal from the hero. Syntax tokens (key, str, num, comment) all switch with theme."
      >
        <div className="max-w-[520px]">
          <JsonBio />
        </div>
      </Section>

      <Section
        id="achievements"
        title="09 · Achievements card"
        description="The gamification preview from the hero — live cell grid + progress. Wired in Phase 5."
      >
        <div className="max-w-[420px]">
          <AchievementsPanel />
        </div>
      </Section>
    </article>
  );
}
