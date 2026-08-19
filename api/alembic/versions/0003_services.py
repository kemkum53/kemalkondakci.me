"""services tablosu

Revision ID: 0003_services
Revises: 0002_projects
Create Date: 2026-08-19
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0003_services"
down_revision: Union[str, None] = "0002_projects"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "services",
        sa.Column("id", sa.String(length=32), primary_key=True),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False, server_default="draft"),
        sa.Column("category", sa.String(length=32), nullable=False, server_default="other"),
        sa.Column("icon", sa.String(length=16), nullable=False, server_default=""),
        sa.Column("name_tr", sa.String(length=255), nullable=False, server_default=""),
        sa.Column("name_en", sa.String(length=255), nullable=False, server_default=""),
        sa.Column("short_desc_tr", sa.Text(), nullable=False, server_default=""),
        sa.Column("short_desc_en", sa.Text(), nullable=False, server_default=""),
        sa.Column("features_tr", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("features_en", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("price_type", sa.String(length=16), nullable=False, server_default="quote"),
        sa.Column("setup_price_min", sa.Integer(), nullable=True),
        sa.Column("setup_price_max", sa.Integer(), nullable=True),
        sa.Column("monthly_price", sa.Integer(), nullable=True),
        sa.Column("currency", sa.String(length=8), nullable=False, server_default="TRY"),
        sa.Column("price_note_tr", sa.String(length=255), nullable=False, server_default=""),
        sa.Column("price_note_en", sa.String(length=255), nullable=False, server_default=""),
        sa.Column("delivery_min_days", sa.Integer(), nullable=True),
        sa.Column("delivery_max_days", sa.Integer(), nullable=True),
        sa.Column("delivery_note_tr", sa.String(length=255), nullable=False, server_default=""),
        sa.Column("delivery_note_en", sa.String(length=255), nullable=False, server_default=""),
        sa.Column("references", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("tags", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("featured", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_services_slug", "services", ["slug"], unique=True)
    op.create_index("ix_services_status", "services", ["status"])
    op.create_index("ix_services_category", "services", ["category"])


def downgrade() -> None:
    op.drop_index("ix_services_category", table_name="services")
    op.drop_index("ix_services_status", table_name="services")
    op.drop_index("ix_services_slug", table_name="services")
    op.drop_table("services")
