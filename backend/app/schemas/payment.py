from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class AddPaymentRequest(BaseModel):
    monthPaid: str = Field(..., pattern=r"^\d{4}-\d{2}$")
    amountPaid: int = Field(..., ge=1)

    @field_validator("monthPaid")
    @classmethod
    def validate_month_paid(cls, value: str) -> str:
        try:
            datetime.strptime(value, "%Y-%m")
        except ValueError as exc:
            raise ValueError("monthPaid must be a valid month in YYYY-MM format") from exc
        return value


class PaymentResponse(BaseModel):
    id: str
    monthPaid: str
    amountPaid: int
    dateRecorded: str
