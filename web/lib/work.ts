export type Accent =
  | "apple-glass"
  | "federal-navy"
  | "thinkful-orange"
  | "fellows-purple"
  | "amperity-warm"
  | "smartsheet-green";

/**
 * Each accent maps to two CSS hex values: `fg` (primary tint, often used for
 * text/borders) and `bg` (a subtle wash for backgrounds). Both themes share
 * the same accents — they're meant to feel like company-brand color, not
 * theme color. The OS chrome stays on its own neutral palette.
 */
export const ACCENT_COLORS: Record<Accent, { fg: string; bg: string }> = {
  "apple-glass": { fg: "#a4a7b3", bg: "rgba(124, 247, 196, 0.04)" },
  "federal-navy": { fg: "#3b6ed1", bg: "rgba(59, 110, 209, 0.08)" },
  "thinkful-orange": { fg: "#ff7a59", bg: "rgba(255, 122, 89, 0.08)" },
  "fellows-purple": { fg: "#a472ff", bg: "rgba(164, 114, 255, 0.08)" },
  "amperity-warm": { fg: "#ffb547", bg: "rgba(255, 181, 71, 0.08)" },
  "smartsheet-green": { fg: "#28c840", bg: "rgba(40, 200, 64, 0.08)" },
};

export interface Metric {
  label: string;
  value: string;
}

export interface WorkEntry {
  id: string;
  company: string;
  role: string;
  dates: string;
  location?: string;
  accent: Accent;
  /** Headline takeaway — one sentence. */
  summary: string;
  /** Bullets — each is a discrete accomplishment. */
  bullets: string[];
  /** Quantitative wins, rendered as chips. */
  metrics?: Metric[];
  /** Tech stack tags, lowercase. */
  stack: string[];
  /** True for the role currently held. */
  current?: boolean;
}

