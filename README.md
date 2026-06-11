# kemalkondakci.me

My personal CV / portfolio and bilingual (TR/EN) blog — a multi-service,
fully Dockerized application I designed, built and run in production.

**Live:** https://kemalkondakci.me

> Next.js 16 · FastAPI · PostgreSQL · Docker Compose · Traefik · GitHub Actions

---

## Highlights

- **Bilingual content engine** — blog posts and projects (TR/EN) managed from a
  custom admin panel with a rich-text editor; publish without deploying code.
- **BFF security** — the JWT lives in an httpOnly, encrypted cookie; the browser
  never talks to the backend directly. Server-side HTML sanitization (nh3).
- **Interactive CV** — experience timeline, skills, DB-driven selected projects,
  and a designed bilingual **PDF export**.
- **Real contact form** — FastAPI + SMTP, with a honeypot and per-IP rate limiting.
- **Hardened admin login** — in-memory brute-force protection (per-IP) and
  security headers.
- **Privacy-first analytics** — self-hosted [Umami](https://umami.is) (cookieless).
- **CI/CD** — test → build → push to GHCR → deploy, on every push to `main`.

## Architecture

```
                              Internet  (HTTPS via Cloudflare)
                                  │
                            ┌─────┴─────┐
                            │  Traefik  │  reverse proxy + Let's Encrypt
                            └──┬─────┬──┘
              ┌────────────────┘     └───────────────┐
        ┌─────┴─────┐                          ┌──────┴──────┐
        │  front    │ Next.js 16 (App Router)  │   umami     │ self-hosted,
        │ (Next.js) │ • public site + admin    │ (analytics) │ privacy-first
        └─────┬─────┘ • BFF: JWT in cookie     └─────────────┘
              │ internal network
        ┌─────┴─────┐ FastAPI (Python) — REST API
        │   api     │ • JWT auth, content CRUD, image upload
        │ (FastAPI) │ • nh3 sanitization, SMTP contact, rate limiting
        └─────┬─────┘ • OpenAPI: /api/docs
              │ internal network
        ┌─────┴─────┐ PostgreSQL 16
        │    db     │ • SQLAlchemy + Alembic migrations
        └───────────┘
```

- **`front/`** — Next.js 16, TypeScript. Public site + admin panel. Acts as a
  Backend-for-Frontend: it holds the JWT in an httpOnly cookie and proxies
  `/api/*` to the backend server-side, so the API is never exposed to the browser.
- **`api/`** — FastAPI + SQLAlchemy + Alembic + PostgreSQL.
- **`db` and `api` are never exposed publicly** (internal network only); only
  **`front`** is published through Traefik.

## Local development

```bash
# 1) Backend
cd api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # fill JWT_SECRET, ADMIN_PASSWORD_HASH, (SMTP_* optional)
alembic upgrade head
uvicorn app.main:app --reload --port 8000

# 2) Frontend
cd front
npm install
npm run dev                     # http://localhost:3000  (/api/* → http://localhost:8000)
```

Generate the admin password hash:

```bash
cd api && python -m app.set_admin <password>   # paste output into api/.env > ADMIN_PASSWORD_HASH
```

> Note: bcrypt hashes contain `$`. When placed in a Docker `env_file`, escape every
> `$` as `$$` (Compose interpolates `env_file` values).

## Production (Docker Compose)

```bash
cp .env.example .env            # POSTGRES_*, SESSION_SECRET
cp api/.env.example api/.env    # JWT_SECRET, ADMIN_PASSWORD_HASH, SMTP_*
docker compose up -d --build
```

Three services: `db` (Postgres + volume), `api` (Alembic migrations → uvicorn),
`front` (Next.js, published via Traefik). Uploaded images and the database live
in persistent volumes.

## Testing

```bash
cd api && .venv/bin/python -m pytest    # 45 tests: auth, rate-limit, CRUD, sanitize, contact, uploads
cd front && npm test                    # Vitest + Testing Library (component tests)
```

## CI/CD (GitHub Actions)

`.github/workflows/ci.yml` runs on every push to `main` and on pull requests.

```
   push to main
      │
      ├─ test-api    (pytest)   ┐ parallel
      ├─ test-front  (vitest)   ┘
      │
      ├─ build-api    ◀ needs: test-api    → image → GHCR
      ├─ build-front  ◀ needs: test-front  → image → GHCR
      │
      └─ deploy       ◀ needs: builds       → SSH: docker compose pull && up -d
```

A broken test blocks the image build and the deploy — nothing reaches production
unless tests pass.

## API documentation

Auto-generated OpenAPI / Swagger at `/api/docs` (and `/api/redoc`).

## License

Code is released under the [MIT License](./LICENSE). Personal content, copy, CV
data and images are © Kemal Kondakçı.
