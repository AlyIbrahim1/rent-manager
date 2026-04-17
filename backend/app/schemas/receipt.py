from pydantic import BaseModel, Field


class GenerateReceiptRequest(BaseModel):
    appartmentNumber: int
    monthPaid: str
    amountPaid: int = Field(..., ge=0)
    name: str
