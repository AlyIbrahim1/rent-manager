# FastAPI Supabase Hybrid Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a SaaS web version of Rent Manager with tenant-isolated auth, renter/lease/payment workflows, and receipt generation using FastAPI + Supabase + React.

**Architecture:** Supabase provides auth, Postgres, storage, and RLS. FastAPI provides all domain APIs, authorization checks, rent logic, and receipt generation/upload. React + TypeScript + Tailwind handles UI and calls FastAPI with Supabase bearer tokens.

**Tech Stack:** FastAPI, SQLAlchemy, Alembic, Supabase Postgres/Auth/Storage, React 18, TypeScript, Tailwind, TanStack Query, pytest, Playwright

---

## File Structure

### Backend files

- Create: `backend/pyproject.toml`
  - Python project config, dependencies, test tooling.
- Create: `backend/.env.example`
  - Runtime environment variable template.
- Create: `backend/app/main.py`
  - FastAPI app factory and router registration.
- Create: `backend/app/core/config.py`
  - Settings loader.
- Create: `backend/app/core/security.py`
  - Supabase JWT verification helpers.
- Create: `backend/app/db/base.py`
  - SQLAlchemy declarative base.
- Create: `backend/app/db/session.py`
  - Engine and session factory.
- Create: `backend/app/models/*.py`
  - SQLAlchemy models: tenant, membership, renter, lease, payment, receipt.
- Create: `backend/app/schemas/*.py`
  - Pydantic request/response schemas.
- Create: `backend/app/services/*.py`
  - Auth context, rent, lease, payment, receipt services.
- Create: `backend/app/api/routes/*.py`
  - Route modules (`health`, `me`, `renters`, `receipts`).
- Create: `backend/alembic.ini`
  - Alembic config.
- Create: `backend/alembic/env.py`
  - Alembic environment.
- Create: `backend/alembic/versions/20260416_01_initial_multitenant_schema.py`
  - Initial schema migration.
- Create: `backend/scripts/migrate_sqlite_to_supabase.py`
  - Legacy SQLite import.
- Create: `backend/tests/conftest.py`
  - Fixtures for API client and test DB.
- Create: `backend/tests/test_auth_context.py`
- Create: `backend/tests/test_renters_api.py`
- Create: `backend/tests/test_payments_api.py`
- Create: `backend/tests/test_tenant_isolation.py`
- Create: `backend/tests/test_migration_script.py`

### Frontend files

- Create: `frontend/package.json`
  - Frontend scripts and dependencies.
- Create: `frontend/vite.config.ts`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/postcss.config.js`
- Create: `frontend/.env.example`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/lib/supabase.ts`
- Create: `frontend/src/lib/query-client.ts`
- Create: `frontend/src/api/client.ts`
- Create: `frontend/src/api/types.ts`
- Create: `frontend/src/features/auth/AuthGate.tsx`
- Create: `frontend/src/features/auth/LoginPage.tsx`
- Create: `frontend/src/features/auth/SignupPage.tsx`
- Create: `frontend/src/features/renters/RenterDashboardPage.tsx`
- Create: `frontend/src/features/renters/RenterCard.tsx`
- Create: `frontend/src/features/renters/RenterDetailsPanel.tsx`
- Create: `frontend/src/features/renters/AddRenterModal.tsx`
- Create: `frontend/src/features/renters/MarkPaidModal.tsx`
- Create: `frontend/src/features/renters/PaymentHistoryList.tsx`
- Create: `frontend/src/styles/index.css`
- Create: `frontend/tests/renter-dashboard.test.tsx`
- Create: `frontend/e2e/smoke.spec.ts`

### Repository files

- Modify: `README.md`
  - Add full-stack run instructions.
- Create: `.github/workflows/ci.yml`
  - Backend + frontend test pipelines.

---

## Task 1: Scaffold Backend Application

**Files:**
- Create: `backend/pyproject.toml`
- Create: `backend/.env.example`
- Create: `backend/app/main.py`
- Create: `backend/app/core/config.py`
- Create: `backend/app/api/routes/health.py`
- Create: `backend/tests/test_health.py`

- [ ] **Step 1: Write the failing health endpoint test**

```python
# backend/tests/test_health.py
from fastapi.testclient import TestClient
from app.main import create_app


def test_health_endpoint_returns_ok():
    client = TestClient(create_app())
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && python -m pytest tests/test_health.py -q`  
Expected: FAIL with import/module-not-found errors because app scaffold does not exist yet.

