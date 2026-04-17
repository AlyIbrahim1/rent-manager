import os

# Must be set before app modules are imported so Settings picks up test values.
# Use direct assignment (not setdefault) to override any values from .env.
os.environ["DATABASE_URL"] = "sqlite+pysqlite:///./test.db"
os.environ["SUPABASE_JWT_SECRET"] = "dev-secret"
os.environ["SUPABASE_SERVICE_ROLE_KEY"] = ""  # prevent real Supabase calls in tests

from datetime import datetime, timedelta, timezone
from pathlib import Path
import sqlite3
from types import SimpleNamespace
from uuid import uuid4

from fastapi.testclient import TestClient
from jose import jwt
import pytest

from app.db.base import Base
from app.db.session import engine
from app.db.session import SessionLocal
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


@pytest.fixture
def sqlite_fixture(tmp_path: Path):
    sqlite_path = tmp_path / "legacy.sqlite"
    conn = sqlite3.connect(sqlite_path)
    cur = conn.cursor()
    cur.execute(
        "CREATE TABLE renters (appartmentNumber INTEGER PRIMARY KEY, name TEXT, rentAmount INTEGER, lastMonthPayed TEXT)"
    )
    cur.execute(
        "CREATE TABLE leases (appartmentNumber INTEGER, startDate TEXT, endDate TEXT, depositAmount INTEGER, depositStatus TEXT, renewalNotes TEXT)"
    )
    cur.execute(
        "CREATE TABLE payments (id INTEGER PRIMARY KEY AUTOINCREMENT, appartmentNumber INTEGER, monthPaid TEXT, amountPaid INTEGER, dateRecorded TEXT)"
    )
    cur.execute(
        "INSERT INTO renters(appartmentNumber, name, rentAmount, lastMonthPayed) VALUES (101, 'John Doe', 1200, '2026-01')"
    )
    cur.execute(
        "INSERT INTO renters(appartmentNumber, name, rentAmount, lastMonthPayed) VALUES (102, 'Jane Roe', 1400, '2026-01')"
    )
    cur.execute(
        "INSERT INTO leases(appartmentNumber, startDate, endDate, depositAmount, depositStatus, renewalNotes) VALUES (101, '2025-01-01', '2026-12-31', 1000, 'paid', 'none')"
    )
    cur.execute(
        "INSERT INTO payments(appartmentNumber, monthPaid, amountPaid, dateRecorded) VALUES (101, '2026-01', 1200, '2026-01-03')"
    )
    conn.commit()
    conn.close()
    return SimpleNamespace(path=str(sqlite_path), owner_user_id=str(uuid4()))


@pytest.fixture
def pg_session():
    with SessionLocal() as session:
        yield session
