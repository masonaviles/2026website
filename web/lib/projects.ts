export type ProjectTag =
  | "frontend"
  | "fullstack"
  | "design-system"
  | "ai"
  | "marketing-site"
  | "internal-tooling"
  | "email"
  | "a11y"
  | "i18n"
  | "cms"
  | "perf";

export interface Project {
  id: string;
  title: string;
  /** One-line role/company. */
  context: string;
  /** Years active. */
  era: string;
  /** Short pitch — 1–2 sentences. */
  summary: string;
  /** Key receipts. */
  highlights: string[];
  tags: ProjectTag[];
  stack: string[];
  /** External link (live site, write-up, GitHub). */
  href?: string;
  /** Whether this is meta (the site itself). */
  meta?: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: "mason-os",
    title: "mason.os",
    context: "Personal · Next.js + FastAPI + SQLite",
    era: "2026 –",
    summary:
      "This site. An interactive 'operating system' portfolio — window chrome, command palette, gamified exploration, Bug Hunt mini-game. Built with Claude Code as a co-author.",
    highlights: [
      "Next.js 16 (App Router) on Netlify; FastAPI + SQLAlchemy on Fly.io with SQLite on a mounted volume.",
      "Live design system at /system uses the same component imports as the production hero.",
      "Light/dark theme with hydration-safe pre-paint toggle.",
    ],
    tags: ["fullstack", "design-system", "ai", "frontend"],
    stack: ["next.js", "react", "typescript", "tailwind", "fastapi", "sqlite", "alembic"],
    href: "https://gitaddmason.dev",
    meta: true,
  },
  {
    id: "uptime-marketing",
    title: "Uptime.com marketing site",
    context: "Sole frontend owner · Level Studios",
    era: "2021 – 2024",
    summary:
      "Owned the entire marketing site end-to-end — architecture, design system, performance, SEO, and core flows including pricing and user profiles.",
    highlights: [
      "Lifted organic visibility by ~20% through SEO + CI/CD discipline.",
      "Built scalable React component libraries and design systems from scratch.",
      "Optimized trial-to-paid conversion via cleaner architecture and component reuse.",
    ],
    tags: ["frontend", "design-system", "marketing-site", "perf"],
    stack: ["react", "tailwind", "chakra-ui", "typescript", "ci/cd"],
  },
  {
    id: "apple-pm-dashboard",
    title: "Apple PM dashboard",
    context: "Level Studios · Apple internal tooling",
    era: "2021 – 2024",
    summary:
      "React-based internal dashboard for Apple project managers — centralized project details, lifecycle steps, and team communications with automated email and ticket generation.",
    highlights: [
      "Automated email + ticket generation tied to dev process stages.",
      "Ran code reviews enforcing Apple's engineering standards.",
      "Improved UI responsiveness through profiling and React optimization.",
    ],
    tags: ["frontend", "internal-tooling"],
    stack: ["react", "typescript"],
  },
  {
    id: "akqa-apple-mvps",
    title: "Apple-account React/Vue MVPs",
    context: "Software Engineer Lead · AKQA",
    era: "2025 – present",
    summary:
      "Frontend architecture for Apple-account internal apps and prototypes. Owned scaffolding through delivery across React, Next.js, Vue.js, and Nuxt.js MVP builds.",
    highlights: [
      "Internal React dashboards giving Dev Engineering Leads real-time visibility into project status and metrics.",
      "Shopify cart upsell and recommendation engines for high-traffic retail.",
      "First-party cookie + session tracking powering personalization.",
    ],
    tags: ["frontend", "internal-tooling", "fullstack"],
    stack: ["react", "next.js", "vue", "nuxt", "shopify", "liquid", "typescript"],
  },
  {
    id: "email-engineering",
    title: "Modular email template system",
    context: "Email engineering team lead · AKQA · Amperity",
    era: "2019 –",
    summary:
      "Dynamic, session-cookie-based email templates powering multi-campaign workflows. Modular blocks let non-technical teams deploy branded campaigns independently.",
    highlights: [
      "Cut email campaign turnaround by ~50% at Amperity through block-based authoring.",
      "Led the email engineering team on a Fortune-500 account at AKQA.",
      "Tested across Gmail, Outlook, dark mode — the one I'll show off in the inbox demo.",
    ],
    tags: ["email", "design-system"],
    stack: ["html", "css", "liquid", "litmus"],
  },
  {
    id: "amperity-cms-migration",
    title: "Amperity PHP → Craft CMS migration",
    context: "Lead · Amperity marketing site",
    era: "2019 – 2020",
    summary:
      "Migrated the marketing site from PHP to Craft CMS — streamlined content workflows and dramatically reduced marketing's dependency on engineering.",
    highlights: [
      "−40% on marketing's engineering dependency.",
      "+25% page performance; +18% inbound leads.",
      "WCAG-compliant components and brand alignment from the ground up.",
    ],
    tags: ["fullstack", "cms", "marketing-site", "a11y"],
    stack: ["php", "craft-cms", "html", "css", "javascript"],
  },
  {
    id: "smartsheet-multilingual",
    title: "Smartsheet multilingual platform",
    context: "Frontend Drupal · Smartsheet",
    era: "2014 – 2019",
    summary:
      "Maintained and scaled a Drupal codebase serving millions of monthly users through two major migrations. Owned localization and frontend standards.",
    highlights: [
      "−35% localization turnaround via extended Lingotek workflows.",
      "Cross-browser compatibility from IE8+ through modern browsers.",
      "Established frontend standards + docs during rapid company growth.",
    ],
    tags: ["fullstack", "cms", "i18n", "marketing-site"],
    stack: ["drupal", "php", "javascript", "lingotek"],
  },
  {
    id: "aleut-federal-drupal",
    title: "Federal Drupal · weather data UI",
    context: "Senior Frontend · Aleut Federal",
    era: "2024 – 2025",
    summary:
      "Government agency sites surfacing complex weather and environmental datasets through clean, public-facing interfaces. Section 508 + WCAG 2.1 AA throughout.",
    highlights: [
      "Custom Drupal themes and component-based templates for data-heavy interfaces.",
      "Federal release cadences with cross-team coordination.",
      "Accessibility as a gate, not an afterthought.",
    ],
    tags: ["frontend", "cms", "a11y"],
    stack: ["drupal", "twig", "scss", "section-508"],
  },
];

export const ALL_TAGS: ProjectTag[] = [
  "frontend",
  "fullstack",
  "design-system",
  "ai",
  "marketing-site",
  "internal-tooling",
  "email",
  "a11y",
  "i18n",
  "cms",
  "perf",
];