export const WORK: WorkEntry[] = [
  {
    id: "akqa-apple",
    company: "AKQA Group (Apple account)",
    role: "Software Engineer Lead",
    dates: "Mar 2025 – Mar 2026",
    location: "Remote",
    accent: "apple-glass",
    current: true,
    summary:
      "Frontend architecture lead for Apple. Architected internal React applications and prototype tools from scaffolding through delivery, led the email engineering team, and shipped commerce upsell + recommendation work across Shopify and custom platforms.",
    bullets: [
      "Owned frontend architecture for Apple-account React, Next.js, Vue.js, and Nuxt.js MVP builds end-to-end.",
      "Built internal React dashboards and report-builder apps giving Dev Engineering Leads real-time visibility into project status and metrics.",
      "Led a team of email engineers across high-volume marketing and transactional programs — dynamic, session-cookie templating powering multi-campaign workflows.",
      "Engineered Shopify cart upsell, recommendation engines, and minicart integrations; extended storefronts via theme customization and Liquid templating.",
      "Implemented first-party cookie / session tracking powering personalization and retargeting; optimized recommendation scripts for localization and category accuracy.",
      "Built modular UI component libraries compliant with WCAG 2.1 and Section 508.",
    ],
    stack: ["react", "next.js", "vue", "nuxt", "shopify", "liquid", "typescript", "wcag"],
  },
  {
    id: "aleut-federal",
    company: "Aleut Federal",
    role: "Senior Frontend Drupal Engineer",
    dates: "Sep 2024 – Mar 2025",
    location: "Remote",
    accent: "federal-navy",
    summary:
      "Federal Drupal frontend work for government agencies in the weather and environmental data space — surfacing complex scientific datasets through accessible, public-facing interfaces.",
    bullets: [
      "Delivered frontend Drupal on government agency sites surfacing weather and environmental data.",
      "Built and maintained custom Drupal themes and component-based templates — data-heavy requirements rendered as accessible UI.",
      "Implemented responsive frontends aligned with Section 508 and WCAG 2.1 AA against federal release cadences.",
    ],
    metrics: [{ label: "compliance", value: "508 · WCAG 2.1 AA" }],
    stack: ["drupal", "twig", "scss", "section-508", "wcag"],
  },
  {
    id: "level-apple",
    company: "Level Studios (Apple) · Uptime.com",
    role: "Senior Frontend Software Engineer",
    dates: "Aug 2021 – Sep 2024",
    location: "Cupertino, CA",
    accent: "apple-glass",
    summary:
      "Two adjacent tracks: shipped React-based internal tooling for Apple project managers, and was sole frontend owner of Uptime.com's marketing site (architecture, design system, performance, SEO).",
    bullets: [
      "Apple — designed and built a React-based internal PM dashboard centralizing project details, lifecycle steps, and team communications.",
      "Apple — implemented automated email and ticket generation tied to dev process stages.",
      "Apple — ran code reviews enforcing maintainability, performance, and Apple's engineering standards; improved UI responsiveness via profiling and React optimization.",
      "Uptime.com — owned the marketing site end-to-end as the only frontend engineer: architecture, technical direction, and core flows (pricing, profiles).",
      "Uptime.com — built scalable React component libraries and design systems from scratch; React + Tailwind + Chakra UI.",
      "Uptime.com — implemented SEO best practices and CI/CD pipelines; optimized trial-to-paid conversion.",
    ],
    metrics: [{ label: "organic visibility", value: "+20%" }],
    stack: ["react", "tailwind", "chakra-ui", "typescript", "ci/cd"],
  },
  {
    id: "thinkful",
    company: "Thinkful",
    role: "Senior Frontend React Engineer Instructor",
    dates: "Jul 2023 – Jan 2024",
    accent: "thinkful-orange",
    summary:
      "Mentored cohorts of up to 20 students per cohort in modern frontend development. ES6+, component architecture, state management, async workflows.",
    bullets: [
      "Mentored up to 20 students per cohort across modern frontend topics.",
      "Conducted in-depth code reviews with actionable feedback.",
      "Contributed curriculum updates aligned with evolving frontend technologies and hiring standards.",
    ],
    stack: ["react", "javascript", "es6", "mentorship"],
  },
  {
    id: "code-fellows",
    company: "Code Fellows",
    role: "JavaScript & React Instructor",
    dates: "May 2014 – Oct 2014 · Apr 2020 – Aug 2021",
    location: "Seattle, WA",
    accent: "fellows-purple",
    summary:
      "Taught full-stack JavaScript and React fundamentals across multiple cohorts. Curriculum design and student portfolio development.",
    bullets: [
      "Taught full-stack JS / React across multiple cohorts; supported students through debugging and portfolio development.",
      "Contributed to curriculum design and updates aligned with current industry tooling.",
    ],
    stack: ["javascript", "react", "node.js", "mentorship"],
  },
  {
    id: "amperity",
    company: "Amperity",
    role: "Frontend CMS / PHP Web Engineer & Manager",
    dates: "Feb 2019 – Apr 2020",
    location: "Seattle, WA",
    accent: "amperity-warm",
    summary:
      "Owned end-to-end development of the marketing website. Led a PHP → Craft CMS migration and built a modular email template system that cut campaign turnaround in half.",
    bullets: [
      "Owned end-to-end development of the marketing site; ensured full WCAG accessibility and brand alignment.",
      "Built landing pages and campaigns that lifted inbound lead generation through cleaner HTML/CSS/JS and optimized conversion paths.",
      "Led a full migration from PHP to Craft CMS — streamlined content workflows and reduced marketing's dependency on engineering.",
      "Built a modular email template system enabling non-technical teams to deploy branded campaigns independently.",
    ],
    metrics: [
      { label: "page performance", value: "+25%" },
      { label: "inbound leads", value: "+18%" },
      { label: "marketing dependency", value: "−40%" },
      { label: "email turnaround", value: "−50%" },
    ],
    stack: ["php", "craft-cms", "html", "css", "javascript"],
  },
  {
    id: "smartsheet",
    company: "Smartsheet",
    role: "Frontend Drupal Software Engineer",
    dates: "Sep 2014 – Feb 2019",
    location: "Bellevue, WA",
    accent: "smartsheet-green",
    summary:
      "Maintained and optimized a Drupal codebase serving millions of monthly users through two major website migrations; led localization and frontend standards during rapid company growth.",
    bullets: [
      "Maintained / optimized a Drupal codebase serving millions of monthly users — performance and scalability across two major migrations.",
      "Built responsive, multilingual marketing pages and landing experiences with cross-browser compatibility from IE8+ through modern browsers.",
      "Integrated and extended Lingotek translation workflows, expanding international reach.",
      "Established frontend standards, documentation, and workflows during rapid company growth.",
    ],
    metrics: [{ label: "localization turnaround", value: "−35%" }],
    stack: ["drupal", "php", "javascript", "lingotek", "i18n"],
  },
];
