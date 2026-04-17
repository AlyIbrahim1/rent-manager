from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient
from jose import jwt
import pytest

from app.main import create_app


@pytest.fixture
def valid_supabase_token() -> str:
    payload = {
        "sub": "11111111-1111-1111-1111-111111111111",
        "tenant_id": "22222222-2222-2222-2222-222222222222",
        "role": "owner",
        "exp": int((datetime.now(timezone.utc) + timedelta(minutes=30)).timestamp()),
    }
    return jwt.encode(payload, "dev-secret", algorithm="HS256")


def test_me_requires_bearer_token():
    client = TestClient(create_app())
    response = client.get("/api/me")

    assert response.status_code == 401


def test_me_returns_user_context_with_valid_token(valid_supabase_token):
    client = TestClient(create_app())
    response = client.get(
        "/api/me",
        headers={"Authorization": f"Bearer {valid_supabase_token}"},
    )

    assert response.status_code == 200
    assert "userId" in response.json()
    assert "tenantId" in response.json()
