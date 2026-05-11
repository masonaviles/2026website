# mason.os — 2026 Personal Site

Personal portfolio for Mason Aviles, framed as an interactive "operating system" — left rail nav, persistent status bar, panels with their own state. Every section is a live artifact, not a description.

> **Start here:** for the phase-by-phase build playbook, read [`docs/BUILD.md`](docs/BUILD.md). For services and env vars, [`docs/STACK.md`](docs/STACK.md). For the gamification spec, [`docs/ACHIEVEMENTS.md`](docs/ACHIEVEMENTS.md). For the visual target, open [`prototypes/02-ide.html`](prototypes/02-ide.html).

## Goals

- Illustrate 12+ years frontend + fullstack backend (React/TS/Next + Python/FastAPI).
- Demonstrate AI-native workflow fluency (Anthropic API, Claude Code, Vertex AI).
- Stand out vs commoditized 2026 dev portfolios: live data over screenshots, construction visible, gamified exploration.
- Conversion-minded: clear paths to Download Resume / Contact, tracked funnel, visible Lighthouse scores.

## Concept

Hero panel (`~/profile`) gives recruiters a calm, conventional entry: avatar, one-line title, summary, CTAs (Download Resume, Contact), icon links (GitHub, Email, Blog, LinkedIn), status chip ("12+ year software engineer"), availability, location, timezone.

Below the hero, the OS metaphor takes over: panels, keyboard shortcuts, a status bar showing live deploy/build info, and an ambient achievement system that rewards exploration.

## Stack

**Frontend (`web/`)** — Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion, MDX for blog. Deployed to Netlify.

**Backend (`api/`)** — FastAPI (Python 3.12), Uvicorn. Deployed to Fly.io as a persistent service. Handles:
- `/api/claude/chat` — streaming proxy to Anthropic API for the "Ask about Mason" assistant
- `/api/cover-letter` — JD → cover letter generator
- `/api/contact` — contact form (validated, rate-limited)
- `/api/github/heatmap` — cached GitHub activity for the city/skyline viz
- `/api/achievements/sync` — optional cross-device achievement sync
- `/api/resume` — serve resume PDF with download counter

**Persistence** — SQLite on a Fly volume, owned by FastAPI. SQLAlchemy + Alembic for schema + migrations. Tables: contact submissions, optional achievement sync, GitHub cache, funnel events, optional Bug Hunt leaderboard. Backups via Fly volume snapshots. One backend, one source of truth.

**Tooling** — pnpm, Biome (or ESLint+Prettier), Vitest + Playwright (web), pytest + httpx (api), GitHub Actions CI.

## Directory layout

```
2026website/
├── web/                          # Next.js frontend
│   ├── app/
│   │   ├── (os)/                 # OS shell layout (rail + status bar)
│   │   │   ├── profile/
│   │   │   ├── work/
│   │   │   ├── projects/
│   │   │   ├── blog/
│   │   │   ├── system/           # live design system
│   │   │   ├── playground/       # AI demos + Bug Hunt
│   │   │   └── contact/
│   │   ├── api/                  # Next route handlers (thin BFF)
│   │   └── layout.tsx
│   ├── components/
│   │   ├── os/                   # Panel, StatusBar, Rail, CommandPalette
│   │   ├── achievements/         # ToastQueue, AchievementsPanel, store
│   │   ├── motion/               # shared Framer primitives
│   │   ├── design-system/        # tokens, primitives — used by site AND /system
│   │   └── playground/           # BugHunt, AskMasonChat, CoverLetterGen
│   ├── content/blog/             # MDX posts
│   ├── lib/
│   │   ├── achievements/         # event bus + unlock rules
│   │   ├── analytics/
│   │   └── api-client/           # typed FastAPI client
│   └── public/
│       └── resume.pdf
├── api/                          # FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/              # ai_chat, cover_letter, contact, github, achievements, funnel
│   │   ├── services/             # anthropic_client, github_client
│   │   ├── db/                   # SQLAlchemy models, engine, session
│   │   ├── schemas/              # Pydantic models
│   │   └── core/                 # config, deps, middleware, rate limiting
│   ├── alembic/                  # SQLite migrations
│   ├── data/                     # SQLite file (mounted Fly volume; gitignored)
│   ├── tests/
│   └── pyproject.toml
├── docs/
└── CLAUDE.md
```

## OS shell — primitives

- `Panel` — windowed container with title bar (traffic-light dots, mono title), optional toolbar, scoped scroll. Supports `compact` and `expanded` states.
- `Rail` — persistent left navigation, directory metaphor (`~/profile`, `~/work`, …). Active state mirrors current route.
- `StatusBar` — bottom-anchored, always visible. Shows: last deploy timestamp, current Lighthouse score, GitHub commits this week, achievement progress %, "powered by Claude" indicator.
- `CommandPalette` — `cmd+K`. Real navigation + hidden joke commands (`sudo hire mason`, `whoami`, `git log`).
- `KeyboardShortcuts` — `?` opens cheatsheet panel.

