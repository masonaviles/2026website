"use client";

import { useState } from "react";
import { ArrowRight, Download, Mail } from "lucide-react";
import { profile } from "@/lib/profile";
import { ContactDialog } from "@/components/contact/ContactDialog";
import { emit } from "@/lib/achievements/events";

export function HeroCtas() {
  const [open, setOpen] = useState(false);

  function openContact() {
    emit({ type: "cta:contact" });
    setOpen(true);
  }

  return (
    <>
      <div className="flex flex-wrap gap-2.5">
        <a
          href={profile.resumeUrl}
          download
          onClick={() => emit({ type: "cta:resume" })}
          className="inline-flex items-center gap-2.5 rounded-lg bg-accent px-4 py-2.5 font-mono text-[13px] font-medium transition-transform hover:-translate-y-0.5"
          style={{
            color: "var(--btn-primary-ink)",
            boxShadow: "var(--btn-primary-shadow)",
          }}
        >
          <Download size={14} aria-hidden="true" />
          ./resume.pdf
        </a>
        <button
          type="button"
          data-cta="contact"
          onClick={openContact}
          className="group inline-flex items-center gap-2.5 rounded-lg border border-stroke bg-panel px-4 py-2.5 font-mono text-[13px] font-medium text-ink transition-colors hover:bg-panel-2 hover:border-ink-mute"
        >
          <Mail size={14} aria-hidden="true" />
          Contact
          <ArrowRight
            size={14}
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>
      <ContactDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
