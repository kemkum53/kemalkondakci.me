from slugify import slugify
from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Post


def unique_slug(db: Session, base: str, ignore_id: str | None = None) -> str:
    """İstenen slug'ı benzersizleştirir (çakışırsa -2, -3 ... ekler)."""
    root = slugify(base) or "yazi"
    candidate = root
    n = 1
    while True:
        existing = db.scalar(select(Post).where(Post.slug == candidate))
        if existing is None or existing.id == ignore_id:
            return candidate
        n += 1
        candidate = f"{root}-{n}"
