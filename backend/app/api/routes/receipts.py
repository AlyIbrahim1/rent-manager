from fastapi import APIRouter, Depends

from app.schemas.receipt import GenerateReceiptRequest
from app.services.auth_context_service import AuthContext, get_auth_context
from app.services.receipt_service import generate_and_store_receipt

router = APIRouter(prefix="/api", tags=["receipts"])


@router.post("/receipts", status_code=201)
def create_receipt(payload: GenerateReceiptRequest, ctx: AuthContext = Depends(get_auth_context)):
    return generate_and_store_receipt(ctx.tenant_id, payload)
