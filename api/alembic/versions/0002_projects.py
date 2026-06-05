"""projects tablosu

Revision ID: 0002_projects
Revises: 0001_init
Create Date: 2026-06-05
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0002_projects"
down_revision: Union[str, None] = "0001_init"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "projects",
        sa.Column("id", sa.String(length=32), primary_key=True),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False, server_default="draft"),
        sa.Column("name", sa.String(length=255), nullable=False, server_default=""),
        sa.Column("cover_image", sa.String(length=1024), nullable=True),
        sa.Column("short_desc_tr", sa.Text(), nullable=False, server_default=""),
        sa.Column("short_desc_en", sa.Text(), nullable=False, server_default=""),
        sa.Column("content_tr", sa.Text(), nullable=False, server_default=""),
        sa.Column("content_en", sa.Text(), nullable=False, server_default=""),
        sa.Column("tech_stack", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("repo_url", sa.String(length=1024), nullable=True),
        sa.Column("live_url", sa.String(length=1024), nullable=True),
        sa.Column("featured", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_projects_slug", "projects", ["slug"], unique=True)
    op.create_index("ix_projects_status", "projects", ["status"])


def downgrade() -> None:
    op.drop_index("ix_projects_status", table_name="projects")
    op.drop_index("ix_projects_slug", table_name="projects")
    op.drop_table("projects")
