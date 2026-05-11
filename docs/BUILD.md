# mason.os — Build Playbook

This is the operating manual for building [gitaddmason.dev](https://gitaddmason.dev). It is written for Claude Code sessions: each phase is self-contained, with concrete inputs, outputs, and verification gates so any session can pick up where the last one left off.

For concept, conventions, and aesthetic direction, see [`CLAUDE.md`](../CLAUDE.md). For the visual target, see [`prototypes/02-ide.html`](../prototypes/02-ide.html).

---

## 0 · Quick reference

**Concept:** Personal portfolio framed as an interactive "operating system" — left rail, tabbed editor area, status bar, gamified exploration, Bug Hunt mini-game. Visual target: IDE/terminal aesthetic with light + dark mode.

**Stack at a glance:**

| Layer | Tech | Host |
|---|---|---|
| Frontend | Next.js 16 (App Router) · TS · Tailwind · Framer Motion · MDX | Netlify |
| Backend | FastAPI · Python 3.12 · Uvicorn · Pydantic | Fly.io |
| Persistence | SQLite · SQLAlchemy · Alembic | Fly volume (mounted at `/data`) |
| AI | Anthropic API (Claude) | via FastAPI proxy |
| Domain | gitaddmason.dev | Netlify DNS |

**Repository layout (target):**

```
2026website/
├── CLAUDE.md
├── README.md
├── docs/
│   ├── BUILD.md                  ← this file
│   ├── STACK.md                  ← env vars, deploy targets, services
│   └── ACHIEVEMENTS.md           ← spec for the gamification layer
├── prototypes/                   ← design references; not deployed
├── web/                          ← Next.js (Netlify)
├── api/                          ← FastAPI (Fly.io)
└── .github/workflows/            ← CI
```

---

## 1 · Prerequisites

### Local toolchain

- **Node 20 LTS** (or 22) · `nvm install 20 && nvm use 20`
- **pnpm 9** · `corepack enable && corepack prepare pnpm@latest --activate`
- **Python 3.12** · via `pyenv` or system
- **uv** (Python package manager) · `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **Netlify CLI** · `pnpm add -g netlify-cli`
- **Fly CLI** · `curl -L https://fly.io/install.sh | sh`
- **GitHub CLI** · `brew install gh`
- **SQLite** ships with macOS. For browsing: `brew install --cask db-browser-for-sqlite` (optional).

### Accounts / service provisioning

Provision these once before Phase 0 ends. Capture all keys in a password manager and a local `.env` (never committed).

- **Netlify** — site connected to GitHub repo; custom domain `gitaddmason.dev`
- **Fly.io** — app `mason-os-api` in region `sjc`; **plus a 1GB volume `mason_data` mounted at `/data`** for the SQLite file
- **Anthropic Console** — API key with `claude-opus-4-7` / `claude-sonnet-4-6` access; spend cap set
- **GitHub** — repo `gitaddmason.dev`; fine-grained PAT with `read:user` + `public_repo` (for the GitHub city viz)
- **Resend** (or similar) — for contact-form notifications, optional in Phase 1

See [`docs/STACK.md`](STACK.md) for the full env-var inventory.

---

## 2 · Phases

Each phase has: **goal**, **outputs**, **deps to add**, **verify**. Do them in order. Don't start a phase until the prior phase passes verify.

---

### Phase 0 · Foundation

**Goal:** Empty but production-deployable monorepo. A `hello` page is live at `gitaddmason.dev` and a `/health` endpoint is live on Fly.

**Outputs:**

- `pnpm-workspace.yaml` declaring `web/`
- `web/` — Next.js 16 App Router scaffold, TS strict, Tailwind, `app/page.tsx` returning a placeholder
- `api/` — FastAPI scaffold with `app/main.py`, `app/routers/health.py` (`GET /health` → `{"ok": true, "db": "ok"}`), `app/db/engine.py` (SQLAlchemy engine pointed at `${DATABASE_URL:-sqlite:////data/mason.db}`), `app/db/base.py`, `alembic/` initialized, `pyproject.toml`, `Dockerfile`
- `api/fly.toml` declares a mount: `[mounts] source = "mason_data"; destination = "/data"`. Volume created via `flyctl volumes create mason_data --size 1 --region sjc`.
- `.gitignore`, `.editorconfig`, `.nvmrc`, `.python-version`
- `web/.env.example`, `api/.env.example`
- `netlify.toml` at root with web build config
- `api/fly.toml`
- `.github/workflows/ci.yml` — runs typecheck + lint + test (stubs OK) for `web/`, runs ruff + pytest stub for `api/`
- `README.md` with how to run locally
- Domain wired: Netlify primary domain `gitaddmason.dev`, Fly app reachable at `api.gitaddmason.dev` (CNAME)

**Deps to add (web):** `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `@types/node`, `@types/react`, `eslint-config-next`, `@biomejs/biome` (or keep eslint+prettier).

**Deps to add (api):** `fastapi`, `uvicorn[standard]`, `pydantic`, `python-dotenv`, `httpx`, `sqlalchemy`, `alembic`, `aiosqlite` (async driver). Dev: `pytest`, `pytest-asyncio`, `ruff`, `black`, `mypy`.

**Verify:**

- [ ] `pnpm --filter web dev` serves `http://localhost:3000`
- [ ] `uv run uvicorn app.main:app --reload` (from `api/`) serves `http://localhost:8000/health`
- [ ] `alembic upgrade head` runs cleanly against the local `data/mason.db`
- [ ] `git push` → CI green
- [ ] `https://gitaddmason.dev` returns 200 with placeholder
- [ ] `https://api.gitaddmason.dev/health` returns `{"ok": true, "db": "ok"}`
- [ ] Fly volume mounted; the SQLite file persists across a `flyctl deploy`
- [ ] Lighthouse on the placeholder ≥ 95 across the board (baseline)

---

### Phase 1 · OS shell + hero

**Goal:** The OS aesthetic from `prototypes/02-ide.html` is live as a real Next.js page. Light/dark toggle works. Hero panel has actual CTAs and icon links. Recruiters could land here today and get a coherent first impression.

**Outputs:**

- `web/app/layout.tsx` — root layout, font loading (Inter, JetBrains Mono via `next/font`), theme provider, viewport meta
- `web/app/(os)/layout.tsx` — OS shell: window chrome, topbar, tabs, rail, status bar
- `web/components/os/` — `Window.tsx`, `TopBar.tsx`, `Tabs.tsx`, `Rail.tsx`, `StatusBar.tsx`, `ThemeToggle.tsx`
- `web/components/design-system/tokens.ts` — colors, spacing, radii, motion easings (the same tokens used in the prototype)
- `web/app/globals.css` — Tailwind layer + the CSS variables from the prototype, mapped to `[data-theme="light|dark"]`
- `web/lib/theme.ts` — theme detection + persistence
- `web/app/(os)/profile/page.tsx` — hero panel rendered from real data
- `web/lib/profile.ts` — typed source-of-truth for hero data (name, title, summary, chips, links, status)
- `web/public/resume.pdf` — copied from `/Users/mason/Documents/work/Mason_Aviles_Resume.docx` exported as PDF
- `api/app/routers/contact.py` — `POST /api/contact` with Pydantic schema, rate limit (5/hr per IP), persists to SQLite `contacts` table
- `api/app/db/models/contact.py` — SQLAlchemy `Contact` model (id, name, email, message, source_ip, created_at)
- Alembic migration: `001_initial.py` creating `contacts` (and any other Phase-1 tables)
- Optional notify via Resend on new contact (gated by `RESEND_API_KEY` presence)

**Deps to add (web):** `next-themes` (or homegrown), `clsx`, `lucide-react` (icons).

**Deps to add (api):** `slowapi` (rate limit), `email-validator` (Pydantic EmailStr), `resend` (optional, contact notifications).

**Conventions:**

- Server Components by default; only mark `'use client'` where state/effects are required.
- All animations honor `prefers-reduced-motion`. Use the variants in `tokens.ts`.
- Theme switch is hydration-safe — the inline `<head>` script pattern from the prototype is reused.

**Verify:**

- [ ] `/` renders the OS shell with hero panel matching the prototype within ~5%
- [ ] `⌘+K` opens a placeholder palette
- [ ] Theme toggle works, persists across reload, defaults to OS preference, no flash
- [ ] `Download résumé` downloads the actual PDF
- [ ] `Contact me` opens the contact form (modal or `/contact` panel) and submitting persists a row to `contacts` in SQLite
- [ ] Lighthouse ≥ 98 perf / 100 a11y / 100 best-practices / 100 SEO on `/`
- [ ] axe-core reports 0 violations on `/`
- [ ] All interactive elements keyboard-reachable; focus rings visible

---

### Phase 2 · Work, projects, system

**Goal:** Three more panels feel complete — career chapters tell the story, projects gallery, and the design system page that proves the rest of the site shares its primitives.

**Outputs:**

- `web/app/(os)/work/page.tsx` — career as scrollable chapters, each with its own micro-aesthetic accent (AKQA, Level Studios, Aleut, Smartsheet, Amperity, Uptime, instruction roles)
- `web/lib/work.ts` — typed array of work entries: company, role, dates, bullets, accent token, optional metrics
- `web/components/work/Chapter.tsx` — chapter primitive with shared layout, per-chapter accent override
- `web/app/(os)/projects/page.tsx` — projects grid, links to writeups
- `web/app/(os)/system/page.tsx` — renders the same `tokens`, primitives, components used by the rest of the site (colors swatches, type scale, motion playground, button states, focus rings, density variants). This is a real live design system page, not a Storybook.
- `web/components/design-system/Showcase.tsx` — primitive renderer
- Update `Rail.tsx` to mark `~/work`, `~/projects`, `~/system` as active when on those routes

**Conventions:**

- Per-chapter accent doesn't replace the whole theme — only an accent CSS variable scoped to that chapter via `data-chapter="apple"` etc.
- `/system` must use the same component imports as the live site. If a chip in `/system` and a chip in the hero look different, the system page is broken.

**Verify:**

- [ ] Navigating via the rail updates the URL and the active row
- [ ] `~/system` shows every primitive used elsewhere on the site
- [ ] Per-chapter accents don't bleed into other chapters
- [ ] All four panels pass axe-core with 0 violations

---

### Phase 3 · Blog (MDX)

**Goal:** A working blog at `/blog` with three real posts. Reading a post end-to-end emits the `speed_reader` event (wired in Phase 5).

**Outputs:**

- `web/content/blog/*.mdx` — at minimum three posts; suggested kickoff topics:
  - `building-with-claude-code.mdx`
  - `email-engineering-at-scale.mdx`
  - `react-perf-i-actually-use.mdx`
- `web/app/(os)/blog/page.tsx` — index: date, title, read time, tag chips, RSS link
- `web/app/(os)/blog/[slug]/page.tsx` — MDX renderer with custom components: `<Demo>`, `<Aside>`, `<CodeBlock>`, `<Diff>`, `<Achievement>`
- `web/lib/blog.ts` — front-matter parser (Zod-validated), reading-time calc, tag index
- `web/components/blog/Reader.tsx` — scroll tracker; emits `speed_reader` once `scrollPct > 90 && timeOnPage > readingTime*0.7`
- `web/app/feed.xml/route.ts` — RSS 2.0 feed

**Deps to add:** `next-mdx-remote`, `rehype-pretty-code` + `shiki`, `gray-matter`, `zod`, `reading-time`.

**Conventions:**

- MDX custom components live in `components/blog/`. The post's own JSX can use them directly. This is where Mason's React-in-blog superpower comes from.
- Front-matter schema is a Zod object — bad front-matter fails the build, not the runtime.

**Verify:**

- [ ] `/blog` renders index, sorted desc by date
- [ ] Each post renders; code blocks syntax-highlighted; tags clickable
- [ ] `/feed.xml` validates as RSS 2.0
- [ ] Scroll-to-end on a post triggers the speed-reader event (visible in console for now)
- [ ] Lighthouse ≥ 98 on a representative post

---

### Phase 4 · AI playground

**Goal:** Two live AI demos backed by FastAPI streaming from Anthropic. The "Ask about Mason" chat grounds in the resume + a curated knowledge file.

**Outputs:**

- `api/app/services/anthropic_client.py` — wrapper using prompt caching for the resume/context block (token savings, faster TTFB)
- `api/app/routers/ai_chat.py` — `POST /api/ai/chat`, SSE stream
- `api/app/routers/cover_letter.py` — `POST /api/ai/cover-letter`, takes a JD, returns a tailored cover letter (also streamed)
- `api/app/prompts/mason_knowledge.md` — resume + a paragraph per role + voice/tone guidance. This is the cached prefix.
- `web/app/(os)/playground/page.tsx` — playground index, links to demos
- `web/app/(os)/playground/ask/page.tsx` — chat UI
- `web/app/(os)/playground/cover-letter/page.tsx` — JD textarea + result panel
- `web/components/playground/StreamChat.tsx` — generic SSE consumer hook + UI
- Rate limiting: 10 messages/hr per IP on `ai/chat`; 3 cover-letter requests/hr per IP

**Conventions:**

- Always use the Claude API with prompt caching — the resume/context block is the cache-control: `ephemeral` chunk.
- Default model: `claude-sonnet-4-6` for chat (fast/cheap), `claude-opus-4-7` for cover-letter (better writing).
- Stream from FastAPI → SSE → React. No buffering full responses on the server.
- Show construction: a small "view system prompt" disclosure on each demo.

**Verify:**

- [ ] Chat: ask "would Mason fit a Shopify-heavy role?" → gets a grounded, accurate answer citing actual roles
- [ ] Cover letter: paste a JD → coherent, voice-matched letter streams in
- [ ] FastAPI logs show cache_read_input_tokens > 0 on the second request (cache hit)
- [ ] Rate-limit headers present on responses
- [ ] No raw Anthropic key reaches the browser

---

### Phase 5 · Gamification

**Goal:** Achievement system live. Toast pops, status bar shows progress, command palette works (real + joke commands), Konami code unlocks alt theme.

**Outputs:**

- `web/lib/achievements/registry.ts` — typed map of 11 achievements (see [`docs/ACHIEVEMENTS.md`](ACHIEVEMENTS.md))
- `web/lib/achievements/store.ts` — Zustand store, localStorage persistence
- `web/lib/achievements/events.ts` — tiny event bus (`emit('event_name')`)
- `web/components/achievements/ToastQueue.tsx` — queued toasts, dedupe, reduced-motion friendly
- `web/components/achievements/AchievementsPanel.tsx` — `/profile` sidebar widget showing all 11 cells (same look as in the prototype)
- Wire each achievement's trigger:
  - `hello_world` — mount of `(os)/layout.tsx`
  - `curious_cat` — Inspector mode toggled (Phase 7 will add the real overlay; the toggle itself can land here)
  - `polyglot` — three distinct stack-switcher modes viewed
  - `speed_reader` — emitted from blog Reader (Phase 3)
  - `power_user` — 5+ unique keyboard shortcuts used
  - `architect` — `/system` mounted
  - `mailman` — email inbox panel opened (Phase 7)
  - `whisperer` — sent message in Ask Mason chat (Phase 4)
  - `recruiter` — clicked Contact or Download Résumé
  - `egg_hunter` — typed `iddqd` or activated Konami
  - `completionist` — all of the above
- `web/components/os/CommandPalette.tsx` — real palette (`⌘K`): routes, recent posts, achievements, joke commands (`sudo hire mason`, `whoami`, `git log`)
- `web/lib/konami.ts` — Konami listener; unlocks alt theme (e.g., "Drupal era" beige) for the session
- `api/app/routers/achievements.py` — optional `POST /api/achievements/sync` (email-keyed; row in `achievement_syncs`), `GET /api/achievements/global-stats` for the "X people completed the site" counter (aggregated from `achievement_syncs`)
- Alembic migration adding `achievement_syncs` table

**Conventions:**

- Achievements are device-local first; sync is opt-in by entering email. Never bind to identifiable IDs without explicit consent.
- Toast queue caps at 3 concurrent; older fade.
- Every achievement persists with a timestamp. Re-unlocking is a no-op.

**Verify:**

- [ ] Fresh visit fires `hello_world`; toast pops 0.6–1.0s after first paint
- [ ] Achievement panel updates in real time
- [ ] Status-bar progress widget reflects current state
- [ ] Konami sequence unlocks alt theme; persists for the session only
- [ ] `⌘K` palette searches across routes + blog posts; closes on ESC; keyboard navigable

---

### Phase 6 · Bug Hunt (marquee game)

**Goal:** A delightful, demonstrably-real mini-game where you drag the right React hook into the right slot to fix a broken component. Live preview re-renders as you solve.

**Outputs:**

- `web/app/(os)/playground/bug-hunt/page.tsx` — game shell
- `web/components/playground/bug-hunt/` — `Stage.tsx`, `HookTray.tsx`, `Slot.tsx`, `LivePreview.tsx`, `puzzles.ts`
- 3–5 puzzles, each: broken component source, set of hook chips, target slot, success criteria
- Drag-and-drop using `@dnd-kit/core`
- Live preview compiles the patched source via a sandboxed `Function` with hooks injected; no `eval` of arbitrary user input
- Achievement: `bug_hunter` unlocked on first solve; `terminator` on all puzzles solved (consider adding both to the registry; if so, bump count from 11 → 13)
- Optional: `api/app/routers/bug_hunt.py` — `POST /api/games/bug-hunt/score`, `GET /api/games/bug-hunt/leaderboard` (SQLite-backed, new `bug_hunt_scores` table via Alembic migration)

**Conventions:**

- Puzzle compilation runs in a Web Worker so the main thread stays smooth.
- All puzzles work with keyboard (cmd+arrow to move hooks between slots) — drag is enhancement, not requirement.

**Verify:**

- [ ] Each puzzle is solvable
- [ ] Solving emits the right event
- [ ] Keyboard-only flow works
- [ ] No `eval` or unsafe dynamic code paths

---

### Phase 7 · Showpieces

**Goal:** The flexes. Each one alone could close a job. Pick the order based on how much time/energy remains.

**Outputs:**

- **Inspector mode** (`?` opens, or topbar Inspector button): toggles a global overlay that highlights React component boundaries on hover, shows component name + props count. Uses `react-reconciler` hooks. Lives in `web/components/os/Inspector.tsx`.
- **GitHub city** (`/projects` or its own panel): pulls live commit counts via `api/app/routers/github.py` (cached 1hr in SQLite `github_cache` table). Renders contributions as a 3D-ish skyline using `pixi.js` or vanilla canvas. Each "building" clickable → opens commit.
- **Email inbox demo** (`/projects/email-engineering`): in-page mock inbox with Gmail / Outlook / Dark tabs. Renders a real modular email template using your historic system. Opens `mailman` achievement.
- **"View the prompt that built this"**: small `</>` button on key sections; opens a panel showing the actual prompt + commit hash that authored that section. Source: a `prompts.json` file you maintain by hand or scrape from session transcripts.

**Verify:**

- [ ] Inspector overlay works on at least 5 representative pages without console errors
- [ ] GitHub city loads in < 1.5s on a warm cache, < 4s cold
- [ ] Email demo renders correctly in all three tab modes
- [ ] "View the prompt" panels show real content, not lorem ipsum

---

### Phase 8 · Polish & launch

**Goal:** Production-ready. Soft launch.

**Outputs:**

- `web/app/sitemap.ts`, `web/app/robots.ts`
- OG image generator at `web/app/og/route.tsx` using `@vercel/og` (works on Netlify too)
- Per-route metadata (`generateMetadata`) with canonical URLs
- Funnel analytics: lightweight first-party tracker → FastAPI → SQLite `funnel_events`. Events: `page_view`, `cta_click`, `download_resume`, `contact_submit`, `chat_message`, `achievement_unlocked`. No third-party trackers.
- A small public `/stats` panel in `/system` showing the funnel (eats own dog food)
- Final Lighthouse + axe gates as required checks in CI
- 404 + error pages styled with the OS shell
- Soft launch — share with 3–5 trusted friends, fix glaring issues, then post to LinkedIn / Mastodon / Bluesky

**Verify:**

- [ ] All CI checks pass on `main`
- [ ] Lighthouse ≥ 98 perf, 100 a11y, 100 best-practices, 100 SEO on `/`, `/blog`, a representative blog post, `/playground`
- [ ] No console errors in production build
- [ ] OG image renders correctly when posting URL to Slack/X/Bluesky
- [ ] Sitemap lists every public route
- [ ] All achievements unlockable end-to-end

---

## 3 · Cross-cutting standards

### Accessibility

- Target: **WCAG 2.2 AA** minimum, AAA where cheap.
- Every interactive element keyboard-reachable with a visible focus ring.
- Every animation respects `prefers-reduced-motion`. Test with macOS "Reduce motion" enabled.
- Colors meet contrast ratios in both themes. Verify with axe + manual contrast checker.
- Screen-reader pass on hero, blog post, and the AI chat. Use VoiceOver on macOS.

### Performance budget

- Initial JS ≤ 150 KB gzipped on `/`
- Hero panel LCP ≤ 2.0s on a throttled 4G profile
- No third-party scripts on first paint (analytics is first-party)
- Heavy panels (GitHub city, Bug Hunt) lazy-loaded behind route boundaries

### Testing

- **Unit:** Vitest for `web/`; pytest for `api/`. Components: render + interaction tests for the OS shell, theme toggle, achievement store, MDX renderer, AI streaming hook.
- **E2E:** Playwright for the golden paths — landing → download résumé, landing → contact submit, landing → chat with AI, blog post → speed_reader unlock, palette → navigate.
- **Visual regression:** optional — Playwright `toHaveScreenshot()` on hero in both themes.

### CI (.github/workflows/ci.yml)

- On PR: typecheck, lint, unit tests, build (`web/`); ruff, mypy, pytest (`api/`).
- On `main`: above + Lighthouse CI + axe-core + Playwright headless against preview deploy.
- Required checks: all of the above before merge.

### Security

- Never expose the Anthropic API key, GitHub PAT, Resend key, or any other backend secret to the browser.
- All external API calls go through FastAPI; the Next.js side only sees `api.gitaddmason.dev`.
- Rate-limit every public POST endpoint.
- CSP headers configured in `netlify.toml`.
- Contact form: honeypot + Turnstile (Cloudflare) for spam.

### Observability

- FastAPI logs structured JSON to stdout; Fly captures.
- Frontend errors → first-party `/api/errors` endpoint (no Sentry needed for v1).
- Uptime check on `/health` from an external pinger (UptimeRobot or your own Uptime.com — fitting).

---

## 4 · Definition of done (overall site)

- [ ] Every phase's verify list passes
- [ ] Every public page passes Lighthouse + axe gates
- [ ] All 11 (or 13 with Bug Hunt) achievements unlockable, persisted, surfaced
- [ ] Light + dark mode parity — no broken contrast or missed components
- [ ] Domain serves over HTTPS, HSTS preloaded
- [ ] `gitaddmason.dev/feed.xml` validates
- [ ] One round of feedback from 3+ trusted reviewers applied
- [ ] Soft launch post drafted

---

## 5 · Backlog / explicitly deferred

- Comments on blog posts (reactions only in v1)
- Authentication / user accounts beyond opt-in email for achievement sync
- Native mobile app — responsive web is the target
- A multi-language version of the site
- The other interactive games beyond Bug Hunt (type-the-prompt, terminal RPG)
- A second marquee mini-game

Reconsider after launch based on which sections recruiters spend time on (funnel data).

---

## 6 · Working with Claude Code on this build

- Phases are intentionally sized so a single session can land one phase end-to-end without exceeding ~30k tokens of context.
- When you start a new session: read `CLAUDE.md`, then jump to the current phase here. Don't try to keep the whole doc in mind at once.
- Always run the verify checklist in the browser, not just `tsc`. A type-check pass is not a feature-works signal.
- Commit at every passing verify. Push at every passing phase. Deploy preview at every push.
- If a phase needs to slip, write what's missing in the phase's verify list as failing checkboxes before moving on. Future sessions will see the gap.
