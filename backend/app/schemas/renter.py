from pydantic import BaseModel, Field


class CreateRenterRequest(BaseModel):
    appartmentNumber: int = Field(..., ge=1)
    name: str = Field(..., min_length=1, max_length=255)
    rentAmount: int = Field(..., ge=0)
    lastMonthPayed: str | None = Field(None, pattern=r"^\d{4}-\d{2}$")


class RenterResponse(BaseModel):
    id: str
    appartmentNumber: int
    name: str
    rentAmount: int
    lastMonthPayed: str | None
    unpaidMonths: int | None
    rentDue: int | None
