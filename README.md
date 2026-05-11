# mason.os

Personal portfolio for Mason Aviles — framed as an interactive "operating system." Phase 0 foundation; full build playbook in [`docs/BUILD.md`](docs/BUILD.md).

## Stack

| Layer | Tech | Host |
|---|---|---|
| Frontend | Next.js 16 · TypeScript · Tailwind 4 · Framer Motion · MDX | Netlify |
| Backend | FastAPI · Python 3.12 · SQLAlchemy · Alembic | Fly.io |
| Persistence | SQLite on Fly volume mounted at `/data` | Fly volume `mason_data` |
| AI | Anthropic API (Claude) | proxied via FastAPI |

See [`docs/STACK.md`](docs/STACK.md) for env vars, schema, and deploy commands.

## Layout

```
2026website/
├── CLAUDE.md                  # orientation for Claude Code sessions
├── docs/                      # BUILD, STACK, ACHIEVEMENTS specs
├── prototypes/                # design references (not deployed)
├── web/                       # Next.js (Netlify)
└── api/                       # FastAPI (Fly.io)
```

## Local development

### One-time setup

```bash
# Node toolchain
nvm install 22 && nvm use 22
corepack enable && corepack prepare pnpm@9 --activate

# Python toolchain
curl -LsSf https://astral.sh/uv/install.sh | sh

# Clone & install
git clone git@github.com:masonaviles/gitaddmason.dev.git
cd 2026website
pnpm install
cd api && uv sync && cd ..

# Copy env templates
cp web/.env.example web/.env.local
cp api/.env.example api/.env
```

### Run

```bash
# Web (in one terminal)
pnpm dev
# → http://localhost:3000

# API (in another)
cd api && uv run uvicorn app.main:app --reload
# → http://localhost:8000
```

### Tests

```bash
# Web
pnpm test

# API
cd api && uv run pytest
```

### Database

SQLite at `api/data/mason.db` locally, `/data/mason.db` on Fly. Migrations live in `api/alembic/versions/`.

```bash
cd api
uv run alembic upgrade head            # apply migrations
uv run alembic revision --autogenerate -m "add some table"
```

## Deploy

CI handles deploy on `main`. Manual escape hatches:

```bash
# Web
cd web && pnpm build && netlify deploy --prod

# API (runs `alembic upgrade head` then uvicorn via Dockerfile CMD)
cd api && flyctl deploy
```

Provisioning (one-time, before first deploy):

```bash
# Fly app + volume
flyctl apps create mason-os-api
flyctl volumes create mason_data --size 1 --region sjc -a mason-os-api
flyctl secrets set ALLOWED_ORIGINS="https://gitaddmason.dev,http://localhost:3000" -a mason-os-api

# Netlify site
netlify init                 # link or create new
netlify domains:add gitaddmason.dev
```
