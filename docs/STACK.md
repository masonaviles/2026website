# mason.os — Stack reference

Companion to [`BUILD.md`](BUILD.md). The canonical inventory of services, env vars, and deploy targets. Update this any time something changes; future Claude Code sessions read this before touching infrastructure.

## Hosts

| Service | Purpose | URL | CLI |
|---|---|---|---|
| Netlify | Next.js frontend | `gitaddmason.dev` | `netlify` |
| Fly.io | FastAPI backend + SQLite volume | `api.gitaddmason.dev` | `flyctl` |
| Anthropic | Claude API | api.anthropic.com | n/a |
| GitHub | Repo + activity data | `github.com/masonaviles/gitaddmason.dev` | `gh` |
| Resend (optional) | Contact-form notification email | resend.com | n/a |

There is no separate database service. FastAPI owns persistence in SQLite, stored on a mounted Fly volume.

## Environment variables

### `web/.env.local` (Netlify dashboard for prod)

| Name | Purpose | Required from |
|---|---|---|
| `NEXT_PUBLIC_API_BASE` | FastAPI base URL | Phase 0 |
| `NEXT_PUBLIC_SITE_URL` | canonical site URL (used for OG, sitemap, RSS) | Phase 0 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile, contact form | Phase 1 |
| `NEXT_PUBLIC_ENABLE_PLAYGROUND` | feature flag for AI demos | Phase 4 |

No secrets in `NEXT_PUBLIC_*`. Anything else stays server-side only.

### `api/.env` (Fly secrets for prod)

| Name | Purpose | Required from |
|---|---|---|
| `DATABASE_URL` | SQLAlchemy URL, e.g. `sqlite+aiosqlite:////data/mason.db` in prod, `sqlite+aiosqlite:///./data/mason.db` locally | Phase 0 |
| `ANTHROPIC_API_KEY` | Claude calls | Phase 4 |
| `GITHUB_TOKEN` | GitHub city, fine-grained PAT | Phase 7 |
| `TURNSTILE_SECRET` | contact form verify | Phase 1 |
| `RESEND_API_KEY` | optional contact-notification email | Phase 1 |
| `ALLOWED_ORIGINS` | CORS allowlist, e.g. `https://gitaddmason.dev` | Phase 0 |
| `RATE_LIMIT_REDIS_URL` | optional, defaults to in-memory | Phase 4 |

Set in Fly: `flyctl secrets set ANTHROPIC_API_KEY=... -a mason-os-api`

### Local `.env.example` files

Both `web/.env.example` and `api/.env.example` must exist and list every variable used, with placeholder values. CI ensures `.env.example` files are checked in but real `.env` files are gitignored.

## Database schema (SQLite via SQLAlchemy + Alembic)

The SQLite file lives at `/data/mason.db` in production (Fly volume mount) and `api/data/mason.db` locally. The `data/` directory is gitignored.

Initial tables (created in Phase 1 and extended later):

```sql
-- contacts: contact form submissions (Phase 1)
create table contacts (
  id integer primary key autoincrement,
  name text not null,
  email text not null,
  message text not null,
  source_ip text,
  created_at text not null default (datetime('now'))
);

-- achievement_syncs: opt-in cross-device achievement sync (Phase 5)
create table achievement_syncs (
  email text primary key,
  unlocked text not null,           -- JSON-encoded
  updated_at text not null default (datetime('now'))
);

-- blog_reactions: like-style counters per post (Phase 3, optional)
create table blog_reactions (
  slug text not null,
  reaction text not null,
  count integer not null default 0,
  primary key (slug, reaction)
);

-- github_cache: cached GitHub activity for the skyline viz (Phase 7)
create table github_cache (
  key text primary key,
  data text not null,               -- JSON-encoded
  fetched_at text not null default (datetime('now'))
);

-- funnel_events: first-party analytics (Phase 8)
create table funnel_events (
  id integer primary key autoincrement,
  event text not null,
  props text,                       -- JSON-encoded
  session_id text,
  created_at text not null default (datetime('now'))
);
create index idx_funnel_event on funnel_events(event);
create index idx_funnel_created on funnel_events(created_at);

-- bug_hunt_scores: optional leaderboard (Phase 6)
create table bug_hunt_scores (
  id integer primary key autoincrement,
  handle text not null,
  puzzle_id text not null,
  solved_in_seconds integer not null,
  created_at text not null default (datetime('now'))
);
```

Migrations live in `api/alembic/versions/`. Apply via `cd api && alembic upgrade head` locally, and via the Dockerfile entrypoint (`alembic upgrade head && uvicorn ...`) in production.

### Backup strategy

- Daily snapshot of the Fly volume via `flyctl volumes snapshots create mason_data`.
- Optional weekly export: a small `scripts/backup.py` that dumps key tables to a JSON file and uploads to Backblaze B2 / R2 if `BACKUP_BUCKET` is set.

## Deploy commands

```bash
# Web (Netlify)
cd web && pnpm build && netlify deploy --prod

# API (Fly) — Dockerfile entrypoint runs `alembic upgrade head` then `uvicorn`
cd api && flyctl deploy

# Volume management (rarely needed)
flyctl volumes list -a mason-os-api
flyctl volumes snapshots create <volume-id>
```

CI handles all of the above on `main`. Manual deploy is the escape hatch.

## DNS

Hosted on Netlify DNS for `gitaddmason.dev`.

| Record | Type | Target |
|---|---|---|
| `@` | A / ALIAS | Netlify load balancer |
| `www` | CNAME | `gitaddmason.dev` |
| `api` | CNAME | `mason-os-api.fly.dev` |

TLS via Netlify + Fly auto-cert.

## Anthropic configuration

- **Default models:** Claude Sonnet 4.6 (`claude-sonnet-4-6`) for chat; Claude Opus 4.7 (`claude-opus-4-7`) for cover-letter generation.
- **Prompt caching:** the resume + voice/tone block is the cached prefix. Cache TTL 5 minutes; warm it with a no-op call if needed before high-traffic moments.
- **Spend cap:** set in Anthropic Console. Suggested initial cap: $50/mo with email alerts.
- **Streaming:** SSE end-to-end. Server reads the Anthropic SDK stream and re-emits chunks unbuffered.
