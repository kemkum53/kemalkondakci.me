import re
from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator, model_validator
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """API'de camelCase anahtarlar (frontend ile uyum); içeride snake_case okunabilir."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


# --- Contact ---
_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class ContactIn(CamelModel):
    name: str
    email: str
    subject: str = ""
    message: str
    company: str = ""  # honeypot — botlar doldurur, gerçek kullanıcı boş bırakır

    @field_validator("name", "email", "subject", "message", "company")
    @classmethod
    def _strip(cls, v: str) -> str:
        return v.strip()

    @field_validator("name")
    @classmethod
    def _name(cls, v: str) -> str:
        if not (2 <= len(v) <= 100):
            raise ValueError("İsim 2-100 karakter olmalı.")
        return v

    @field_validator("email")
    @classmethod
    def _email(cls, v: str) -> str:
        if len(v) > 200 or not _EMAIL_RE.match(v):
            raise ValueError("Geçerli bir e-posta gerekli.")
        return v

    @field_validator("subject")
    @classmethod
    def _subject(cls, v: str) -> str:
        if len(v) > 150:
            raise ValueError("Konu en fazla 150 karakter.")
        return v

    @field_validator("message")
    @classmethod
    def _message(cls, v: str) -> str:
        if not (10 <= len(v) <= 5000):
            raise ValueError("Mesaj 10-5000 karakter olmalı.")
        return v


# --- Auth ---
class LoginIn(CamelModel):
    username: str
    password: str


class TokenOut(CamelModel):
    access_token: str
    token_type: str = "bearer"


# --- Posts ---
class PostIn(CamelModel):
    title_tr: str = ""
    title_en: str = ""
    excerpt_tr: str = ""
    excerpt_en: str = ""
    content_tr: str = ""
    content_en: str = ""
    cover_image: str | None = None
    slug: str | None = None
    status: str = "draft"


class AutosaveIn(CamelModel):
    id: str | None = None
    title_tr: str = ""
    title_en: str = ""
    excerpt_tr: str = ""
    excerpt_en: str = ""
    content_tr: str = ""
    content_en: str = ""
    cover_image: str | None = None
    slug: str | None = None


class PostOut(CamelModel):
    id: str
    slug: str
    status: str
    cover_image: str | None
    title_tr: str
    title_en: str
    excerpt_tr: str
    excerpt_en: str
    content_tr: str
    content_en: str
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime


class AutosaveOut(CamelModel):
    id: str
    saved_at: datetime


class UploadOut(CamelModel):
    location: str


# --- Projects ---
class ProjectIn(CamelModel):
    name: str = ""
    slug: str | None = None
    status: str = "draft"
    cover_image: str | None = None
    short_desc_tr: str = ""
    short_desc_en: str = ""
    content_tr: str = ""
    content_en: str = ""
    tech_stack: list[str] = []
    repo_url: str | None = None
    live_url: str | None = None
    featured: bool = False
    position: int = 0


class ProjectOut(CamelModel):
    id: str
    slug: str
    status: str
    name: str
    cover_image: str | None
    short_desc_tr: str
    short_desc_en: str
    content_tr: str
    content_en: str
    tech_stack: list[str]
    repo_url: str | None
    live_url: str | None
    featured: bool
    position: int
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime


# --- Services ---
PRICE_TYPES = {"range", "from", "fixed", "quote"}
SERVICE_CATEGORIES = {"web", "chatbot", "automation", "devops", "other"}
CURRENCIES = {"TRY", "USD", "EUR"}


class ServiceReference(CamelModel):
    """Karttaki referans/demo linki. Etiket boşsa alan adından türetilir."""

    label: str = ""
    url: str

    @field_validator("url")
    @classmethod
    def _url(cls, v: str) -> str:
        v = v.strip()
        if not v.startswith(("http://", "https://")):
            raise ValueError("Referans linki http:// veya https:// ile başlamalı.")
        if len(v) > 1024:
            raise ValueError("Referans linki çok uzun.")
        return v

    @field_validator("label")
    @classmethod
    def _label(cls, v: str) -> str:
        return v.strip()[:120]


class ServiceIn(CamelModel):
    category: str = "other"
    icon: str = ""
    name_tr: str = ""
    name_en: str = ""
    short_desc_tr: str = ""
    short_desc_en: str = ""
    features_tr: list[str] = []
    features_en: list[str] = []

    price_type: str = "quote"
    setup_price_min: int | None = None
    setup_price_max: int | None = None
    monthly_price: int | None = None
    currency: str = "TRY"
    price_note_tr: str = ""
    price_note_en: str = ""

    delivery_min_days: int | None = None
    delivery_max_days: int | None = None
    delivery_note_tr: str = ""
    delivery_note_en: str = ""

    references: list[ServiceReference] = []

    tags: list[str] = []
    featured: bool = False
    position: int = 0
    slug: str | None = None
    status: str = "draft"

    @field_validator("category")
    @classmethod
    def _category(cls, v: str) -> str:
        return v if v in SERVICE_CATEGORIES else "other"

    @field_validator("price_type")
    @classmethod
    def _price_type(cls, v: str) -> str:
        if v not in PRICE_TYPES:
            raise ValueError("Geçersiz fiyat tipi.")
        return v

    @field_validator("currency")
    @classmethod
    def _currency(cls, v: str) -> str:
        if v not in CURRENCIES:
            raise ValueError("Geçersiz para birimi.")
        return v

    @field_validator(
        "setup_price_min", "setup_price_max", "monthly_price",
        "delivery_min_days", "delivery_max_days",
    )
    @classmethod
    def _non_negative(cls, v: int | None) -> int | None:
        if v is not None and v < 0:
            raise ValueError("Negatif değer olamaz.")
        return v

    @model_validator(mode="after")
    def _ranges(self) -> "ServiceIn":
        if (
            self.setup_price_min is not None
            and self.setup_price_max is not None
            and self.setup_price_max < self.setup_price_min
        ):
            raise ValueError("Üst fiyat alt fiyattan küçük olamaz.")
        if (
            self.delivery_min_days is not None
            and self.delivery_max_days is not None
            and self.delivery_max_days < self.delivery_min_days
        ):
            raise ValueError("Üst süre alt süreden küçük olamaz.")
        return self


class ServiceOut(CamelModel):
    id: str
    slug: str
    status: str
    category: str
    icon: str
    name_tr: str
    name_en: str
    short_desc_tr: str
    short_desc_en: str
    features_tr: list[str]
    features_en: list[str]
    price_type: str
    setup_price_min: int | None
    setup_price_max: int | None
    monthly_price: int | None
    currency: str
    price_note_tr: str
    price_note_en: str
    delivery_min_days: int | None
    delivery_max_days: int | None
    delivery_note_tr: str
    delivery_note_en: str
    references: list[ServiceReference]
    tags: list[str]
    featured: bool
    position: int
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime
