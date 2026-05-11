import { Fragment } from "react";

/**
 * Tagline renderer with inline tokens.
 * **text** -> bold ink emphasis
 * *text*   -> mono accent chip (the syntax-highlighted bits)
 */
export function Tagline({ source }: { source: string }) {
  return (
    <p className="text-base leading-relaxed text-ink-soft" style={{ maxWidth: "60ch" }}>
      {renderTokens(source)}
    </p>
  );
}

function renderTokens(text: string): React.ReactNode {
  // Split on **bold** and *mono* tokens. Bold takes precedence (uses double asterisks).
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em
          key={i}
          className="rounded-sm px-0.5 font-mono text-[14px] not-italic text-accent"
          style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)" }}
        >
          {part.slice(1, -1)}
        </em>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