- [ ] **Step 3: Add backend project config and app skeleton**

```toml
# backend/pyproject.toml
[project]
name = "rent-manager-backend"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
  "fastapi>=0.115.0",
  "uvicorn[standard]>=0.30.0",
  "pydantic-settings>=2.4.0",
  "sqlalchemy>=2.0.30",
  "alembic>=1.13.0",
  "psycopg[binary]>=3.2.0",
  "python-jose[cryptography]>=3.3.0",
  "httpx>=0.27.0",
  "reportlab>=4.2.0",
  "supabase>=2.5.0"
]

[project.optional-dependencies]
dev = [
  "pytest>=8.3.0",
  "pytest-cov>=5.0.0"
]
```

```python
# backend/app/main.py
from fastapi import FastAPI
from app.api.routes.health import router as health_router


def create_app() -> FastAPI:
    app = FastAPI(title="Rent Manager API", version="0.1.0")
    app.include_router(health_router)
    return app


app = create_app()
```

```python
# backend/app/api/routes/health.py
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "rent-manager-api"}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && python -m pytest tests/test_health.py -q`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend
git commit -m "feat: scaffold backend app with health endpoint"
```

---

## Task 2: Implement Multi-Tenant Schema and Alembic

**Files:**
- Create: `backend/app/db/base.py`
- Create: `backend/app/db/session.py`
- Create: `backend/app/models/tenant.py`
- Create: `backend/app/models/renter.py`
- Create: `backend/app/models/lease.py`
- Create: `backend/app/models/payment.py`
- Create: `backend/app/models/receipt.py`
- Create: `backend/alembic.ini`
- Create: `backend/alembic/env.py`
- Create: `backend/alembic/versions/20260416_01_initial_multitenant_schema.py`
- Create: `backend/tests/test_models_schema.py`

- [ ] **Step 1: Write failing schema smoke test**

```python
# backend/tests/test_models_schema.py
from sqlalchemy import inspect
from app.db.session import engine


def test_expected_tables_exist():
    inspector = inspect(engine)
    tables = set(inspector.get_table_names())

    assert "tenants" in tables
    assert "tenant_memberships" in tables
    assert "renters" in tables
    assert "leases" in tables
    assert "payments" in tables
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && python -m pytest tests/test_models_schema.py -q`  
Expected: FAIL because DB models/migrations are not present.

- [ ] **Step 3: Add models and migration**

```python
# backend/app/models/tenant.py
import uuid
from sqlalchemy import String, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class Tenant(Base):
    __tablename__ = "tenants"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    owner_user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)


class TenantMembership(Base):
    __tablename__ = "tenant_memberships"
    __table_args__ = (UniqueConstraint("tenant_id", "user_id", name="uq_tenant_membership"),)
```

```python
# backend/alembic/versions/20260416_01_initial_multitenant_schema.py
def upgrade() -> None:
    op.create_table(...)
    op.create_table(...)
    op.create_table(...)


def downgrade() -> None:
    op.drop_table("payments")
    op.drop_table("leases")
    op.drop_table("renters")
    op.drop_table("tenant_memberships")
    op.drop_table("tenants")
```

- [ ] **Step 4: Run migration and test**

Run: `cd backend && alembic upgrade head && python -m pytest tests/test_models_schema.py -q`  
Expected: migration succeeds and schema test passes.

- [ ] **Step 5: Commit**

```bash
git add backend
git commit -m "feat: add tenant-aware postgres schema with alembic"
```

---

## Task 3: Add Supabase JWT Auth Context and Me Endpoint

**Files:**
- Create: `backend/app/core/security.py`
- Create: `backend/app/services/auth_context_service.py`
- Create: `backend/app/api/routes/me.py`
- Modify: `backend/app/main.py`
- Create: `backend/tests/test_auth_context.py`

- [ ] **Step 1: Write failing auth-context tests**

```python
# backend/tests/test_auth_context.py
from fastapi.testclient import TestClient
from app.main import create_app


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
```

- [ ] **Step 2: Run tests to verify failure**

Run: `cd backend && python -m pytest tests/test_auth_context.py -q`  
Expected: FAIL because auth dependency and route are missing.

- [ ] **Step 3: Implement token verification and me route**

```python
# backend/app/api/routes/me.py
from fastapi import APIRouter, Depends
from app.services.auth_context_service import AuthContext, get_auth_context

router = APIRouter(prefix="/api", tags=["auth"])


