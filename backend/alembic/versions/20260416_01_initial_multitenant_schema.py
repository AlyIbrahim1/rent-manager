"""initial multitenant schema

Revision ID: 20260416_01
Revises:
Create Date: 2026-04-16 00:00:00.000000
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "20260416_01"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "tenants",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("owner_user_id", sa.String(length=36), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "tenant_memberships",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("tenant_id", sa.String(length=36), nullable=False),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("role", sa.String(length=50), nullable=False),
        sa.ForeignKeyConstraint(["tenant_id"], ["tenants.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("tenant_id", "user_id", name="uq_tenant_membership"),
    )
    op.create_table(
        "renters",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("tenant_id", sa.String(length=36), nullable=False),
        sa.Column("appartmentNumber", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("rentAmount", sa.Integer(), nullable=False),
        sa.Column("lastMonthPayed", sa.String(length=7), nullable=True),
        sa.ForeignKeyConstraint(["tenant_id"], ["tenants.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "leases",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("tenant_id", sa.String(length=36), nullable=False),
        sa.Column("renter_id", sa.String(length=36), nullable=False),
        sa.Column("startDate", sa.String(length=10), nullable=False),
        sa.Column("endDate", sa.String(length=10), nullable=False),
        sa.Column("depositAmount", sa.Integer(), nullable=False),
        sa.Column("depositStatus", sa.String(length=20), nullable=False),
        sa.Column("renewalNotes", sa.String(length=500), nullable=True),
        sa.ForeignKeyConstraint(["renter_id"], ["renters.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["tenant_id"], ["tenants.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "payments",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("tenant_id", sa.String(length=36), nullable=False),
        sa.Column("renter_id", sa.String(length=36), nullable=False),
        sa.Column("monthPaid", sa.String(length=7), nullable=False),
        sa.Column("amountPaid", sa.Integer(), nullable=False),
        sa.Column("dateRecorded", sa.String(length=10), nullable=False),
        sa.ForeignKeyConstraint(["renter_id"], ["renters.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["tenant_id"], ["tenants.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "receipts",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("tenant_id", sa.String(length=36), nullable=False),
        sa.Column("payment_id", sa.String(length=36), nullable=False),
        sa.Column("path", sa.String(length=500), nullable=False),
        sa.Column("downloadUrl", sa.String(length=1000), nullable=False),
        sa.ForeignKeyConstraint(["payment_id"], ["payments.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["tenant_id"], ["tenants.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("receipts")
    op.drop_table("payments")
    op.drop_table("leases")
    op.drop_table("renters")
    op.drop_table("tenant_memberships")
    op.drop_table("tenants")
