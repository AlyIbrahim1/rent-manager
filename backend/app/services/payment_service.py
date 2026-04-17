from datetime import date
from uuid import uuid4

from fastapi import HTTPException, status

from app.db.session import SessionLocal
from app.models.payment import Payment
from app.models.renter import Renter
from app.schemas.payment import AddPaymentRequest


def list_payments(tenant_id: str, renter_id: str) -> list[dict]:
    with SessionLocal() as session:
        renter = (
            session.query(Renter)
            .filter(Renter.id == renter_id, Renter.tenant_id == tenant_id)
            .first()
        )
        if renter is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Renter not found")

        payments = (
            session.query(Payment)
            .filter(Payment.tenant_id == tenant_id, Payment.renter_id == renter_id)
            .order_by(Payment.dateRecorded.desc())
            .all()
        )

        return [
            {
                "id": payment.id,
                "monthPaid": payment.monthPaid,
                "amountPaid": payment.amountPaid,
                "dateRecorded": payment.dateRecorded,
            }
            for payment in payments
        ]


def add_payment(tenant_id: str, renter_id: str, payload: AddPaymentRequest) -> dict:
    with SessionLocal() as session:
        renter = (
            session.query(Renter)
            .filter(Renter.id == renter_id, Renter.tenant_id == tenant_id)
            .first()
        )
        if renter is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Renter not found")

        payment = Payment(
            id=str(uuid4()),
            tenant_id=tenant_id,
            renter_id=renter_id,
            monthPaid=payload.monthPaid,
            amountPaid=payload.amountPaid,
            dateRecorded=date.today().isoformat(),
        )
        session.add(payment)
        renter.lastMonthPayed = payload.monthPaid
        session.commit()

        return {
            "id": payment.id,
            "monthPaid": payment.monthPaid,
            "amountPaid": payment.amountPaid,
            "dateRecorded": payment.dateRecorded,
        }
