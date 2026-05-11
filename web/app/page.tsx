export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-zinc-500">
          mason.os · v0.0.0 · phase 0
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Foundation is live.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-400">
          The shell, the panels, and the rest of the operating system land in
          Phase 1. For now, this is just{" "}
          <span className="font-mono text-[--color-foreground]">
            ~/profile
          </span>{" "}
          before it has anything to say.
        </p>
        <p className="mt-8 font-mono text-xs text-zinc-600">
          gitaddmason.dev · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
