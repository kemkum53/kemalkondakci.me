"""mevcut projelere calisma alani atar

Revision ID: 0005_project_categories
Revises: 0004_project_showcase
Create Date: 2026-09-16

0004 kategori sutununu "other" varsayilaniyla ekliyor. Bu migration olmadan
dagitimdan sonra butun projeler "other" kalir ve vitrin sayfalari bos acilir.
Asagidaki eslemede olmayan slug'lar "other" olarak kalir; admin panelden
degistirilebilir.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0005_project_categories"
down_revision: Union[str, None] = "0004_project_showcase"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

CATEGORIES: dict[str, tuple[str, ...]] = {
    "web": (
        "kemalkondakci-me",
        "korede",
        "evrensel-yapi-teknolojileri",
    ),
    "ai": (
        "whatsapp-instagram-ai-assistant",
        "multi-agent-ai-system",
        "buddai",
        "safeeye",
        "car-cam",
        "lucido",
        "desktop-vision-app",
        "elter",
    ),
    "automation": (
        "dxf-to-stl-pipeline",
    ),
}


def upgrade() -> None:
    projects = sa.table(
        "projects", sa.column("slug", sa.String), sa.column("category", sa.String)
    )
    for category, slugs in CATEGORIES.items():
        op.execute(
            projects.update()
            .where(projects.c.slug.in_(slugs))
            .values(category=category)
        )


def downgrade() -> None:
    projects = sa.table(
        "projects", sa.column("slug", sa.String), sa.column("category", sa.String)
    )
    every = tuple(s for slugs in CATEGORIES.values() for s in slugs)
    op.execute(
        projects.update().where(projects.c.slug.in_(every)).values(category="other")
    )
