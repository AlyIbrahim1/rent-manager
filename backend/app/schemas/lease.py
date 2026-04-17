from typing import Literal

from pydantic import BaseModel, Field


class UpsertLeaseRequest(BaseModel):
    startDate: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    endDate: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    depositAmount: int = 0
    depositStatus: Literal["paid", "unpaid", "partial"] = "unpaid"
    renewalNotes: str | None = None
