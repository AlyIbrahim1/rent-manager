from jose import JWTError, jwt
from fastapi import HTTPException, status

from app.core.config import settings


def verify_supabase_bearer_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        expected_audience = settings.supabase_jwt_audience
        token_audience = payload.get("aud")
        if isinstance(token_audience, list):
            audience_valid = expected_audience in token_audience
        else:
            audience_valid = token_audience == expected_audience
        if not audience_valid:
            raise JWTError("Invalid audience")
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc

    return payload
