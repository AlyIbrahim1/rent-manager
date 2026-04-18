from datetime import datetime, timedelta, timezone
from uuid import uuid4

from sqlalchemy.exc import IntegrityError

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.dev_session import DevSession
from app.models.lease import Lease
from app.models.payment import Payment
from app.models.renter import Renter
from app.models.tenant import Tenant

_SAMPLE_DATA = [
    {
        "appartmentNumber": 101,
        "name": "Ahmed Hassan",
        "rentAmount": 3500,
        "lastMonthPayed": "2026-03",
        "lease": {"startDate": "2024-01-01", "endDate": "2026-12-31", "depositAmount": 7000, "depositStatus": "paid"},
        "payments": [
            {"monthPaid": "2026-03", "amountPaid": 3500, "dateRecorded": "2026-03-02"},
            {"monthPaid": "2026-02", "amountPaid": 3500, "dateRecorded": "2026-02-01"},
            {"monthPaid": "2026-01", "amountPaid": 3500, "dateRecorded": "2026-01-03"},
        ],
    },
    {
        "appartmentNumber": 102,
        "name": "Sarah Mohamed",
        "rentAmount": 4000,
        "lastMonthPayed": "2026-04",
        "lease": {"startDate": "2025-06-01", "endDate": "2027-05-31", "depositAmount": 8000, "depositStatus": "paid"},
        "payments": [
            {"monthPaid": "2026-04", "amountPaid": 4000, "dateRecorded": "2026-04-01"},
            {"monthPaid": "2026-03", "amountPaid": 4000, "dateRecorded": "2026-03-03"},
        ],
    },
    {
        "appartmentNumber": 103,
        "name": "Omar Ali",
        "rentAmount": 3000,
        "lastMonthPayed": None,
        "lease": {"startDate": "2026-04-01", "endDate": "2027-03-31", "depositAmount": 6000, "depositStatus": "paid"},
        "payments": [],
    },
    {
        "appartmentNumber": 201,
        "name": "Nadia Khalil",
        "rentAmount": 5000,
        "lastMonthPayed": "2026-02",
        "lease": {"startDate": "2023-09-01", "endDate": "2026-08-31", "depositAmount": 10000, "depositStatus": "paid"},
        "payments": [
            {"monthPaid": "2026-02", "amountPaid": 5000, "dateRecorded": "2026-02-05"},
            {"monthPaid": "2026-01", "amountPaid": 5000, "dateRecorded": "2026-01-07"},
        ],
    },
    {
        "appartmentNumber": 202,
        "name": "Tarek Ibrahim",
        "rentAmount": 4500,
        "lastMonthPayed": "2026-04",
        "lease": {"startDate": "2025-01-01", "endDate": "2026-12-31", "depositAmount": 9000, "depositStatus": "paid"},
        "payments": [
            {"monthPaid": "2026-04", "amountPaid": 4500, "dateRecorded": "2026-04-05"},
            {"monthPaid": "2026-03", "amountPaid": 4500, "dateRecorded": "2026-03-04"},
            {"monthPaid": "2026-02", "amountPaid": 4500, "dateRecorded": "2026-02-03"},
        ],
    },
    {
        "appartmentNumber": 301,
        "name": "Laila Farouk",
        "rentAmount": 3500,
        "lastMonthPayed": "2026-01",
        "lease": {"startDate": "2024-06-01", "endDate": "2026-05-31", "depositAmount": 7000, "depositStatus": "paid"},
        "payments": [
            {"monthPaid": "2026-01", "amountPaid": 3500, "dateRecorded": "2026-01-10"},
        ],
    },
]


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def cleanup_expired_dev_sessions() -> int:
    now = _utc_now()
    with SessionLocal() as session:
        expired_tenant_ids = [
            row.tenant_id
            for row in session.query(DevSession.tenant_id)
            .filter(DevSession.expires_at <= now)
            .all()
        ]

    for tenant_id in expired_tenant_ids:
        delete_dev_tenant(tenant_id)

    return len(expired_tenant_ids)


