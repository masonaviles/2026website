import Link from "next/link";
import { ArrowUpRight, Bug, FileText, MessageSquare } from "lucide-react";

export const metadata = {
  title: "~/playground · mason.os",
  description:
    "Live AI demos backed by FastAPI streaming Claude, plus a React Bug Hunt mini-game.",
};

const DEMOS = [
  {
    href: "/playground/ask",
    title: "Ask about Mason",
    description:
      "Streaming chat grounded on the resume. Ask 'would Mason fit a Shopify-heavy role?' and get a real answer.",
    badges: ["claude-sonnet-4-6", "SSE", "cached prefix"],
    icon: MessageSquare,
  },
  {
    href: "/playground/cover-letter",
    title: "Cover letter generator",
    description:
      "Paste a job description. Get a tailored cover letter streamed in Mason's voice — body only, drop into your own template.",
    badges: ["claude-opus-4-7", "SSE", "cached prefix"],
    icon: FileText,
  },
  {
    href: "/playground/bug-hunt",
    title: "Bug Hunt",
    description:
      "Three broken React components, each missing one hook. Drag the right one into the slot — the live preview fixes itself.",
    badges: ["interactive", "drag & drop", "2 achievements"],
    icon: Bug,
  },
];

export default function PlaygroundIndex() {
  return (
    <section className="flex flex-col gap-6 pb-8">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
          ~/playground — {DEMOS.length} demos
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Real Claude, real React.
        </h1>
        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-ink-soft">
          Two demos hit the Anthropic API through a FastAPI proxy with prompt
          caching. One mini-game fixes broken React components live. All three
          are real working code — no hand-waving.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {DEMOS.map((d) => {
          const Icon = d.icon;
          return (
            <Link
              key={d.href}
              href={d.href}
              className="group flex flex-col gap-3 rounded-2xl border border-stroke bg-panel p-5 transition-all hover:-translate-y-0.5 hover:border-accent"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="grid h-9 w-9 place-items-center rounded-lg border border-stroke text-accent"
                  style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
                >
                  <Icon size={16} aria-hidden="true" />
                </div>
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="text-ink-mute transition-colors group-hover:text-accent"
                />
              </div>
              <h2 className="text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-accent">
                {d.title}
              </h2>
              <p className="text-sm leading-relaxed text-ink-soft">{d.description}</p>
              <div className="mt-auto flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-ink-mute">
                {d.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-md border border-stroke px-1.5 py-px"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
