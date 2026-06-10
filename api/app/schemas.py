import re
from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator
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