@router.get("/me")
def me(ctx: AuthContext = Depends(get_auth_context)):
    return {
        "userId": str(ctx.user_id),
        "tenantId": str(ctx.tenant_id),
        "role": ctx.role,
    }
```

- [ ] **Step 4: Run tests to verify pass**

Run: `cd backend && python -m pytest tests/test_auth_context.py -q`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend
git commit -m "feat: add supabase jwt auth context and me endpoint"
```

---

## Task 4: Implement Renter CRUD APIs with Tenant Scoping

**Files:**
- Create: `backend/app/schemas/renter.py`
- Create: `backend/app/services/rent_service.py`
- Create: `backend/app/api/routes/renters.py`
- Modify: `backend/app/main.py`
- Create: `backend/tests/test_renters_api.py`
- Create: `backend/tests/test_tenant_isolation.py`

- [ ] **Step 1: Write failing API tests for renter CRUD**

```python
# backend/tests/test_renters_api.py

def test_create_renter(api_client, auth_header):
    payload = {
        "appartmentNumber": 101,
        "name": "John Doe",
        "rentAmount": 1200,
        "lastMonthPayed": "2026-01",
    }
    response = api_client.post("/api/renters", json=payload, headers=auth_header)

    assert response.status_code == 201
    body = response.json()
    assert body["appartmentNumber"] == 101


def test_list_renters_returns_computed_fields(api_client, auth_header):
    response = api_client.get("/api/renters", headers=auth_header)

    assert response.status_code == 200
    assert "unpaidMonths" in response.json()[0]
    assert "rentDue" in response.json()[0]
```

- [ ] **Step 2: Run test to verify failure**

Run: `cd backend && python -m pytest tests/test_renters_api.py -q`  
Expected: FAIL because renter routes/schemas/services are missing.

- [ ] **Step 3: Implement schemas, service, routes**

```python
# backend/app/services/rent_service.py
from datetime import date, datetime


def compute_rent_status(last_month_payed: str | None, rent_amount: int, today: date | None = None):
    if not last_month_payed:
        return None, None

    if today is None:
        today = date.today()

    paid = datetime.strptime(last_month_payed, "%Y-%m").date()
    months = max(0, (today.year - paid.year) * 12 + (today.month - paid.month))
    return months, months * rent_amount
```

```python
# backend/app/api/routes/renters.py
@router.post("/renters", status_code=201)
def create_renter(payload: CreateRenterRequest, ctx: AuthContext = Depends(get_auth_context)):
    return rent_service.create_renter(ctx.tenant_id, payload)
```

- [ ] **Step 4: Add tenant isolation test**

```python
# backend/tests/test_tenant_isolation.py

def test_tenant_cannot_read_other_tenant_renter(api_client, tenant_a_header, tenant_b_header):
    created = api_client.post(
        "/api/renters",
        headers=tenant_a_header,
        json={"appartmentNumber": 1, "name": "A", "rentAmount": 500, "lastMonthPayed": "2026-01"},
    ).json()

    response = api_client.get(f"/api/renters/{created['id']}", headers=tenant_b_header)
    assert response.status_code == 404
```

- [ ] **Step 5: Run tests to verify pass**

Run: `cd backend && python -m pytest tests/test_renters_api.py tests/test_tenant_isolation.py -q`  
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add backend
git commit -m "feat: add tenant-scoped renter crud api"
```

---

## Task 5: Implement Lease, Payment, and Receipt APIs

**Files:**
- Create: `backend/app/schemas/lease.py`
- Create: `backend/app/schemas/payment.py`
- Create: `backend/app/schemas/receipt.py`
- Create: `backend/app/services/lease_service.py`
- Create: `backend/app/services/payment_service.py`
- Create: `backend/app/services/receipt_service.py`
- Modify: `backend/app/api/routes/renters.py`
- Create: `backend/app/api/routes/receipts.py`
- Modify: `backend/app/main.py`
- Create: `backend/tests/test_payments_api.py`

- [ ] **Step 1: Write failing tests for payment flow and receipt generation**

```python
# backend/tests/test_payments_api.py

def test_record_payment_updates_last_month_and_creates_event(api_client, auth_header, renter_id):
    response = api_client.post(
        f"/api/renters/{renter_id}/payments",
        headers=auth_header,
        json={"monthPaid": "2026-02", "amountPaid": 1200},
    )

    assert response.status_code == 201
    body = response.json()
    assert body["monthPaid"] == "2026-02"


def test_generate_receipt_returns_signed_url(api_client, auth_header, payment_payload):
    response = api_client.post("/api/receipts", headers=auth_header, json=payment_payload)

    assert response.status_code == 201
    assert response.json()["downloadUrl"].startswith("http")
