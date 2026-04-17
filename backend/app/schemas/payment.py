from pydantic import BaseModel, Field


class AddPaymentRequest(BaseModel):
    monthPaid: str = Field(..., pattern=r"^\d{4}-\d{2}$")
    amountPaid: int = Field(..., ge=0)


class PaymentResponse(BaseModel):
    id: str
    monthPaid: str
    amountPaid: int
    dateRecorded: str
