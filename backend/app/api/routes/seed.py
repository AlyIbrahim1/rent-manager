from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from jose import jwt
from pydantic import BaseModel

from app.core.config import settings
from app.core.security import verify_supabase_bearer_token
from app.services import seed_service
from app.services.auth_context_service import AuthContext, get_auth_context

router = APIRouter(prefix="/api", tags=["seed"])


class CleanupPayload(BaseModel):
    token: str


def _require_seed_enabled():
    if not settings.seed_enabled:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")


@router.post("/dev-token")
def dev_token():
    _require_seed_enabled()
    session_id, tenant_id, expires_at = seed_service.create_dev_session()
    payload = {
        "sub": session_id,
        "tenant_id": tenant_id,
        "email": "dev@local",
        "dev_session": True,
        "role": "authenticated",
        "aud": "authenticated",
        "exp": int(expires_at.timestamp()),
    }
    token = jwt.encode(payload, settings.supabase_jwt_secret, algorithm="HS256")
    return {
        "access_token": token,
        "sessionId": session_id,
        "tenantId": tenant_id,
        "expiresAt": expires_at.isoformat(),
    }


@router.delete("/dev-session", status_code=204)
def delete_dev_session(ctx: AuthContext = Depends(get_auth_context)):
    _require_seed_enabled()
    if ctx.is_dev_session:
        seed_service.cleanup_dev_session(ctx.user_id, ctx.tenant_id)
        return

    # Legacy compatibility for previous dev tokens without dev_session claim.
    seed_service.delete_dev_tenant(ctx.tenant_id)


@router.post("/dev-session/cleanup", status_code=204)
def cleanup_dev_session(payload: CleanupPayload):
    _require_seed_enabled()
    claims = verify_supabase_bearer_token(payload.token)
    session_id = claims.get("sub")
    tenant_id = claims.get("tenant_id") or session_id
    is_dev_token = bool(claims.get("dev_session")) or claims.get("email") == "dev@local"

    if not session_id or not tenant_id or not is_dev_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    if claims.get("dev_session"):
        seed_service.cleanup_dev_session(str(session_id), str(tenant_id))
    else:
        # Legacy compatibility for old dev tokens.
        seed_service.delete_dev_tenant(str(tenant_id))


@router.post("/seed", status_code=201)
def seed_sample_data(ctx: AuthContext = Depends(get_auth_context)):
    _require_seed_enabled()
    return seed_service.seed_sample_data(ctx.tenant_id, ctx.user_id)
