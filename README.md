# kemalkondakci.me

Kişisel CV / portföy sitesi ve çift dilli (TR/EN) blog. Çok servisli, Dockerize
bir mimariyle çalışır.

## Mimari

```
                         ┌─────────────┐
   İnternet ── Traefik ──│  front      │  Next.js 16 (App Router) — BFF
   (HTTPS)               │  (Next.js)  │  • Site + admin paneli (TinyMCE)
                         └──────┬──────┘  • JWT'yi httpOnly cookie'de tutar
                                │ (iç ağ)
                         ┌──────┴──────┐
                         │  api        │  FastAPI (Python) — REST API
                         │  (FastAPI)  │  • JWT auth, post CRUD, görsel yükleme
                         └──────┬──────┘  • OpenAPI: /api/docs
                                │ (iç ağ)
                         ┌──────┴──────┐
                         │  db         │  PostgreSQL 16
                         │ (Postgres)  │  • SQLAlchemy + Alembic migration
                         └─────────────┘
```

- **front/** — Next.js 16, TypeScript, Tailwind. Public site + admin paneli.
  Backend'e yalnızca sunucu tarafından (Bearer JWT ile) konuşur; tarayıcıya
  backend doğrudan açılmaz (BFF deseni). `/api/*` istekleri backend'e proxy'lenir.
- **api/** — FastAPI + SQLAlchemy + Alembic + PostgreSQL. JWT kimlik doğrulama
  (httpOnly cookie'de saklanır), HTML sanitizasyonu (nh3), görsel yükleme.
- **db** ve **api** dışarı kapalı (sadece iç ağ); yalnızca **front** Traefik
  üzerinden yayınlanır.

## Geliştirme (yerel)

İki terminal:

```bash
# 1) Backend
cd api
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# Postgres'i ayağa kaldır (ör. docker run ... postgres) ve api/.env'i doldur
alembic upgrade head
uvicorn app.main:app --reload --port 8000

# 2) Frontend
cd front
npm install
npm run dev      # http://localhost:3000  (/api/* → http://localhost:8000)
```

Ortam dosyaları: `api/.env` (bkz. `api/.env.example`), `front/.env`
(bkz. `front/.env.example`).

Admin şifre hash'i üret:
```bash
cd api && python -m app.set_admin <şifre>   # çıktıyı api/.env > ADMIN_PASSWORD_HASH
```

## Üretim (Docker Compose)

Traefik'in `traefik_default` adlı external network'ü mevcut olmalı.

```bash
cp .env.example .env            # POSTGRES_*, SESSION_SECRET doldur
cp api/.env.example api/.env    # JWT_SECRET, ADMIN_PASSWORD_HASH doldur
docker compose up -d --build
```

Servisler: `db` (Postgres + volume), `api` (Alembic migration + uvicorn),
`front` (Next.js, Traefik ile yayında). Yüklenen görseller ve veritabanı
kalıcı volume'larda tutulur.

## Testler

```bash
# Backend (pytest — bellek/dosya SQLite ile, Postgres gerekmez)
cd api && .venv/bin/python -m pytest        # 30 test: auth, CRUD, sanitize, autosave, upload

# Frontend (Vitest + Testing Library)
cd front && npm test                        # BlogList + PostsTable bileşen testleri
```

## API dökümantasyonu

FastAPI otomatik OpenAPI/Swagger: `/api/docs` (ve `/api/redoc`).
