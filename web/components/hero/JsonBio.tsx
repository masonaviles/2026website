import { profile } from "@/lib/profile";

export function JsonBio() {
  const bio = profile.jsonBio;
  return (
    <div
      className="overflow-hidden rounded-[10px] border border-stroke shadow-[0_20px_60px_-22px_rgba(0,0,0,0.45)]"
      style={{ background: "var(--term-bg)" }}
      aria-label="whoami"
    >
      <div
        className="flex items-center gap-2 border-b border-stroke px-3 py-2 font-mono text-[11px] text-ink-mute"
        style={{ background: "var(--term-head-bg)" }}
      >
        <span
          className="h-2 w-2 rounded-full bg-accent"
          style={{ boxShadow: "var(--pulse-shadow)" }}
        />
        ~/profile.json — terminal
      </div>
      <pre className="m-0 px-4 py-4 font-mono text-[12.5px] leading-[1.7] text-ink-soft">
        <span className="text-ink-mute">$ </span>
        <span className="text-accent">whoami</span>
        {"\n"}
        <span className="text-ink">{"{"}</span>
        {"\n  "}
        <Key>name</Key>: <Str>&quot;{bio.name}&quot;</Str>,
        {"\n  "}
        <Key>role</Key>: <Str>&quot;{bio.role}&quot;</Str>,
        {"\n  "}
        <Key>yrs</Key>: <Num>{bio.yrs}</Num>,
        {"\n  "}
        <Key>shipped_at</Key>:{" "}
        <span className="text-ink">[</span>
        {bio.shippedAt.map((s, i) => (
          <span key={s}>
            <Str>&quot;{s}&quot;</Str>
            {i < bio.shippedAt.length - 1 ? ", " : ""}
          </span>
        ))}
        <span className="text-ink">]</span>,
        {"\n  "}
        <Key>superpowers</Key>:{" "}
        <span className="text-ink">[</span>
        {"\n    "}
        {bio.superpowers.map((s, i) => (
          <span key={s}>
            <Str>&quot;{s}&quot;</Str>
            {i < bio.superpowers.length - 1 ? ",\n    " : ""}
          </span>
        ))}
        {"\n  "}
        <span className="text-ink">]</span>,
        {"\n  "}
        <Com>{"// open to senior & staff roles"}</Com>
        {"\n  "}
        <Key>available</Key>: <Num>{String(bio.available)}</Num>
        {"\n"}
        <span className="text-ink">{"}"}</span>
      </pre>
    </div>
  );
}

const Key = ({ children }: { children: React.ReactNode }) => (
  <span className="text-accent-2">&quot;{children}&quot;</span>
);
const Str = ({ children }: { children: React.ReactNode }) => (
  <span className="text-gold">{children}</span>
);
const Num = ({ children }: { children: React.ReactNode }) => (
  <span className="text-warn">{children}</span>
);
const Com = ({ children }: { children: React.ReactNode }) => (
  <span className="text-ink-mute">{children}</span>
);
