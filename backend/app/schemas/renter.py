from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class CreateRenterRequest(BaseModel):
    appartmentNumber: int = Field(..., ge=1)
    name: str = Field(..., min_length=1, max_length=255)
    rentAmount: int = Field(..., ge=1)
    lastMonthPayed: str | None = Field(None, pattern=r"^\d{4}-\d{2}$")

    @field_validator("lastMonthPayed")
    @classmethod
    def validate_last_paid_month(cls, value: str | None) -> str | None:
        if value is None:
            return value
        try:
            datetime.strptime(value, "%Y-%m")
        except ValueError as exc:
            raise ValueError("lastMonthPayed must be a valid month in YYYY-MM format") from exc
        return value


class RenterResponse(BaseModel):
    id: str
    appartmentNumber: int
    name: str
    rentAmount: int
    lastMonthPayed: str | None
    unpaidMonths: int | None
    rentDue: int | None