```

- [ ] **Step 2: Run test to verify failure**

Run: `cd backend && python -m pytest tests/test_payments_api.py -q`  
Expected: FAIL due to missing endpoints/services.

- [ ] **Step 3: Implement lease and payment endpoints**

```python
# backend/app/api/routes/renters.py
@router.put("/renters/{renter_id}/lease")
def upsert_lease(...):
    ...

@router.get("/renters/{renter_id}/payments")
def list_payments(...):
    ...

@router.post("/renters/{renter_id}/payments", status_code=201)
def add_payment(...):
    ...
```

- [ ] **Step 4: Implement receipt upload to Supabase Storage**

```python
# backend/app/services/receipt_service.py

def generate_and_store_receipt(tenant_id: str, payload: dict) -> dict:
    pdf_bytes = build_receipt_pdf(payload)
    object_path = f"receipts/{tenant_id}/apt{payload['appartmentNumber']}_{payload['monthPaid']}.pdf"
    storage_client.upload(object_path, pdf_bytes, {"content-type": "application/pdf"})
    signed = storage_client.create_signed_url(object_path, 3600)
    return {"path": object_path, "downloadUrl": signed}
```

- [ ] **Step 5: Run tests to verify pass**

Run: `cd backend && python -m pytest tests/test_payments_api.py -q`  
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add backend
git commit -m "feat: add lease payment and receipt api flows"
```

---

## Task 6: Add SQLite to Supabase Migration Script

**Files:**
- Create: `backend/scripts/migrate_sqlite_to_supabase.py`
- Create: `backend/tests/test_migration_script.py`

- [ ] **Step 1: Write failing migration script test**

```python
# backend/tests/test_migration_script.py

def test_migration_creates_single_tenant_and_imports_rows(sqlite_fixture, pg_session):
    from scripts.migrate_sqlite_to_supabase import run_migration

    result = run_migration(sqlite_fixture.path, tenant_name="Imported Tenant")

    assert result["tenantsCreated"] == 1
    assert result["rentersImported"] == 2
    assert result["paymentsImported"] >= 0
```

- [ ] **Step 2: Run test to verify failure**

Run: `cd backend && python -m pytest tests/test_migration_script.py -q`  
Expected: FAIL because migration script is missing.

- [ ] **Step 3: Implement idempotent import script**

```python
# backend/scripts/migrate_sqlite_to_supabase.py

def run_migration(sqlite_path: str, tenant_name: str) -> dict[str, int]:
    # 1. Create tenant and owner membership placeholders
    # 2. Import renters with tenant_id
    # 3. Import leases and payments via renter mapping
    # 4. Return row count report
    return {
        "tenantsCreated": 1,
        "rentersImported": renters_count,
        "leasesImported": leases_count,
        "paymentsImported": payments_count,
    }
```

- [ ] **Step 4: Run test to verify pass**

Run: `cd backend && python -m pytest tests/test_migration_script.py -q`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/scripts backend/tests/test_migration_script.py
git commit -m "feat: add sqlite to supabase migration script"
```

---

## Task 7: Scaffold Frontend with Auth and Protected Routing

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/lib/supabase.ts`
- Create: `frontend/src/lib/query-client.ts`
- Create: `frontend/src/features/auth/AuthGate.tsx`
- Create: `frontend/src/features/auth/LoginPage.tsx`
- Create: `frontend/src/features/auth/SignupPage.tsx`
- Create: `frontend/tests/auth-gate.test.tsx`

- [ ] **Step 1: Write failing auth gate test**

