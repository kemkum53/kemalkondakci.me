"""posts tablosu

Revision ID: 0001_init
Revises:
Create Date: 2026-06-05
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0001_init"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "posts",
        sa.Column("id", sa.String(length=32), primary_key=True),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False, server_default="draft"),
        sa.Column("cover_image", sa.String(length=1024), nullable=True),
        sa.Column("title_tr", sa.String(length=512), nullable=False, server_default=""),
        sa.Column("title_en", sa.String(length=512), nullable=False, server_default=""),
        sa.Column("excerpt_tr", sa.Text(), nullable=False, server_default=""),
        sa.Column("excerpt_en", sa.Text(), nullable=False, server_default=""),
        sa.Column("content_tr", sa.Text(), nullable=False, server_default=""),
        sa.Column("content_en", sa.Text(), nullable=False, server_default=""),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_posts_slug", "posts", ["slug"], unique=True)
    op.create_index("ix_posts_status", "posts", ["status"])


def downgrade() -> None:
    op.drop_index("ix_posts_status", table_name="posts")
    op.drop_index("ix_posts_slug", table_name="posts")
    op.drop_table("posts")
