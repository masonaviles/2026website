"use client";

import { useId, useRef, useState } from "react";
import { submitContact } from "@/lib/api";
import {
  TurnstileGate,
  type TurnstileGateHandle,
  turnstileEnabled,
} from "@/components/turnstile/TurnstileGate";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({
  onSuccess,
  compact = false,
}: {
  /** Called when the server returns ok. Parent can dismiss/redirect/etc. */
  onSuccess?: () => void;
  /** Slightly tighter spacing for use inside the modal. */
  compact?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [tsToken, setTsToken] = useState<string | null>(null);
  const tsRef = useRef<TurnstileGateHandle>(null);
  const nameId = useId();
  const emailId = useId();
  const msgId = useId();

  const gated = turnstileEnabled();
  const ready = !gated || tsToken !== null;

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
      onSuccess?.();
    } else {
      setError(result.error);
      setStatus("error");
      tsRef.current?.reset();
    }
  }

  if (status === "success") {
    return (
      <div
        className="flex flex-col items-center gap-2 px-6 py-12 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="text-3xl">📬</div>
        <p className="font-semibold text-ink">Message sent.</p>
        <p className="text-sm text-ink-soft">
          I&apos;ll get back to you within a day or two.
        </p>
      </div>
    );
  }

  const gap = compact ? "gap-3" : "gap-4";
  const pad = compact ? "p-4" : "p-5";

  return (
    <form
      className={`flex flex-col ${gap} ${pad}`}
      onSubmit={onSubmit}
      noValidate
    >
      <Field
        id={nameId}
        name="name"
        label="name"
        type="text"
        required
        maxLength={120}
        autoComplete="name"
        placeholder="Your name"
      />
      <Field
        id={emailId}
        name="email"
        label="email"
        type="email"
        required
        maxLength={200}
        autoComplete="email"
        placeholder="you@example.com"
      />
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
          rows={compact ? 5 : 7}
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
  );
}

function Field({
  id,
  label,
  ...inputProps
}: {
  id: string;
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-mute"
      >
        {label}
      </label>
      <input
        id={id}
        {...inputProps}
        className="rounded-md border border-stroke bg-bg-2 px-3 py-2 text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </div>
  );
}
