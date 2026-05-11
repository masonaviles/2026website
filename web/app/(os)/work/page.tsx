import { Chapter } from "@/components/work/Chapter";
import { WORK } from "@/lib/work";

export const metadata = {
  title: "~/work · mason.os",
  description: "Career chapters — Apple via AKQA & Level Studios, Smartsheet, Amperity, Uptime.com, federal Drupal, plus instruction roles.",
};

export default function WorkPage() {
  return (
    <section className="flex flex-col gap-6 pb-8">
      <header className="mb-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
          ~/work — 12+ years · 7 chapters
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Where I&apos;ve shipped.
        </h1>
        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-ink-soft">
          Each chapter has its own accent so the story scans. Apple-era work is
          neutral by design; Smartsheet trends green, Amperity warm, federal
          Drupal navy. Listed reverse-chronological.
        </p>
      </header>
      <div className="flex flex-col gap-5">
        {WORK.map((entry) => (
          <Chapter key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}
