import uuid

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Lease(Base):
    __tablename__ = "leases"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id: Mapped[str] = mapped_column(ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    renter_id: Mapped[str] = mapped_column(ForeignKey("renters.id", ondelete="CASCADE"), nullable=False)
    startDate: Mapped[str] = mapped_column(String(10), nullable=False)
    endDate: Mapped[str] = mapped_column(String(10), nullable=False)
    depositAmount: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    depositStatus: Mapped[str] = mapped_column(String(20), nullable=False, default="unpaid")
    renewalNotes: Mapped[str | None] = mapped_column(String(500), nullable=True)
