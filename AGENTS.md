# AGENTS.md

This file provides guidance to AI Agents when working with code in this repository.

## Instructions

**On git commits:** Never add a co-author note

## Running the App in Dev

Supabase (auth, database, storage) runs remotely — no local Supabase setup needed. You only run the backend and frontend locally.

**Terminal 1 — Backend** (runs at `http://localhost:8000`):

```bash
cd backend
/home/alyibrahim/projects/rent-manager/.venv/bin/python -m uvicorn app.main:app --reload
```

**Terminal 2 — Frontend** (runs at `http://localhost:5173`):

```bash
cd frontend
npm run dev
```

### Required `.env` files

`backend/.env`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_JWT_SECRET=<Project Settings → API → JWT Secret>
SUPABASE_SERVICE_ROLE_KEY=<Project Settings → API → service_role key>
DATABASE_URL=postgresql+psycopg://postgres:<password>@db.<ref>.supabase.co:5432/postgres
```

`frontend/.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=<Project Settings → API → anon key>
VITE_API_BASE_URL=http://localhost:8000
```

> `CORS_ORIGINS` does not need to be set locally — it defaults to `http://localhost:5173`.

## Installing Dependencies

Backend:

```bash
cd backend
pip install -e .[dev]
```

Frontend:

```bash
cd frontend
npm install
```

## Architecture

**Backend entrypoint:** `backend/app/main.py` — FastAPI app factory and router registration.

**Frontend entrypoint:** `frontend/src/main.tsx` — React bootstrap + QueryClient provider.

**Auth layer (`backend/app/core/security.py`, `backend/app/services/auth_context_service.py`):** Verifies Supabase bearer tokens and provides tenant-scoped request context.

**API layer (`backend/app/api/routes/*.py`):** Health, auth context (`/api/me`), renter CRUD, lease/payment operations, and receipt generation endpoints.

**Data layer (`backend/app/models/*.py`, `backend/app/db/*`):** SQLAlchemy models and sessions over PostgreSQL/Supabase with `tenant_id` isolation.

**Frontend features (`frontend/src/features/**`):** Auth gate, renter dashboard, renter cards/details, add renter, mark paid, payment history.

**Migration layer (`backend/scripts/migrate_sqlite_to_supabase.py`):** Imports legacy SQLite renter/lease/payment data into tenant-scoped schema.

## Database Schema

Primary backend tables:

- **`tenants`** — tenant workspace owner and metadata
- **`tenant_memberships`** — user-to-tenant role mapping
- **`renters`** — tenant-scoped renter records (`appartmentNumber`, `name`, `rentAmount`, `lastMonthPayed`)
- **`leases`** — tenant-scoped lease details
- **`payments`** — tenant-scoped payment history events
- **`receipts`** — generated receipt location and download URL

`unpaidMonths` and `rentDue` are computed in service/API output and are not persisted.

## Layer Rules

- `backend/app/api/routes/*` should depend on services + schemas, not raw DB logic
- `backend/app/services/*` should contain domain behavior and tenant-scoped checks
- `backend/app/models/*` should remain persistence models (no API/UI behavior)
- `frontend/src/features/*` should call `frontend/src/api/client.ts` for server interactions

Keep backend/frontend boundaries clean to preserve maintainability and testability.

## Testing

Backend:

```bash
cd backend
/home/alyibrahim/projects/rent-manager/.venv/bin/python -m pytest -q
```

Frontend:

```bash
cd frontend
npm run test:run
npm run build
```

## PRD

Full product requirements: `PRD.md`

## Commit Style

When creating git commits, do NOT add a `Co-Authored-By` line. Keep commit messages clean without any co-author attribution.
