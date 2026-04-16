from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient
from jose import jwt
import pytest

from app.db.base import Base
from app.db.session import engine
from app.main import create_app


@pytest.fixture(autouse=True)
def reset_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def api_client() -> TestClient:
    return TestClient(create_app())


def _token_for(tenant_id: str, user_id: str) -> str:
    payload = {
        "sub": user_id,
        "tenant_id": tenant_id,
        "role": "owner",
        "exp": int((datetime.now(timezone.utc) + timedelta(minutes=30)).timestamp()),
    }
    return jwt.encode(payload, "dev-secret", algorithm="HS256")


@pytest.fixture
def auth_header() -> dict[str, str]:
    token = _token_for("22222222-2222-2222-2222-222222222222", "11111111-1111-1111-1111-111111111111")
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def tenant_a_header() -> dict[str, str]:
    token = _token_for("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "11111111-1111-1111-1111-111111111111")
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def tenant_b_header() -> dict[str, str]:
    token = _token_for("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "99999999-9999-9999-9999-999999999999")
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def renter_id(api_client: TestClient, auth_header: dict[str, str]) -> str:
    payload = {
        "appartmentNumber": 101,
        "name": "John Doe",
        "rentAmount": 1200,
        "lastMonthPayed": "2026-01",
    }
    response = api_client.post("/api/renters", json=payload, headers=auth_header)
    assert response.status_code == 201
    return response.json()["id"]


@pytest.fixture
def payment_payload() -> dict:
    return {
        "appartmentNumber": 101,
        "monthPaid": "2026-02",
        "amountPaid": 1200,
        "name": "John Doe",
    }
