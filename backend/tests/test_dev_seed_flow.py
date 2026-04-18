from datetime import datetime, timedelta, timezone

from app.db.session import SessionLocal
from app.models.dev_session import DevSession
from app.models.renter import Renter
from app.models.tenant import Tenant
from app.services.seed_service import _SAMPLE_DATA
from app.core.config import settings


def _auth_header_from_token(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_dev_token_creates_isolated_sessions_with_same_baseline(api_client, monkeypatch):
    monkeypatch.setattr(settings, "seed_enabled", True)

    first = api_client.post("/api/dev-token")
    assert first.status_code == 200
    first_tenant = first.json()["tenantId"]
    first_token = first.json()["access_token"]
    first_header = _auth_header_from_token(first_token)

    me_first = api_client.get("/api/me", headers=first_header)
    assert me_first.status_code == 200
    assert me_first.json()["tenantId"] == first_tenant

    # Add custom noise data inside session A.
    extra = api_client.post(
        "/api/renters",
        headers=first_header,
        json={
            "appartmentNumber": 999,
            "name": "Temporary Dev Renter",
            "rentAmount": 1000,
            "lastMonthPayed": "2026-01",
        },
    )
    assert extra.status_code == 201

    second = api_client.post("/api/dev-token")
    assert second.status_code == 200
    second_tenant = second.json()["tenantId"]
    assert second_tenant != first_tenant
    second_token = second.json()["access_token"]
    second_header = _auth_header_from_token(second_token)

    me_second = api_client.get("/api/me", headers=second_header)
    assert me_second.status_code == 200
    assert me_second.json()["tenantId"] == second_tenant

    renters = api_client.get("/api/renters", headers=second_header)
    assert renters.status_code == 200
    body = renters.json()
    assert len(body) == len(_SAMPLE_DATA)
    assert all(item["appartmentNumber"] != 999 for item in body)

    # Session A remains isolated and still has its own mutation.
    renters_first = api_client.get("/api/renters", headers=first_header)
    assert renters_first.status_code == 200
    assert any(item["appartmentNumber"] == 999 for item in renters_first.json())

    with SessionLocal() as session:
        assert session.query(Tenant).count() == 2
        assert (
            session.query(Renter)
            .filter(Renter.tenant_id == second_tenant)
            .count()
            == len(_SAMPLE_DATA)
        )


def test_delete_dev_session_invalidates_dev_token(api_client, monkeypatch):
    monkeypatch.setattr(settings, "seed_enabled", True)

    issued = api_client.post("/api/dev-token")
    assert issued.status_code == 200
    token = issued.json()["access_token"]
    headers = _auth_header_from_token(token)

    assert api_client.get("/api/me", headers=headers).status_code == 200
    assert api_client.delete("/api/dev-session", headers=headers).status_code == 204
    assert api_client.get("/api/me", headers=headers).status_code == 401


def test_expired_dev_session_is_rejected(api_client, monkeypatch):
    monkeypatch.setattr(settings, "seed_enabled", True)

    issued = api_client.post("/api/dev-token")
    assert issued.status_code == 200
    token = issued.json()["access_token"]
    session_id = issued.json()["sessionId"]
    tenant_id = issued.json()["tenantId"]
    headers = _auth_header_from_token(token)

    with SessionLocal() as session:
        row = session.get(DevSession, session_id)
        assert row is not None
        assert row.tenant_id == tenant_id
        row.expires_at = datetime.now(timezone.utc) - timedelta(minutes=1)
        session.commit()

    assert api_client.get("/api/me", headers=headers).status_code == 401
