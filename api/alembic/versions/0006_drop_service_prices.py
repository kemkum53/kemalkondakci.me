"""hizmetlerden fiyat alanlarini kaldirir

Revision ID: 0006_drop_service_prices
Revises: 0005_project_categories
Create Date: 2026-09-16

Fiyat artik sayfada yazmiyor, kapsam konusulduktan sonra teklifle veriliyor.
DIKKAT: upgrade sutunlari dusurur, icindeki rakamlar geri gelmez. Dagitimdan
once veritabani yedegi al. Downgrade sutunlari geri ekler ama bos olarak.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0006_drop_service_prices"
down_revision: Union[str, None] = "0005_project_categories"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column("services", "price_note_en")
    op.drop_column("services", "price_note_tr")
    op.drop_column("services", "currency")
    op.drop_column("services", "monthly_price")
    op.drop_column("services", "setup_price_max")
    op.drop_column("services", "setup_price_min")
    op.drop_column("services", "price_type")


def downgrade() -> None:
    op.add_column(
        "services",
        sa.Column("price_type", sa.String(length=16), nullable=False, server_default="quote"),
    )
    op.add_column("services", sa.Column("setup_price_min", sa.Integer(), nullable=True))
    op.add_column("services", sa.Column("setup_price_max", sa.Integer(), nullable=True))
    op.add_column("services", sa.Column("monthly_price", sa.Integer(), nullable=True))
    op.add_column(
        "services",
        sa.Column("currency", sa.String(length=8), nullable=False, server_default="TRY"),
    )
    op.add_column(
        "services",
        sa.Column("price_note_tr", sa.String(length=255), nullable=False, server_default=""),
    )
    op.add_column(
        "services",
        sa.Column("price_note_en", sa.String(length=255), nullable=False, server_default=""),
    )
