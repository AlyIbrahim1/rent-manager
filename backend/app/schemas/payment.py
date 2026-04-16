from pydantic import BaseModel, Field


class AddPaymentRequest(BaseModel):
    monthPaid: str
    amountPaid: int = Field(..., ge=0)


class PaymentResponse(BaseModel):
    id: str
    monthPaid: str
    amountPaid: int
    dateRecorded: str
