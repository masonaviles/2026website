import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BugHunt } from "@/components/playground/bug-hunt/BugHunt";

export const metadata = {
  title: "Bug Hunt · mason.os",
  description:
    "Three broken React components. Drag the right hook into each slot to fix them. Live preview updates the second you get it right.",
};

export default function BugHuntPage() {
  return (
    <section className="flex flex-col gap-6 pb-8">
      <header className="flex flex-col gap-3">
        <Link
          href="/playground"
          className="inline-flex w-fit items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-mute transition-colors hover:text-accent"
        >
          <ChevronLeft size={12} aria-hidden="true" />
          ~/playground
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Bug Hunt.</h1>
        <p className="max-w-[60ch] text-sm leading-relaxed text-ink-soft">
          Three broken React components — each missing a single hook. Drag the
          right hook from the tray into the dotted slot and the live preview
          fixes itself. Decoys are real hooks, so read carefully.
        </p>
        <p className="font-mono text-[11px] text-ink-mute">
          tip — keyboard works too: tab to a hook, space to pick up, tab to a
          slot, space to drop.
        </p>
      </header>

      <BugHunt />
    </section>
  );
}
