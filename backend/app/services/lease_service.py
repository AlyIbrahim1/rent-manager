from uuid import uuid4

from fastapi import HTTPException, status

from app.db.session import SessionLocal
from app.models.lease import Lease
from app.models.renter import Renter
from app.schemas.lease import UpsertLeaseRequest


def upsert_lease(tenant_id: str, renter_id: str, payload: UpsertLeaseRequest) -> dict:
    with SessionLocal() as session:
        renter = (
            session.query(Renter)
            .filter(Renter.id == renter_id, Renter.tenant_id == tenant_id)
            .first()
        )
        if renter is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Renter not found")

        lease = (
            session.query(Lease)
            .filter(Lease.renter_id == renter_id, Lease.tenant_id == tenant_id)
            .first()
        )
        if lease is None:
            lease = Lease(
                id=str(uuid4()),
                tenant_id=tenant_id,
                renter_id=renter_id,
                startDate=payload.startDate,
                endDate=payload.endDate,
                depositAmount=payload.depositAmount,
                depositStatus=payload.depositStatus,
                renewalNotes=payload.renewalNotes,
            )
            session.add(lease)
        else:
            lease.startDate = payload.startDate
            lease.endDate = payload.endDate
            lease.depositAmount = payload.depositAmount
            lease.depositStatus = payload.depositStatus
            lease.renewalNotes = payload.renewalNotes

        session.commit()
        return {
            "id": lease.id,
            "renterId": lease.renter_id,
            "startDate": lease.startDate,
            "endDate": lease.endDate,
            "depositAmount": lease.depositAmount,
            "depositStatus": lease.depositStatus,
            "renewalNotes": lease.renewalNotes,
        }
