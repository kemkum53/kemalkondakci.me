#!/bin/sh
set -e

echo "→ Veritabanı migration'ları (alembic upgrade head)..."
alembic upgrade head

echo "→ FastAPI başlatılıyor (uvicorn :8000)..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
