from typing import Any

from slugify import slugify
from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import Post


def unique_slug(
    db: Session, base: str, ignore_id: str | None = None, model: Any = Post
) -> str:
    """İstenen slug'ı benzersizleştirir (çakışırsa -2, -3 ... ekler).

    model: benzersizliğin hangi tabloda aranacağı (varsayılan Post).
    """
    root = slugify(base) or "yazi"
    candidate = root
    n = 1
    while True:
        existing = db.scalar(select(model).where(model.slug == candidate))
        if existing is None or existing.id == ignore_id:
            return candidate
        n += 1
        candidate = f"{root}-{n}"
