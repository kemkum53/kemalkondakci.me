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


class Service(Base):
    """Çift dilli hizmet kalemi: kapsam, fiyat ve teslim süresi. /services sayfası için."""

    __tablename__ = "services"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    status: Mapped[str] = mapped_column(String(16), default="draft", index=True)

    category: Mapped[str] = mapped_column(String(32), default="other", index=True)
    icon: Mapped[str] = mapped_column(String(16), default="")  # emoji

    name_tr: Mapped[str] = mapped_column(String(255), default="")
    name_en: Mapped[str] = mapped_column(String(255), default="")
    short_desc_tr: Mapped[str] = mapped_column(Text, default="")
    short_desc_en: Mapped[str] = mapped_column(Text, default="")

    # Kapsam maddeleri ("Ödeme entegrasyonu", "Yönetim paneli", ...)
    features_tr: Mapped[list] = mapped_column(JSON, default=list)
    features_en: Mapped[list] = mapped_column(JSON, default=list)

    # Fiyat: price_type kurulum bedelinin nasıl gösterileceğini belirler,
    # monthly_price ondan bağımsız olarak "aylık" satırı olarak görünür.
    price_type: Mapped[str] = mapped_column(String(16), default="quote")
    setup_price_min: Mapped[int | None] = mapped_column(Integer, nullable=True)
    setup_price_max: Mapped[int | None] = mapped_column(Integer, nullable=True)
    monthly_price: Mapped[int | None] = mapped_column(Integer, nullable=True)
    currency: Mapped[str] = mapped_column(String(8), default="TRY")
    price_note_tr: Mapped[str] = mapped_column(String(255), default="")
    price_note_en: Mapped[str] = mapped_column(String(255), default="")

    # Teslim süresi (gün). Serbest metin notu istisnalar için.
    delivery_min_days: Mapped[int | None] = mapped_column(Integer, nullable=True)
    delivery_max_days: Mapped[int | None] = mapped_column(Integer, nullable=True)
    delivery_note_tr: Mapped[str] = mapped_column(String(255), default="")
    delivery_note_en: Mapped[str] = mapped_column(String(255), default="")

    # Referans/demo siteleri: [{"label": "korede.com.tr", "url": "https://..."}]
    references: Mapped[list] = mapped_column(JSON, default=list)

    tags: Mapped[list] = mapped_column(JSON, default=list)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    position: Mapped[int] = mapped_column(Integer, default=0)

    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
