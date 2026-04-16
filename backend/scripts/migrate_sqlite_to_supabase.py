from __future__ import annotations

from dataclasses import dataclass
from datetime import date
import sqlite3
from uuid import uuid4

from app.db.session import SessionLocal
from app.models.lease import Lease
from app.models.payment import Payment
from app.models.renter import Renter
from app.models.tenant import Tenant, TenantMembership


@dataclass(slots=True)
class MigrationCounts:
    tenantsCreated: int = 0
    rentersImported: int = 0
    leasesImported: int = 0
    paymentsImported: int = 0

    def as_dict(self) -> dict[str, int]:
        return {
            "tenantsCreated": self.tenantsCreated,
            "rentersImported": self.rentersImported,
            "leasesImported": self.leasesImported,
            "paymentsImported": self.paymentsImported,
        }


def run_migration(sqlite_path: str, tenant_name: str) -> dict[str, int]:
    counts = MigrationCounts()

    with SessionLocal() as session:
        tenant = session.query(Tenant).filter(Tenant.name == tenant_name).first()
        if tenant is None:
            owner_user_id = str(uuid4())
            tenant = Tenant(id=str(uuid4()), name=tenant_name, owner_user_id=owner_user_id)
            session.add(tenant)
            session.add(
                TenantMembership(
                    tenant_id=tenant.id,
                    user_id=owner_user_id,
                    role="owner",
                )
            )
            session.commit()
            counts.tenantsCreated = 1

        legacy = sqlite3.connect(sqlite_path)
        legacy.row_factory = sqlite3.Row

        renter_map: dict[int, str] = {}

        for row in legacy.execute(
            "SELECT appartmentNumber, name, rentAmount, lastMonthPayed FROM renters"
        ).fetchall():
            app_number = int(row["appartmentNumber"])
            existing = (
                session.query(Renter)
                .filter(
                    Renter.tenant_id == tenant.id,
                    Renter.appartmentNumber == app_number,
                )
                .first()
            )
            if existing is None:
                renter = Renter(
                    id=str(uuid4()),
                    tenant_id=tenant.id,
                    appartmentNumber=app_number,
                    name=str(row["name"]),
                    rentAmount=int(row["rentAmount"]),
                    lastMonthPayed=row["lastMonthPayed"],
                )
                session.add(renter)
                session.flush()
                renter_map[app_number] = renter.id
                counts.rentersImported += 1
            else:
                renter_map[app_number] = existing.id

        for row in legacy.execute(
            "SELECT appartmentNumber, startDate, endDate, depositAmount, depositStatus, renewalNotes FROM leases"
        ).fetchall():
            app_number = int(row["appartmentNumber"])
            renter_id = renter_map.get(app_number)
            if renter_id is None:
                continue

            existing = (
                session.query(Lease)
                .filter(Lease.tenant_id == tenant.id, Lease.renter_id == renter_id)
                .first()
            )
            if existing is None:
                session.add(
                    Lease(
                        id=str(uuid4()),
                        tenant_id=tenant.id,
                        renter_id=renter_id,
                        startDate=str(row["startDate"]),
                        endDate=str(row["endDate"]),
                        depositAmount=int(row["depositAmount"] or 0),
                        depositStatus=str(row["depositStatus"] or "unpaid"),
                        renewalNotes=row["renewalNotes"],
                    )
                )
                counts.leasesImported += 1

        for row in legacy.execute(
            "SELECT appartmentNumber, monthPaid, amountPaid, dateRecorded FROM payments"
        ).fetchall():
            app_number = int(row["appartmentNumber"])
            renter_id = renter_map.get(app_number)
            if renter_id is None:
                continue

            exists = (
                session.query(Payment)
                .filter(
                    Payment.tenant_id == tenant.id,
                    Payment.renter_id == renter_id,
                    Payment.monthPaid == str(row["monthPaid"]),
                    Payment.amountPaid == int(row["amountPaid"]),
                )
                .first()
            )
            if exists is None:
                session.add(
                    Payment(
                        id=str(uuid4()),
                        tenant_id=tenant.id,
                        renter_id=renter_id,
                        monthPaid=str(row["monthPaid"]),
                        amountPaid=int(row["amountPaid"]),
                        dateRecorded=str(row["dateRecorded"] or date.today().isoformat()),
                    )
                )
                counts.paymentsImported += 1

        session.commit()
        legacy.close()

    return counts.as_dict()
