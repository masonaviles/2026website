import { ProjectCard } from "@/components/projects/ProjectCard";
import { PROJECTS } from "@/lib/projects";

export const metadata = {
  title: "~/projects · mason.os",
  description:
    "Selected shipped work: marketing platforms, internal tooling, design systems, email engineering, multilingual sites at scale.",
};

export default function ProjectsPage() {
  return (
    <section className="flex flex-col gap-6 pb-8">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
          ~/projects — {PROJECTS.length} entries
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Things I&apos;ve shipped.</h1>
        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-ink-soft">
          Real projects pulled from the work history — marketing platforms, internal tooling, design systems, email infra. Each one was real production code with real users.
        </p>
      </header>

      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(360px,1fr))]">
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}
