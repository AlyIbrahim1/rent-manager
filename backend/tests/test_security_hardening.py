from datetime import datetime, timedelta, timezone

from jose import jwt

from app.core.config import settings


def _signed_token(payload: dict) -> str:
    return jwt.encode(payload, "dev-secret", algorithm="HS256")


def test_cleanup_dev_session_rejects_invalid_token(api_client, monkeypatch):
    monkeypatch.setattr(settings, "seed_enabled", True)

    response = api_client.post("/api/dev-session/cleanup", json={"token": "not-a-token"})
    assert response.status_code == 401


def test_cleanup_dev_session_rejects_missing_sub(api_client, monkeypatch):
    monkeypatch.setattr(settings, "seed_enabled", True)

    token = _signed_token(
        {
            "tenant_id": "22222222-2222-2222-2222-222222222222",
            "aud": "authenticated",
            "exp": int((datetime.now(timezone.utc) + timedelta(minutes=30)).timestamp()),
        }
    )
    response = api_client.post("/api/dev-session/cleanup", json={"token": token})

    assert response.status_code == 401


def test_receipt_generation_requires_existing_payment(api_client, auth_header):
    create_renter = api_client.post(
        "/api/renters",
        headers=auth_header,
        json={
            "appartmentNumber": 501,
            "name": "Receipt Tenant",
            "rentAmount": 1800,
            "lastMonthPayed": "2026-01",
        },
    )
    assert create_renter.status_code == 201

    response = api_client.post(
        "/api/receipts",
        headers=auth_header,
        json={
            "appartmentNumber": 501,
            "monthPaid": "2026-04",
            "amountPaid": 1800,
            "name": "Forged Name",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Payment not found"


def test_cross_tenant_receipt_generation_is_blocked(api_client, tenant_a_header, tenant_b_header):
    create_renter = api_client.post(
        "/api/renters",
        headers=tenant_a_header,
        json={
            "appartmentNumber": 701,
            "name": "Tenant A",
            "rentAmount": 2100,
            "lastMonthPayed": "2026-01",
        },
    )
    assert create_renter.status_code == 201
    renter_id = create_renter.json()["id"]

    payment = api_client.post(
        f"/api/renters/{renter_id}/payments",
        headers=tenant_a_header,
        json={"monthPaid": "2026-03", "amountPaid": 2100},
    )
    assert payment.status_code == 201

    response = api_client.post(
        "/api/receipts",
        headers=tenant_b_header,
        json={
            "appartmentNumber": 701,
            "monthPaid": "2026-03",
            "amountPaid": 2100,
            "name": "Tenant A",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Renter not found"
