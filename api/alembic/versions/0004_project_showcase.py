"""projects showcase alanlari + ortak kategori taksonomisi

Revision ID: 0004_project_showcase
Revises: 0003_services
Create Date: 2026-09-16
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0004_project_showcase"
down_revision: Union[str, None] = "0003_services"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "projects",
        sa.Column("category", sa.String(length=32), nullable=False, server_default="other"),
    )
    op.add_column(
        "projects",
        sa.Column("client_name", sa.String(length=255), nullable=False, server_default=""),
    )
    op.add_column(
        "projects",
        sa.Column("role_tr", sa.String(length=255), nullable=False, server_default=""),
    )
    op.add_column(
        "projects",
        sa.Column("role_en", sa.String(length=255), nullable=False, server_default=""),
    )
    op.add_column(
        "projects", sa.Column("results_tr", sa.JSON(), nullable=False, server_default="[]")
    )
    op.add_column(
        "projects", sa.Column("results_en", sa.JSON(), nullable=False, server_default="[]")
    )
    op.add_column(
        "projects", sa.Column("gallery", sa.JSON(), nullable=False, server_default="[]")
    )
    op.create_index("ix_projects_category", "projects", ["category"])

    # Services and projects now share one taxonomy; "chatbot" became "ai".
    op.execute("UPDATE services SET category = 'ai' WHERE category = 'chatbot'")


def downgrade() -> None:
    op.execute("UPDATE services SET category = 'chatbot' WHERE category = 'ai'")
    op.drop_index("ix_projects_category", table_name="projects")
    op.drop_column("projects", "gallery")
    op.drop_column("projects", "results_en")
    op.drop_column("projects", "results_tr")
    op.drop_column("projects", "role_en")
    op.drop_column("projects", "role_tr")
    op.drop_column("projects", "client_name")
    op.drop_column("projects", "category")
