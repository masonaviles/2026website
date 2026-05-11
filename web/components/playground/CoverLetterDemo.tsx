"use client";

import { useRef, useState } from "react";
import { Copy, FileText, RotateCcw } from "lucide-react";
import { streamSse, type SseDone } from "@/lib/sse";

export function CoverLetterDemo() {
  const [jd, setJd] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [output, setOutput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [usage, setUsage] = useState<SseDone["usage"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function generate() {
    if (!jd.trim() || streaming) return;
    setOutput("");
    setError(null);
    setUsage(null);
    setStreaming(true);
    abortRef.current = new AbortController();

    try {
      let acc = "";
      for await (const event of streamSse(
        "/api/ai/cover-letter",
        {
          job_description: jd.trim(),
          company_name: company.trim() || null,
          role_title: role.trim() || null,
        },
        { signal: abortRef.current.signal },
      )) {
        if (event.type === "delta") {
          acc += event.text;
          setOutput(acc);
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
    }
  }

  function reset() {
    abortRef.current?.abort();
    setOutput("");
    setError(null);
    setUsage(null);
  }

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore — clipboard may be blocked in some contexts
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Left: input */}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <Field label="company" value={company} onChange={setCompany} placeholder="optional" />
          <Field label="role" value={role} onChange={setRole} placeholder="optional" />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="jd"
            className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute"
          >
            job description
          </label>
          <textarea
            id="jd"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={14}
            maxLength={12000}
            disabled={streaming}
            placeholder="Paste the JD here. The model uses it to ground specifics in Mason's actual experience."
            className="resize-y rounded-xl border border-stroke bg-bg-2 px-3 py-3 text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={generate}
            disabled={!jd.trim() || streaming}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-mono text-[13px] font-medium transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              color: "var(--btn-primary-ink)",
              boxShadow: "var(--btn-primary-shadow)",
            }}
          >
            <FileText size={14} aria-hidden="true" />
            {streaming ? "writing…" : "generate cover letter"}
          </button>
          {(output || streaming) && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md border border-stroke bg-panel px-2.5 py-1.5 font-mono text-[11px] text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              <RotateCcw size={11} aria-hidden="true" /> reset
            </button>
          )}
        </div>
      </div>

      {/* Right: output */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute">
            output
          </span>
          {output && (
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-md border border-stroke bg-panel px-2 py-1 font-mono text-[11px] text-ink-soft transition-colors hover:border-accent hover:text-accent"
            >
              <Copy size={11} aria-hidden="true" /> {copied ? "copied" : "copy"}
            </button>
          )}
        </div>
        <div
          className="min-h-[360px] whitespace-pre-wrap rounded-xl border border-stroke bg-panel p-4 text-sm leading-relaxed text-ink-soft"
          aria-live="polite"
        >
          {output || (
            <span className="text-ink-mute">
              The letter will stream in here. Body only — no salutation or signoff,
              so you can drop it into your own template.
            </span>
          )}
          {streaming && (
            <span
              aria-hidden="true"
              className="ml-0.5 inline-block h-3 w-1 translate-y-0.5 bg-accent"
              style={{ animation: "blink 1.05s steps(1) infinite" }}
            />
          )}
        </div>
        {error && (
          <p className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 font-mono text-xs text-danger">
            {error}
          </p>
        )}
        {usage && (
          <div className="font-mono text-[11px] text-ink-mute">
            {usage.cache_read_input_tokens > 0 ? "🟢" : "⚪"} usage · in{" "}
            {usage.input_tokens} · out {usage.output_tokens} · cache-read{" "}
            <span className={usage.cache_read_input_tokens > 0 ? "text-accent" : ""}>
              {usage.cache_read_input_tokens}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={label}
        className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute"
      >
        {label}
      </label>
      <input
        id={label}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-md border border-stroke bg-bg-2 px-3 py-2 text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </div>
  );
}
