from jose import JWTError, jwt
from fastapi import HTTPException, status

from app.core.config import settings


def verify_supabase_bearer_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.supabase_jwt_secret, algorithms=["HS256"])
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc

    return payload
