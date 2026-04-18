from typing import Literal
from datetime import datetime

from pydantic import BaseModel, Field, field_validator, model_validator


class UpsertLeaseRequest(BaseModel):
    startDate: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    endDate: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    depositAmount: int = 0
    depositStatus: Literal["paid", "unpaid", "partial"] = "unpaid"
    renewalNotes: str | None = None

    @field_validator("startDate", "endDate")
    @classmethod
    def validate_lease_date(cls, value: str) -> str:
        try:
            datetime.strptime(value, "%Y-%m-%d")
        except ValueError as exc:
            raise ValueError("Lease dates must be valid YYYY-MM-DD values") from exc
        return value

    @model_validator(mode="after")
    def validate_date_order(self) -> "UpsertLeaseRequest":
        if self.startDate > self.endDate:
            raise ValueError("startDate must be on or before endDate")
        return self