def create_dev_session() -> tuple[str, str, datetime]:
    if settings.dev_session_cleanup_enabled:
        cleanup_expired_dev_sessions()

    session_id = str(uuid4())
    tenant_id = str(uuid4())
    expires_at = _utc_now() + timedelta(hours=settings.dev_session_ttl_hours)

    reset_and_seed(tenant_id, session_id)

    with SessionLocal() as session:
        session.add(
            DevSession(
                session_id=session_id,
                tenant_id=tenant_id,
                expires_at=expires_at,
            )
        )
        session.commit()

    return session_id, tenant_id, expires_at


def is_dev_session_active(session_id: str, tenant_id: str) -> bool:
    with SessionLocal() as session:
        dev_session = (
            session.query(DevSession)
            .filter(
                DevSession.session_id == session_id,
                DevSession.tenant_id == tenant_id,
            )
            .first()
        )

    if dev_session is None:
        return False

    if _as_utc(dev_session.expires_at) <= _utc_now():
        delete_dev_tenant(tenant_id)
        return False

    return True


def cleanup_dev_session(session_id: str, tenant_id: str) -> None:
    with SessionLocal() as session:
        dev_session = (
            session.query(DevSession)
            .filter(
                DevSession.session_id == session_id,
                DevSession.tenant_id == tenant_id,
            )
            .first()
        )

        if dev_session is None:
            return

        tenant = session.get(Tenant, tenant_id)
        if tenant is not None:
            session.delete(tenant)

        # Explicit delete keeps behavior consistent even when DB-level cascades differ.
        session.delete(dev_session)

        session.commit()


def _insert_renters(session, tenant_id: str) -> None:
    for item in _SAMPLE_DATA:
        renter_id = str(uuid4())
        session.add(
            Renter(
                id=renter_id,
                tenant_id=tenant_id,
                appartmentNumber=item["appartmentNumber"],
                name=item["name"],
                rentAmount=item["rentAmount"],
                lastMonthPayed=item["lastMonthPayed"],
            )
        )
        session.flush()
        lease_data = item["lease"]
        session.add(
            Lease(
                id=str(uuid4()),
                tenant_id=tenant_id,
                renter_id=renter_id,
                startDate=lease_data["startDate"],
                endDate=lease_data["endDate"],
                depositAmount=lease_data["depositAmount"],
                depositStatus=lease_data["depositStatus"],
            )
        )
        for p in item["payments"]:
            session.add(
                Payment(
                    id=str(uuid4()),
                    tenant_id=tenant_id,
                    renter_id=renter_id,
                    monthPaid=p["monthPaid"],
                    amountPaid=p["amountPaid"],
                    dateRecorded=p["dateRecorded"],
                )
            )


def delete_dev_tenant(tenant_id: str) -> None:
    with SessionLocal() as session:
        session.query(DevSession).filter(DevSession.tenant_id == tenant_id).delete()
        session.query(Renter).filter(Renter.tenant_id == tenant_id).delete()
        tenant = session.get(Tenant, tenant_id)
        if tenant is not None:
            session.delete(tenant)
        session.commit()


def reset_and_seed(tenant_id: str, user_id: str) -> None:
    with SessionLocal() as session:
        session.query(Renter).filter(Renter.tenant_id == tenant_id).delete()
        tenant = session.get(Tenant, tenant_id)
        if tenant is None:
            try:
                session.add(Tenant(id=tenant_id, name="My Property", owner_user_id=user_id))
                session.flush()
            except IntegrityError:
                session.rollback()
        _insert_renters(session, tenant_id)
        session.commit()


def seed_sample_data(tenant_id: str, user_id: str) -> dict:
    with SessionLocal() as session:
        existing = session.query(Renter).filter(Renter.tenant_id == tenant_id).first()
        if existing is not None:
            return {"seeded": False, "reason": "Data already exists for this account"}
        tenant = session.get(Tenant, tenant_id)
        if tenant is None:
            try:
                session.add(Tenant(id=tenant_id, name="My Property", owner_user_id=user_id))
                session.flush()
            except IntegrityError:
                session.rollback()
        _insert_renters(session, tenant_id)
        session.commit()
        return {"seeded": True, "renters_created": len(_SAMPLE_DATA)}
