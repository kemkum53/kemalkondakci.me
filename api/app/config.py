from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Ortam değişkenlerinden okunan uygulama ayarları."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Veritabanı
    database_url: str = "postgresql+psycopg2://blog:blog@localhost:5432/blog"

    # JWT
    jwt_secret: str = "dev-only-change-me-please-32chars-minimum-secret"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # 7 gün

    # Admin kimlik bilgileri (tek kullanıcı)
    admin_username: str = "admin"
    admin_password_hash: str = ""  # bcrypt; `python -m app.set_admin <şifre>` ile üret

    # Yüklemeler
    uploads_dir: str = "/app/uploads"
    max_upload_bytes: int = 5 * 1024 * 1024  # 5 MB

    # CORS (yerel geliştirme için frontend kökenleri)
    cors_origins: list[str] = ["http://localhost:3000"]

    # Tüm rotaların ön eki
    api_prefix: str = "/api"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
