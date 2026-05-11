import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CoverLetterDemo } from "@/components/playground/CoverLetterDemo";

export const metadata = {
  title: "Cover letter generator · mason.os",
  description:
    "Paste a job description. Get a tailored cover letter streamed in Mason's voice. Powered by Claude Opus 4.7 via a FastAPI proxy.",
};

export default function CoverLetterPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">
          Cover letter generator.
        </h1>
        <p className="max-w-[60ch] text-sm leading-relaxed text-ink-soft">
          Paste a JD. The model writes a letter body in Mason&apos;s voice,
          grounded in the résumé. Body only — no salutation or signoff, so you
          can drop it into your own template. Powered by Claude Opus 4.7.
          Rate-limited at 3 requests/hour per IP.
        </p>
      </header>

      <CoverLetterDemo />
    </section>
  );
}