## Gamification

**Trigger model:** event bus (`emit('inspector_opened')`) → unlock rules → toast + persist.

**Persistence:** localStorage by default; optional `/api/achievements/sync` for cross-device when user supplies email.

**Initial achievement set:**
- `hello_world` — first visit
- `curious_cat` — opened inspector mode
- `polyglot` — viewed all stack-switcher modes
- `speed_reader` — read a blog post end-to-end (scroll % + dwell)
- `power_user` — used 5+ keyboard shortcuts
- `architect` — opened `~/system`
- `mailman` — opened the email inbox demo
- `whisperer` — chatted with the Claude bot
- `recruiter` — clicked Contact or Download Resume
- `egg_hunter` — found a hidden command
- `completionist` — all of the above

**Marquee mini-game:** Bug Hunt (v1). Drag the right hook (`useState`/`useEffect`/`useMemo`/`useCallback`) into the right slot to fix a broken component; live result renders below. Lives at `~/playground/bug-hunt`.

**Hidden:** Konami code unlocks alt theme; `cmd+shift+P` joke commands; status-bar input accepts terminal-style commands.

## Conventions

- **TypeScript:** strict. No `any` unchecked. Path alias `@/` → `web/`.
- **Styling:** Tailwind first; design tokens in `components/design-system/tokens`. The same tokens render `~/system`.
- **Motion:** prefer Framer Motion shared layout + variants. Honor `prefers-reduced-motion` everywhere — fall back to opacity-only transitions.
- **Accessibility:** WCAG 2.2 AA bar. Every interactive component must work via keyboard, screen reader, and reduced motion. The site flexes a11y as a feature; sloppy a11y undermines the whole thing.
- **Performance:** budget — homepage LCP < 2s on 4G, JS < 150kb initial. Images via `next/image`. Heavy panels (Bug Hunt, GitHub city) lazy-load.
- **Python:** ruff + black formatting, type hints required, Pydantic for all I/O schemas, async by default for HTTP.
- **Secrets:** never commit. `.env.example` only. Anthropic + GitHub keys via Fly secrets. SQLite file lives on a mounted Fly volume — never check `*.db` into git.

## Build order (phases)

**Phase 1 — Skeleton & hero (ship-ready first impression).**
- Next.js scaffold, OS shell (`Panel`, `Rail`, `StatusBar`, `CommandPalette`)
- `~/profile` hero panel: summary, CTAs, icon links, status chips
- Resume PDF download
- Basic contact form (FastAPI endpoint; persists to SQLite)
- Lighthouse + a11y baseline gates in CI
- Deploy to Netlify (web) + Fly.io (api)
- Domain: gitaddmason.dev

**Phase 2 — Work, blog, system.**
- `~/work` career chapters with per-chapter aesthetic
- `~/blog` MDX pipeline + first 3 posts
- `~/system` live design system page (renders the same primitives the site uses)
- Status bar wired to real GitHub + last-deploy data via FastAPI

**Phase 3 — AI playground.**
- "Ask about Mason" Claude chat (streaming via FastAPI → Anthropic)
- Cover-letter generator (paste JD → output)
- Both grounded in resume + project content

**Phase 4 — Gamification.**
- Achievement event bus + toast UI
- Initial 11 achievements wired
- `cmd+shift+P` palette, Konami code, hidden commands
- Bug Hunt mini-game

**Phase 5 — Showpieces.**
- GitHub city / skyline viz (FastAPI cached endpoint)
- Inspector mode toggle (real React-DevTools-style overlay)
- Email inbox demo
- "View the prompt that built this" overlays

**Phase 6 — Polish & launch.**
- SEO, OG images, sitemap, RSS for blog
- Funnel analytics with visible dashboard
- Final Lighthouse / axe pass
- Soft launch → social

## Out of scope (for now)

- Auth / user accounts (achievements are device-local + optional email sync only).
- CMS — MDX in repo is the source of truth for blog.
- Native mobile.
- Comments on blog posts (use reactions only).

## Working agreements with Claude Code

- **Never code ahead of the brief.** If the user asks to brainstorm or plan, no implementation.
- **Show construction.** Where possible, leave artifacts (prompts, diffs, ADRs) visible — they become content for the site itself.
- **Match Apple-bar polish.** When in doubt, restraint over flourish; one strong interaction beats five mediocre ones.
- **A11y is not a phase.** It's a gate on every component PR.
- **Run a real browser before claiming UI changes work.** Type-checks pass ≠ feature works. Test the golden path in a browser, not just `tsc`.
