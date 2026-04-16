from pydantic import BaseModel


class UpsertLeaseRequest(BaseModel):
    startDate: str
    endDate: str
    depositAmount: int = 0
    depositStatus: str = "unpaid"
    renewalNotes: str | None = None
