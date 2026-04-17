from datetime import date, datetime
from uuid import uuid4

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.db.session import SessionLocal
from app.models.renter import Renter
from app.models.tenant import Tenant
from app.schemas.renter import CreateRenterRequest


def compute_rent_status(
    last_month_payed: str | None,
    rent_amount: int,
    today: date | None = None,
) -> tuple[int | None, int | None]:
    if not last_month_payed:
        return None, None

    if today is None:
        today = date.today()

    try:
        paid = datetime.strptime(last_month_payed, "%Y-%m").date()
    except ValueError:
        return None, None

    months = max(0, (today.year - paid.year) * 12 + (today.month - paid.month))
    return months, months * rent_amount


def _ensure_tenant_exists(tenant_id: str, user_id: str) -> None:
    with SessionLocal() as session:
        tenant = session.get(Tenant, tenant_id)
        if tenant is None:
            try:
                session.add(Tenant(id=tenant_id, name=f"Tenant {tenant_id[:8]}", owner_user_id=user_id))
                session.commit()
            except IntegrityError:
                session.rollback()


def create_renter(tenant_id: str, user_id: str, payload: CreateRenterRequest) -> dict:
    _ensure_tenant_exists(tenant_id, user_id)

    with SessionLocal() as session:
        renter = Renter(
            id=str(uuid4()),
            tenant_id=tenant_id,
            appartmentNumber=payload.appartmentNumber,
            name=payload.name,
            rentAmount=payload.rentAmount,
            lastMonthPayed=payload.lastMonthPayed,
        )
        session.add(renter)
        session.commit()

        unpaid_months, rent_due = compute_rent_status(renter.lastMonthPayed, renter.rentAmount)
        return {
            "id": renter.id,
            "appartmentNumber": renter.appartmentNumber,
            "name": renter.name,
            "rentAmount": renter.rentAmount,
            "lastMonthPayed": renter.lastMonthPayed,
            "unpaidMonths": unpaid_months,
            "rentDue": rent_due,
        }


def list_renters(tenant_id: str) -> list[dict]:
    with SessionLocal() as session:
        renters = (
            session.query(Renter)
            .filter(Renter.tenant_id == tenant_id)
            .order_by(Renter.appartmentNumber.asc())
            .all()
        )

        output: list[dict] = []
        for renter in renters:
            unpaid_months, rent_due = compute_rent_status(renter.lastMonthPayed, renter.rentAmount)
            output.append(
                {
                    "id": renter.id,
                    "appartmentNumber": renter.appartmentNumber,
                    "name": renter.name,
                    "rentAmount": renter.rentAmount,
                    "lastMonthPayed": renter.lastMonthPayed,
                    "unpaidMonths": unpaid_months,
                    "rentDue": rent_due,
                }
            )
        return output


def get_renter(tenant_id: str, renter_id: str) -> dict:
    with SessionLocal() as session:
        renter = (
            session.query(Renter)
            .filter(Renter.id == renter_id, Renter.tenant_id == tenant_id)
            .first()
        )
        if renter is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Renter not found")

        unpaid_months, rent_due = compute_rent_status(renter.lastMonthPayed, renter.rentAmount)
        return {
            "id": renter.id,
            "appartmentNumber": renter.appartmentNumber,
            "name": renter.name,
            "rentAmount": renter.rentAmount,
            "lastMonthPayed": renter.lastMonthPayed,
            "unpaidMonths": unpaid_months,
            "rentDue": rent_due,
        }
