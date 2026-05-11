import clsx from "clsx";

const CELLS = [
  { id: "hello_world", unlocked: true, mark: "★" },
  { id: "curious_cat", unlocked: false, mark: "·" },
  { id: "polyglot", unlocked: false, mark: "·" },
  { id: "speed_reader", unlocked: false, mark: "·" },
  { id: "power_user", unlocked: false, mark: "·" },
  { id: "architect", unlocked: false, mark: "·" },
  { id: "mailman", unlocked: false, mark: "·" },
  { id: "whisperer", unlocked: false, mark: "·" },
  { id: "recruiter", unlocked: false, mark: "·" },
  { id: "egg_hunter", unlocked: false, mark: "·" },
  { id: "completionist", unlocked: false, mark: "?" },
];

const unlockedCount = CELLS.filter((c) => c.unlocked).length;
const percent = Math.round((unlockedCount / CELLS.length) * 100);

export function AchievementsCard() {
  return (
    <div
      className="mt-3.5 rounded-[10px] border border-stroke bg-panel px-3.5 py-3"
      aria-label="Achievement progress"
    >
      <div className="mb-2.5 flex items-center justify-between font-mono text-[11px] text-ink-mute">
        <span>
          <b className="font-semibold text-ink">achievements</b> · {unlockedCount} / {CELLS.length} unlocked
        </span>
        <span>{percent}%</span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full"
        style={{ background: "var(--ach-track)" }}
      >
        <span
          className="block h-full bg-gradient-to-r from-accent to-accent-2"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div
        className="mt-2.5 grid gap-1.5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(34px, 1fr))" }}
      >
        {CELLS.map((cell) => (
          <div
            key={cell.id}
            title={cell.id}
            className={clsx(
              "grid aspect-square place-items-center rounded-md border font-mono text-[11px] transition-colors",
              cell.unlocked
                ? "text-accent"
                : "border-stroke text-ink-mute",
            )}
            style={
              cell.unlocked
                ? {
                    background: "var(--ach-unlocked)",
                    borderColor: "var(--ach-unlocked-stroke)",
                  }
                : { background: "var(--ach-cell-bg)" }
            }
          >
            {cell.mark}
          </div>
        ))}
      </div>
    </div>
  );
}
