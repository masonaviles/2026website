const TOKENS = [
  { name: "--bg", role: "page background" },
  { name: "--bg-2", role: "window surface" },
  { name: "--panel", role: "card surface" },
  { name: "--panel-2", role: "hover / pressed surface" },
  { name: "--ink", role: "primary text" },
  { name: "--ink-soft", role: "secondary text" },
  { name: "--ink-mute", role: "meta / placeholder" },
  { name: "--stroke", role: "panel borders" },
  { name: "--accent", role: "primary accent" },
  { name: "--accent-2", role: "secondary accent" },
  { name: "--warn", role: "warning / amber" },
  { name: "--danger", role: "danger / red" },
  { name: "--gold", role: "gold / strings in code" },
];

export function ColorPalette() {
  return (
    <div className="grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
      {TOKENS.map((t) => (
        <div
          key={t.name}
          className="flex items-center gap-3 rounded-lg border border-stroke bg-bg-2 p-3"
        >
          <div
            className="h-10 w-10 flex-shrink-0 rounded-md border border-stroke"
            style={{ background: `var(${t.name})` }}
            aria-hidden="true"
          />
          <div className="min-w-0 font-mono text-[11px] leading-tight">
            <div className="text-ink">{t.name}</div>
            <div className="text-ink-mute">{t.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
