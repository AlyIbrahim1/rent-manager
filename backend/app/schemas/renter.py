from pydantic import BaseModel, Field


class CreateRenterRequest(BaseModel):
    appartmentNumber: int = Field(..., ge=1)
    name: str
    rentAmount: int = Field(..., ge=0)
    lastMonthPayed: str | None = None


class RenterResponse(BaseModel):
    id: str
    appartmentNumber: int
    name: str
    rentAmount: int
    lastMonthPayed: str | None
    unpaidMonths: int | None
    rentDue: int | None
