from datetime import datetime, timedelta, timezone
from uuid import uuid4

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
    session_id = str(uuid4())
    payload = {
        "sub": session_id,
        "email": "dev@local",
        "role": "authenticated",
        "aud": "authenticated",
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
    }
    token = jwt.encode(payload, settings.supabase_jwt_secret, algorithm="HS256")
    seed_service.reset_and_seed(session_id, session_id)
    return {"access_token": token}


@router.delete("/dev-session", status_code=204)
def delete_dev_session(ctx: AuthContext = Depends(get_auth_context)):
    _require_seed_enabled()
    seed_service.delete_dev_tenant(ctx.tenant_id)


@router.post("/dev-session/cleanup", status_code=204)
def cleanup_dev_session(payload: CleanupPayload):
    _require_seed_enabled()
    try:
        claims = verify_supabase_bearer_token(payload.token)
    except HTTPException:
        return
    tenant_id = claims.get("sub")
    if tenant_id:
        seed_service.delete_dev_tenant(tenant_id)


@router.post("/seed", status_code=201)
def seed_sample_data(ctx: AuthContext = Depends(get_auth_context)):
    _require_seed_enabled()
    return seed_service.seed_sample_data(ctx.tenant_id, ctx.user_id)
