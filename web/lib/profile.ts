export type IconKey = "github" | "email" | "blog" | "linkedin";

export interface IconLink {
  key: IconKey;
  label: string;
  href: string;
  external: boolean;
}

export interface MetaRow {
  key: string;
  value: string;
  ok?: boolean;
}

export interface Profile {
  name: string;
  /** Eyebrow chip text rendered next to the pulse dot. */
  statusChip: string;
  /** Headline split into two lines. line2 is the brand statement. */
  headline: { line1: string; line2: string };
  /** Master skills inventory shown below the meta-grid. */
  stack: { category: string; items: string[] }[];
  /** Tagline supports inline tokens: *mono-accent* and **bold-ink**. */
  tagline: string;
  meta: MetaRow[];
  icons: IconLink[];
  resumeUrl: string;
  contactEmail: string;
  jsonBio: {
    name: string;
    role: string;
    yrs: number;
    shippedAt: string[];
    superpowers: string[];
    available: boolean;
  };
}

export const profile: Profile = {
  name: "Mason Aviles",
  statusChip: "12+ year software engineer",
  headline: {
    line1: "Hi, I'm Mason.",
    line2: "I build the web faster, cleaner, kinder.",
  },
  tagline:
    "Senior full-stack — *React*, *TypeScript*, *Next.js* up front and *Python* / *FastAPI* behind. " +
    "I've shipped at **Apple** via AKQA & Level Studios, **Smartsheet**, **Amperity**, and **Uptime.com**, " +
    "and I write code with Claude as a co-author, not a tool.",
  meta: [
    { key: "role", value: "Senior FE Engineer Lead" },
    { key: "currently", value: "shipping software" },
    { key: "stack", value: "react · ts · py · ai" },
    { key: "location", value: "Remote · Las Vegas, NV" },
    { key: "a11y", value: "WCAG 2.2 AA · 508", ok: true },
    { key: "status", value: "open to software + web", ok: true },
  ],
  stack: [
    {
      category: "frontend",
      items: [
        "React",
        "TypeScript",
        "Next.js",
        "Vue",
        "Nuxt",
        "Tailwind CSS",
        "Chakra UI",
        "Framer Motion",
      ],
    },
    {
      category: "backend",
      items: ["Node.js", "Python", "FastAPI", "Supabase", "PHP"],
    },
    {
      category: "ai",
      items: ["Claude", "Gemini", "Codex", "ChatGPT", "MidJourney", "ComfyUI"],
    },
    {
      category: "cms",
      items: ["Shopify", "Drupal", "WordPress", "Webflow", "Craft CMS"],
    },
  ],
  icons: [
    { key: "github", label: "GitHub", href: "https://github.com/masonaviles", external: true },
    { key: "email", label: "Email", href: "mailto:mce.aviles@gmail.com", external: false },
    { key: "blog", label: "Blog", href: "/blog", external: false },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: "https://linkedin.com/in/masonaviles",
      external: true,
    },
  ],
  resumeUrl: "/resume.pdf",
  contactEmail: "mce.aviles@gmail.com",
  jsonBio: {
    name: "Mason Aviles",
    role: "Senior Full-Stack Engineer",
    yrs: 12,
    shippedAt: ["Apple", "Smartsheet", "Amperity"],
    superpowers: [
      "modular component architecture",
      "design-system fluency",
      "AI-native workflow",
      "email engineering",
    ],
    available: true,
  },
};
