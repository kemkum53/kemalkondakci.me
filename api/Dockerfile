FROM python:3.13-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Not: psycopg2-binary, bcrypt, nh3 hepsi hazır "wheel" olarak gelir; kendi
# C kütüphanelerini taşırlar. Bu yüzden ayrıca libpq5/derleyici kurmaya GEREK YOK.
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chmod +x ./docker-entrypoint.sh

# non-root kullanıcı
RUN useradd -m -u 1001 appuser \
    && mkdir -p /app/uploads \
    && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
