"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { submitContact } from "@/lib/api";
import {
  TurnstileGate,
  type TurnstileGateHandle,
  turnstileEnabled,
} from "@/components/turnstile/TurnstileGate";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [tsToken, setTsToken] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const tsRef = useRef<TurnstileGateHandle>(null);
  const nameId = useId();
  const emailId = useId();
  const msgId = useId();

  const gated = turnstileEnabled();
  const ready = !gated || tsToken !== null;

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open && status === "success") {
      const t = setTimeout(() => {
        onClose();
        setStatus("idle");
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [open, status, onClose]);

  if (!open) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ready) return;
    setError(null);
    setStatus("submitting");
    const fd = new FormData(e.currentTarget);
    const result = await submitContact({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
      turnstileToken: tsToken,
    });
    if (result.ok) {
      setStatus("success");
    } else {
      setError(result.error);
      setStatus("error");
      tsRef.current?.reset();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        className="w-[min(520px,100%)] overflow-hidden rounded-xl border border-stroke bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]"
      >
        <header className="flex items-center justify-between border-b border-stroke px-4 py-3">
          <h2
            id="contact-title"
            className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft"
          >
            ~/contact — new message
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-7 w-7 place-items-center rounded-md text-ink-mute transition-colors hover:bg-panel-2 hover:text-ink"
          >
            <X size={16} />
          </button>
        </header>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
            <div className="text-3xl">📬</div>
            <p className="font-semibold text-ink">Message sent.</p>
            <p className="text-sm text-ink-soft">
              I&apos;ll get back to you within a day or two.
            </p>
          </div>
        ) : (
          <form className="flex flex-col gap-3 p-4" onSubmit={onSubmit} noValidate>
            <div className="flex flex-col gap-1">
              <label
                htmlFor={nameId}
                className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute"
              >
                name
              </label>
              <input
                id={nameId}
                name="name"
                type="text"
                required
                maxLength={120}
                autoComplete="name"
                className="rounded-md border border-stroke bg-bg-2 px-3 py-2 text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Your name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor={emailId}
                className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute"
              >
                email
              </label>
              <input
                id={emailId}
                name="email"
                type="email"
                required
                maxLength={200}
                autoComplete="email"
                className="rounded-md border border-stroke bg-bg-2 px-3 py-2 text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor={msgId}
                className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute"
              >
                message
              </label>
              <textarea
                id={msgId}
                name="message"
                required
                maxLength={5000}
                rows={5}
                className="resize-y rounded-md border border-stroke bg-bg-2 px-3 py-2 text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="What's the project, role, or question?"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 font-mono text-xs text-danger"
              >
                {error}
              </p>
            )}

            <TurnstileGate ref={tsRef} onToken={setTsToken} />

            <button
              type="submit"
              disabled={status === "submitting" || !ready}
              title={!ready ? "verifying you're human…" : undefined}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 font-mono text-sm font-medium transition-transform hover:-translate-y-0.5 disabled:cursor-progress disabled:opacity-60"
              style={{
                color: "var(--btn-primary-ink)",
                boxShadow: "var(--btn-primary-shadow)",
              }}
            >
              {status === "submitting"
                ? "sending…"
                : !ready
                  ? "verifying…"
                  : "send message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
