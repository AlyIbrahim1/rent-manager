import uuid

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id: Mapped[str] = mapped_column(ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    renter_id: Mapped[str] = mapped_column(ForeignKey("renters.id", ondelete="CASCADE"), nullable=False)
    monthPaid: Mapped[str] = mapped_column(String(7), nullable=False)
    amountPaid: Mapped[int] = mapped_column(Integer, nullable=False)
    dateRecorded: Mapped[str] = mapped_column(String(10), nullable=False)
