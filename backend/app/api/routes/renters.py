from fastapi import APIRouter, Depends

from app.schemas.renter import CreateRenterRequest
from app.services import rent_service
from app.services.auth_context_service import AuthContext, get_auth_context

router = APIRouter(prefix="/api", tags=["renters"])


@router.post("/renters", status_code=201)
def create_renter(payload: CreateRenterRequest, ctx: AuthContext = Depends(get_auth_context)):
    return rent_service.create_renter(ctx.tenant_id, ctx.user_id, payload)


@router.get("/renters")
def list_renters(ctx: AuthContext = Depends(get_auth_context)):
    return rent_service.list_renters(ctx.tenant_id)


@router.get("/renters/{renter_id}")
def get_renter(renter_id: str, ctx: AuthContext = Depends(get_auth_context)):
    return rent_service.get_renter(ctx.tenant_id, renter_id)
