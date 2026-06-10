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

    # Login brute-force koruması (IP başına başarısız deneme)
    login_max_attempts: int = 8          # bu kadar başarısız denemeden sonra
    login_window_seconds: int = 15 * 60  # bu pencere içinde
    login_block_seconds: int = 15 * 60   # bu süre boyunca kilitle

    # İletişim formu (SMTP ile gerçek e-posta gönderimi)
    smtp_host: str = ""          # ör. smtp.gmail.com — boşsa form devre dışı (503)
    smtp_port: int = 587         # 587 (STARTTLS) veya 465 (SSL)
    smtp_user: str = ""          # SMTP kullanıcı (genelde gönderen e-posta)
    smtp_password: str = ""      # SMTP/uygulama şifresi
    smtp_starttls: bool = True   # 587 için True, 465 için False (SSL)
    contact_to: str = "kondakci.k@gmail.com"  # mesajların gideceği adres
    contact_from: str = ""       # boşsa smtp_user kullanılır
    contact_max_per_hour: int = 5  # IP başına saatlik gönderim limiti (spam koruması)

    # Tüm rotaların ön eki
    api_prefix: str = "/api"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
