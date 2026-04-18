from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient
from jose import jwt

from app.core.config import settings
from app.main import create_app


def _auth_header() -> dict[str, str]:
    payload = {
        "sub": "11111111-1111-1111-1111-111111111111",
        "tenant_id": "22222222-2222-2222-2222-222222222222",
        "role": "owner",
        "aud": "authenticated",
        "exp": int((datetime.now(timezone.utc) + timedelta(minutes=30)).timestamp()),
    }
    token = jwt.encode(payload, "dev-secret", algorithm="HS256")
    return {"Authorization": f"Bearer {token}"}


def test_rate_limit_blocks_after_threshold(monkeypatch):
    monkeypatch.setattr(settings, "rate_limit_enabled", True)
    monkeypatch.setattr(settings, "rate_limit_requests", 2)
    monkeypatch.setattr(settings, "rate_limit_window_seconds", 60)

    client = TestClient(create_app())
    headers = _auth_header()

    assert client.get("/api/me", headers=headers).status_code == 200
    assert client.get("/api/me", headers=headers).status_code == 200

    blocked = client.get("/api/me", headers=headers)
    assert blocked.status_code == 429
    assert blocked.headers.get("Retry-After") is not None


def test_rate_limit_can_be_disabled(monkeypatch):
    monkeypatch.setattr(settings, "rate_limit_enabled", False)
    monkeypatch.setattr(settings, "rate_limit_requests", 1)
    monkeypatch.setattr(settings, "rate_limit_window_seconds", 60)

    client = TestClient(create_app())
    headers = _auth_header()

    assert client.get("/api/me", headers=headers).status_code == 200
    assert client.get("/api/me", headers=headers).status_code == 200
    assert client.get("/api/me", headers=headers).status_code == 200


def test_health_endpoint_is_exempt(monkeypatch):
    monkeypatch.setattr(settings, "rate_limit_enabled", True)
    monkeypatch.setattr(settings, "rate_limit_requests", 1)
    monkeypatch.setattr(settings, "rate_limit_window_seconds", 60)

    client = TestClient(create_app())

    assert client.get("/health").status_code == 200
    assert client.get("/health").status_code == 200
    assert client.get("/health").status_code == 200
