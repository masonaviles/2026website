"use client";

import { useRef, useState } from "react";
import { ArrowUp, RotateCcw, Sparkles } from "lucide-react";
import { streamSse, type SseDone } from "@/lib/sse";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Would Mason fit a Shopify-heavy role?",
  "What's his strongest case for a staff IC role?",
  "How does he think about email engineering?",
  "Has he led teams?",
];

export function AskChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [usage, setUsage] = useState<SseDone["usage"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function ask(text: string) {
    const content = text.trim();
    if (!content || streaming) return;

    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setDraft("");
    setError(null);
    setUsage(null);
    setStreaming(true);

    abortRef.current = new AbortController();
    try {
      let assistant = "";
      for await (const event of streamSse(
        "/api/ai/chat",
        { messages: next.map((m) => ({ role: m.role, content: m.content })) },
        { signal: abortRef.current.signal },
      )) {
        if (event.type === "delta") {
          assistant += event.text;
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: "assistant", content: assistant };
            return copy;
          });
        } else if (event.type === "done") {
          setUsage(event.usage);
        } else if (event.type === "error") {
          setError(event.detail);
        }
      }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        setError(err instanceof Error ? err.message : "stream failed");
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
      inputRef.current?.focus();
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setDraft("");
    setError(null);
    setUsage(null);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    ask(draft);
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex min-h-[280px] flex-col gap-3 rounded-2xl border border-stroke bg-panel p-5"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <EmptyState onPick={(s) => ask(s)} />
        ) : (
          messages.map((m, i) => <Bubble key={i} role={m.role} content={m.content} />)
        )}
        {streaming && (
          <div className="flex items-center gap-2 font-mono text-[11px] text-ink-mute">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
              style={{ animation: "pulse 2s infinite", boxShadow: "var(--pulse-shadow)" }}
            />
            streaming…
          </div>
        )}
        {error && (
          <p className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 font-mono text-xs text-danger">
            {error}
          </p>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                ask(draft);
              }
            }}
            placeholder="Ask anything about Mason — fit, experience, opinions on email engineering, you name it."
            rows={3}
            maxLength={4000}
            disabled={streaming}
            className="w-full resize-y rounded-xl border border-stroke bg-bg-2 px-3 py-3 pr-12 text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            disabled={!draft.trim() || streaming}
            className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-lg bg-accent text-[var(--btn-primary-ink)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send"
            title="Send (enter)"
          >
            <ArrowUp size={14} aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-ink-mute">
          <span>
            <kbd className="rounded border border-stroke bg-panel-2 px-1.5 py-px">enter</kbd>{" "}
            send · <kbd className="rounded border border-stroke bg-panel-2 px-1.5 py-px">shift+enter</kbd> newline
          </span>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md border border-stroke bg-panel px-2 py-1 text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              <RotateCcw size={11} aria-hidden="true" />
              reset
            </button>
          )}
        </div>
      </form>

      {usage && <UsagePanel usage={usage} />}
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <div className="flex flex-col gap-3 py-8 text-center">
      <Sparkles size={20} className="mx-auto text-accent" aria-hidden="true" />
      <p className="text-sm text-ink-soft">
        Ask me anything about Mason. Grounded on his actual career — no hallucinations about jobs he didn&apos;t have.
      </p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="rounded-md border border-stroke bg-bg-2 px-2.5 py-1 font-mono text-[11px] text-ink-soft transition-colors hover:border-accent hover:text-accent"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function Bubble({ role, content }: { role: Msg["role"]; content: string }) {
  const isUser = role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isUser
            ? "max-w-[80%] rounded-2xl bg-accent px-4 py-2.5 text-sm leading-relaxed"
            : "max-w-[85%] rounded-2xl border border-stroke bg-bg-2 px-4 py-2.5 text-sm leading-relaxed text-ink-soft"
        }
        style={isUser ? { color: "var(--btn-primary-ink)" } : undefined}
      >
        {content || (
          <span className="font-mono text-[11px] text-ink-mute">thinking…</span>
        )}
      </div>
    </div>
  );
}

function UsagePanel({ usage }: { usage: SseDone["usage"] }) {
  const hit = usage.cache_read_input_tokens > 0;
  return (
    <details className="rounded-xl border border-stroke bg-panel p-4 text-[11px] text-ink-mute">
      <summary className="cursor-pointer font-mono uppercase tracking-[0.08em]">
        usage · {hit ? "🟢 cache hit" : "⚪ cold"}
      </summary>
      <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[11px] sm:grid-cols-4">
        <Stat label="input" value={usage.input_tokens} />
        <Stat label="output" value={usage.output_tokens} />
        <Stat label="cache write" value={usage.cache_creation_input_tokens} />
        <Stat label="cache read" value={usage.cache_read_input_tokens} accent={hit} />
      </div>
    </details>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-md border border-stroke bg-bg-2 px-2 py-1.5">
      <span className="text-ink-mute">{label}</span>
      <span className={accent ? "text-accent" : "text-ink"}>{value}</span>
    </div>
  );
}
