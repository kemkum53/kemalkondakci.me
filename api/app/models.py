import uuid
from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


def _uuid() -> str:
    return uuid.uuid4().hex


class Post(Base):
    """Çift dilli blog yazısı. Tek slug + tek yayın durumu paylaşır."""

    __tablename__ = "posts"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    status: Mapped[str] = mapped_column(String(16), default="draft", index=True)
    cover_image: Mapped[str | None] = mapped_column(String(1024), nullable=True)

    title_tr: Mapped[str] = mapped_column(String(512), default="")
    title_en: Mapped[str] = mapped_column(String(512), default="")
    excerpt_tr: Mapped[str] = mapped_column(Text, default="")
    excerpt_en: Mapped[str] = mapped_column(Text, default="")
    content_tr: Mapped[str] = mapped_column(Text, default="")
    content_en: Mapped[str] = mapped_column(Text, default="")

    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class Project(Base):
    """Çift dilli portföy projesi. Kart + detay sayfası için."""

    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    status: Mapped[str] = mapped_column(String(16), default="draft", index=True)

    name: Mapped[str] = mapped_column(String(255), default="")  # proje adı (ortak)
    cover_image: Mapped[str | None] = mapped_column(String(1024), nullable=True)

    short_desc_tr: Mapped[str] = mapped_column(Text, default="")  # kart açıklaması
    short_desc_en: Mapped[str] = mapped_column(Text, default="")
    content_tr: Mapped[str] = mapped_column(Text, default="")  # detay (sanitize HTML)
    content_en: Mapped[str] = mapped_column(Text, default="")

    tech_stack: Mapped[list] = mapped_column(JSON, default=list)  # ["Python", ...]
    repo_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    live_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)

    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    position: Mapped[int] = mapped_column(Integer, default=0)  # manuel sıralama

    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