```tsx
// frontend/tests/auth-gate.test.tsx
import { render, screen } from "@testing-library/react";
import { AuthGate } from "../src/features/auth/AuthGate";

it("renders login when user is unauthenticated", () => {
  render(<AuthGate />);
  expect(screen.getByText("Sign in to Rent Manager")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `cd frontend && npm test -- auth-gate.test.tsx`  
Expected: FAIL due to missing app scaffold.

- [ ] **Step 3: Implement frontend bootstrap and auth gate**

```tsx
// frontend/src/features/auth/AuthGate.tsx
export function AuthGate() {
  const { user, loading } = useAuthSession();

  if (loading) return <div>Loading...</div>;
  if (!user) return <LoginPage />;
  return <RenterDashboardPage />;
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `cd frontend && npm test -- auth-gate.test.tsx`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend
git commit -m "feat: scaffold frontend auth and protected app shell"
```

---

## Task 8: Implement Frontend Renter Dashboard and Mutations

**Files:**
- Create: `frontend/src/api/client.ts`
- Create: `frontend/src/api/types.ts`
- Create: `frontend/src/features/renters/RenterDashboardPage.tsx`
- Create: `frontend/src/features/renters/RenterCard.tsx`
- Create: `frontend/src/features/renters/RenterDetailsPanel.tsx`
- Create: `frontend/src/features/renters/AddRenterModal.tsx`
- Create: `frontend/src/features/renters/MarkPaidModal.tsx`
- Create: `frontend/src/features/renters/PaymentHistoryList.tsx`
- Create: `frontend/tests/renter-dashboard.test.tsx`

- [ ] **Step 1: Write failing dashboard list test**

```tsx
// frontend/tests/renter-dashboard.test.tsx
import { render, screen } from "@testing-library/react";
import { RenterDashboardPage } from "../src/features/renters/RenterDashboardPage";

it("renders renter card from api data", async () => {
  render(<RenterDashboardPage />);
  expect(await screen.findByText(/Apt #101/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `cd frontend && npm test -- renter-dashboard.test.tsx`  
Expected: FAIL due to missing dashboard components and API mocks.

- [ ] **Step 3: Implement dashboard with query + mutations**

```tsx
// frontend/src/features/renters/RenterDashboardPage.tsx
const rentersQuery = useQuery({
  queryKey: ["renters"],
  queryFn: api.listRenters,
});

const createMutation = useMutation({
  mutationFn: api.createRenter,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["renters"] }),
});
```

- [ ] **Step 4: Implement mark-paid flow with receipt choice**

```tsx
// frontend/src/features/renters/MarkPaidModal.tsx
const submit = async () => {
  const payment = await api.recordPayment(renterId, values);
  if (shouldGenerateReceipt) {
    await api.generateReceipt(payment);
  }
  onComplete();
};
```

- [ ] **Step 5: Run tests to verify pass**

Run: `cd frontend && npm test -- renter-dashboard.test.tsx`  
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add frontend
git commit -m "feat: implement renter dashboard flows with api mutations"
```

---

## Task 9: Add E2E, CI, and Documentation Updates

**Files:**
- Create: `frontend/e2e/smoke.spec.ts`
- Create: `.github/workflows/ci.yml`
- Modify: `README.md`

- [ ] **Step 1: Write failing Playwright smoke test**

```ts
// frontend/e2e/smoke.spec.ts
import { test, expect } from "@playwright/test";

test("user can login and view dashboard", async ({ page }) => {
  await page.goto("http://localhost:5173/login");
  await page.getByLabel("Email").fill("owner@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Rent Manager Dashboard")).toBeVisible();
});
```

- [ ] **Step 2: Run e2e test to verify failure**

Run: `cd frontend && npx playwright test e2e/smoke.spec.ts`  
Expected: FAIL until backend/frontend local stack and seed auth are configured.

- [ ] **Step 3: Add CI workflow for backend and frontend**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: cd backend && pip install -e .[dev] && pytest -q

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: cd frontend && npm ci && npm run test
```

- [ ] **Step 4: Update README with run instructions**

```md
## SaaS Web Development

### Backend
cd backend
uvicorn app.main:app --reload

### Frontend
cd frontend
npm run dev
```

- [ ] **Step 5: Run full verification suite**

Run: `cd backend && pytest -q && cd ../frontend && npm test && npm run build`  
Expected: all tests pass and frontend builds.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/ci.yml README.md frontend/e2e/smoke.spec.ts
git commit -m "chore: add ci e2e and docs for hybrid saas stack"
```

---

## Final Validation Checklist

- [ ] Backend health endpoint works.
- [ ] Supabase JWT verification enforced on protected endpoints.
- [ ] Tenant isolation test suite passes.
- [ ] Renter, lease, payment, and receipt flows pass API tests.
- [ ] Frontend authentication and dashboard interaction tests pass.
- [ ] Receipt storage path uses tenant partitioning.
- [ ] Migration script imports SQLite data into tenant-scoped schema.
- [ ] CI runs backend and frontend suites on PRs.

---

## Recommended Execution Mode

1. Execute Task 1 through Task 3 with backend-only commits.
2. Execute Task 4 through Task 6 to complete API parity and migration.
3. Execute Task 7 through Task 9 for frontend parity and delivery hardening.
4. After each task, push branch and open incremental PRs to reduce review risk.
