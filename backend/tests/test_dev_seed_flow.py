from app.db.session import SessionLocal
from app.models.renter import Renter
from app.models.tenant import Tenant
from app.services.seed_service import _SAMPLE_DATA
from app.core.config import settings


def _auth_header_from_token(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_dev_token_reuses_single_dev_tenant_and_resets_seed(api_client, monkeypatch):
    monkeypatch.setattr(settings, "seed_enabled", True)
    monkeypatch.setattr(settings, "dev_seed_tenant_id", "00000000-0000-0000-0000-000000000099")

    first = api_client.post("/api/dev-token")
    assert first.status_code == 200
    first_token = first.json()["access_token"]
    first_header = _auth_header_from_token(first_token)

    me_first = api_client.get("/api/me", headers=first_header)
    assert me_first.status_code == 200
    assert me_first.json()["tenantId"] == settings.dev_seed_tenant_id

    # Add custom noise data to verify the next dev-token call resets the tenant.
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
    second_token = second.json()["access_token"]
    second_header = _auth_header_from_token(second_token)

    me_second = api_client.get("/api/me", headers=second_header)
    assert me_second.status_code == 200
    assert me_second.json()["tenantId"] == settings.dev_seed_tenant_id

    renters = api_client.get("/api/renters", headers=second_header)
    assert renters.status_code == 200
    body = renters.json()
    assert len(body) == len(_SAMPLE_DATA)
    assert all(item["appartmentNumber"] != 999 for item in body)

    with SessionLocal() as session:
        assert session.query(Tenant).count() == 1
        assert (
            session.query(Renter)
            .filter(Renter.tenant_id == settings.dev_seed_tenant_id)
            .count()
            == len(_SAMPLE_DATA)
        )
