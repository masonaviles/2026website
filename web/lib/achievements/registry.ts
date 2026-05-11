export const ACHIEVEMENT_IDS = [
  "hello_world",
  "curious_cat",
  "polyglot",
  "speed_reader",
  "power_user",
  "architect",
  "mailman",
  "whisperer",
  "recruiter",
  "egg_hunter",
  "bug_hunter",
  "terminator",
  "completionist",
] as const;

export type AchievementId = (typeof ACHIEVEMENT_IDS)[number];

export interface AchievementDef {
  id: AchievementId;
  label: string;
  description: string;
  /** A single glyph rendered in the cell preview when unlocked. */
  mark: string;
  /** Whether the trigger is wired in this phase. Locked-but-unwired cells still render. */
  wired: boolean;
}

export const ACHIEVEMENTS: Record<AchievementId, AchievementDef> = {
  hello_world: {
    id: "hello_world",
    label: "Hello, world",
    description: "First visit to mason.os.",
    mark: "★",
    wired: true,
  },
  curious_cat: {
    id: "curious_cat",
    label: "Curious cat",
    description: "Opened the Inspector overlay.",
    mark: "◎",
    wired: true,
  },
  polyglot: {
    id: "polyglot",
    label: "Polyglot",
    description: "Viewed every stack-switcher mode.",
    mark: "λ",
    wired: false,
  },
  speed_reader: {
    id: "speed_reader",
    label: "Speed reader",
    description: "Read a blog post end to end.",
    mark: "✎",
    wired: true,
  },
  power_user: {
    id: "power_user",
    label: "Power user",
    description: "Used 5+ unique keyboard shortcuts.",
    mark: "⌘",
    wired: true,
  },
  architect: {
    id: "architect",
    label: "Architect",
    description: "Opened ~/system, the live design system.",
    mark: "▦",
    wired: true,
  },
  mailman: {
    id: "mailman",
    label: "Mailman",
    description: "Opened the email engineering demo.",
    mark: "✉",
    wired: false,
  },
  whisperer: {
    id: "whisperer",
    label: "Whisperer",
    description: "Sent a message in the Ask Mason chat.",
    mark: "💬",
    wired: true,
  },
  recruiter: {
    id: "recruiter",
    label: "Recruiter",
    description: "Clicked Contact or Download résumé.",
    mark: "♛",
    wired: true,
  },
  egg_hunter: {
    id: "egg_hunter",
    label: "Egg hunter",
    description: "Found a hidden command.",
    mark: "🥚",
    wired: true,
  },
  bug_hunter: {
    id: "bug_hunter",
    label: "Bug hunter",
    description: "Solved your first Bug Hunt puzzle.",
    mark: "🐛",
    wired: true,
  },
  terminator: {
    id: "terminator",
    label: "Terminator",
    description: "Solved every Bug Hunt puzzle.",
    mark: "🏆",
    wired: true,
  },
  completionist: {
    id: "completionist",
    label: "Completionist",
    description: "Unlocked every other achievement.",
    mark: "✦",
    wired: true,
  },
};

/** Set of IDs that contribute to `completionist`. */
export const REQUIRED_FOR_COMPLETIONIST: AchievementId[] = ACHIEVEMENT_IDS.filter(
  (id) => id !== "completionist",
);
