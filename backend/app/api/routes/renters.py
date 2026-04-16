from fastapi import APIRouter, Depends

from app.schemas.lease import UpsertLeaseRequest
from app.schemas.payment import AddPaymentRequest
from app.schemas.renter import CreateRenterRequest
from app.services import lease_service, payment_service
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


@router.put("/renters/{renter_id}/lease")
def upsert_lease(
    renter_id: str,
    payload: UpsertLeaseRequest,
    ctx: AuthContext = Depends(get_auth_context),
):
    return lease_service.upsert_lease(ctx.tenant_id, renter_id, payload)


@router.get("/renters/{renter_id}/payments")
def list_payments(renter_id: str, ctx: AuthContext = Depends(get_auth_context)):
    return payment_service.list_payments(ctx.tenant_id, renter_id)


@router.post("/renters/{renter_id}/payments", status_code=201)
def add_payment(
    renter_id: str,
    payload: AddPaymentRequest,
    ctx: AuthContext = Depends(get_auth_context),
):
    return payment_service.add_payment(ctx.tenant_id, renter_id, payload)
