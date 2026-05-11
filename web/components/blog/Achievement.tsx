import { Award } from "lucide-react";

/**
 * Inline achievement reference. Phase 5 will wire `id` to the live
 * achievement system; for now it's a decorative chip that flags the
 * gamification surface inside long-form content.
 */
export function Achievement({ id }: { id: string }) {
  return (
    <span
      className="not-prose my-3 inline-flex items-center gap-2 rounded-md border px-2.5 py-1 font-mono text-[11px]"
      style={{
        background: "color-mix(in srgb, var(--gold) 12%, transparent)",
        borderColor: "color-mix(in srgb, var(--gold) 28%, transparent)",
        color: "var(--gold)",
      }}
      title={`Achievement: ${id}`}
    >
      <Award size={12} aria-hidden="true" />
      achievement · <code className="text-gold">{id}</code>
    </span>
  );
}
