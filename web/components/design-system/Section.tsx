import clsx from "clsx";

export function Section({
  id,
  title,
  description,
  children,
  className,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={clsx("scroll-mt-4", className)}>
      <header className="mb-3 flex flex-col gap-1">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
          {title}
        </h2>
        {description && (
          <p className="text-sm leading-relaxed text-ink-soft" style={{ maxWidth: "70ch" }}>
            {description}
          </p>
        )}
      </header>
      <div className="rounded-2xl border border-stroke bg-panel p-5">{children}</div>
    </section>
  );
}
