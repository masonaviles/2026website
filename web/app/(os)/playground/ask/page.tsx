import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AskChat } from "@/components/playground/AskChat";

export const metadata = {
  title: "Ask about Mason · mason.os",
  description:
    "Streaming chat grounded on Mason's résumé. Powered by Claude Sonnet 4.6 via a FastAPI proxy with prompt caching.",
};

export default function AskPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Ask about Mason.</h1>
        <p className="max-w-[60ch] text-sm leading-relaxed text-ink-soft">
          Streaming chat backed by Claude Sonnet 4.6. The system prompt is the
          résumé + voice/tone guidance, cached so each follow-up is faster and
          cheaper. Rate-limited at 10 messages/hour per IP.
        </p>
      </header>

      <AskChat />

      <details className="rounded-2xl border border-stroke bg-panel p-5 text-sm text-ink-soft">
        <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
          construction · how this works
        </summary>
        <div className="mt-3 flex flex-col gap-2 leading-relaxed">
          <p>
            The browser POSTs to <code className="font-mono text-accent-2">/api/ai/chat</code> on
            the FastAPI service, which streams Server-Sent Events back. The Anthropic key
            never reaches the browser.
          </p>
          <p>
            The system prompt has two blocks: a tiny preamble and a curated knowledge file built
            from the résumé. The knowledge block is marked{" "}
            <code className="font-mono text-accent-2">cache_control: ephemeral</code> — the first
            request warms the cache, subsequent requests report{" "}
            <code className="font-mono text-accent-2">cache_read_input_tokens &gt; 0</code> and bill
            for ~1/10 the prefix cost.
          </p>
        </div>
      </details>
    </section>
  );
}
