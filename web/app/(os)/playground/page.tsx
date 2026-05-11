import Link from "next/link";
import { ArrowUpRight, FileText, MessageSquare } from "lucide-react";

export const metadata = {
  title: "~/playground · mason.os",
  description:
    "Live AI demos backed by FastAPI streaming Claude. Ask about Mason, or generate a tailored cover letter from a job description.",
};

const DEMOS = [
  {
    href: "/playground/ask",
    title: "Ask about Mason",
    description:
      "Streaming chat grounded on the resume. Ask 'would Mason fit a Shopify-heavy role?' and get a real answer.",
    model: "claude-sonnet-4-6",
    icon: MessageSquare,
  },
  {
    href: "/playground/cover-letter",
    title: "Cover letter generator",
    description:
      "Paste a job description. Get a tailored cover letter streamed in Mason's voice — body only, drop into your own template.",
    model: "claude-opus-4-7",
    icon: FileText,
  },
];

export default function PlaygroundIndex() {
  return (
    <section className="flex flex-col gap-6 pb-8">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
          ~/playground — 2 live demos
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Real Claude, real streaming.
        </h1>
        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-ink-soft">
          Both demos hit the Anthropic API through a FastAPI proxy with prompt
          caching. The cached prefix is a curated knowledge file built from the
          résumé — second-and-onward requests show cache-read tokens. Rate
          limited per IP.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
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
              <div className="mt-auto flex items-center gap-2 font-mono text-[10px] text-ink-mute">
                <span className="rounded-md border border-stroke px-1.5 py-px">
                  model · {d.model}
                </span>
                <span className="rounded-md border border-stroke px-1.5 py-px">SSE</span>
                <span className="rounded-md border border-stroke px-1.5 py-px">cached prefix</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
