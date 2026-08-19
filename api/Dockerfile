FROM python:3.13-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# apt upgrade: base image'in sistem paketlerini yamali surume cikarir.
# python:3.13-slim (debian 13) util-linux ailesini eski birakiyor -> CVE-2026-53615
# (libblkid integer overflow) bsdutils/libmount1/login dahil 9 pakete yansiyor.
RUN apt-get update && apt-get upgrade -y \
 && rm -rf /var/lib/apt/lists/*

# Not: psycopg2-binary, bcrypt, nh3 hepsi hazır "wheel" olarak gelir; kendi
# C kütüphanelerini taşırlar. Bu yüzden ayrıca libpq5/derleyici kurmaya GEREK YOK.
COPY requirements.txt ./
# pip/setuptools sil: uygulama calisirken ikisi de GEREKMEZ (sadece kurulum
#   araci). Base image'in pip'i kendi icinde eski msgpack tasir (GHSA-6v7p-g79w-8964),
#   setuptools ise CVE-2025-47273 (path traversal) icerir. Kurulum bittikten sonra
#   ikisini de atmak bu CVE'leri ve gereksiz saldiri yuzeyini birlikte kaldirir.
#   Ayni yaklasim front/Dockerfile'da npm icin de uygulaniyor.
RUN pip install --no-cache-dir -r requirements.txt \
 && SITE=$(python -c "import site; print(site.getsitepackages()[0])") \
 && rm -rf "$SITE"/pip "$SITE"/pip-*.dist-info \
           "$SITE"/setuptools "$SITE"/setuptools-*.dist-info \
           "$SITE"/pkg_resources \
           /usr/local/bin/pip /usr/local/bin/pip3 /usr/local/bin/pip3.13 \
 && python -c "import fastapi, alembic, uvicorn, sqlalchemy, jwt, nh3; print('runtime importlari tamam')"

COPY . .
RUN chmod +x ./docker-entrypoint.sh

# non-root kullanıcı
RUN useradd -m -u 1001 appuser \
    && mkdir -p /app/uploads \
    && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
