from fastapi import APIRouter, Depends

from app.services.auth_context_service import AuthContext, get_auth_context

router = APIRouter(prefix="/api", tags=["auth"])


@router.get("/me")
def me(ctx: AuthContext = Depends(get_auth_context)) -> dict[str, str]:
    return {
        "userId": str(ctx.user_id),
        "tenantId": str(ctx.tenant_id),
        "role": ctx.role,
    }
