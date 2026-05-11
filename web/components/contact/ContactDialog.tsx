"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { ContactForm } from "./ContactForm";

export function ContactDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [autoCloseScheduled, setAutoCloseScheduled] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!autoCloseScheduled) return;
    const t = window.setTimeout(() => {
      onClose();
      setAutoCloseScheduled(false);
    }, 1800);
    return () => window.clearTimeout(t);
  }, [autoCloseScheduled, onClose]);

  if (!open) return null;

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

        <ContactForm
          compact
          onSuccess={() => setAutoCloseScheduled(true)}
        />
      </div>
    </div>
  );
}
