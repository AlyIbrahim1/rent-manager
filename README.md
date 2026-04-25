# Rent Manager

SaaS web application for managing renters, leases, payments, and PDF receipts.

## Overview

Rent Manager is now a web-first stack:
- Backend: FastAPI + SQLAlchemy + Alembic
- Frontend: React + TypeScript + Vite + Tailwind
- Auth/Data/Storage: Supabase

Core behavior:
- Apartment number is a core business identifier per tenant
- Financial amounts are whole-dollar integers
- Unpaid months and rent due are computed live (never stored)
- Protected API operations are bearer-token authenticated and tenant scoped

## Features

- Supabase JWT-based auth context (`/api/me`)
- Tenant-scoped renter create/list/get flows
- Lease upsert per renter
- Append-only payment history and mark-paid flow
- Receipt generation endpoint with tenant-partitioned paths
- Legacy SQLite-to-tenant migration utility

## Tech Stack

- Python 3.12+
- FastAPI
- SQLAlchemy + Alembic
- Supabase
- React 18 + TypeScript + Tailwind
- ReportLab (PDF receipts)

## Installation

1. Backend dependencies:

```bash
cd backend
pip install -e .[dev]
```

2. Frontend dependencies:

```bash
cd frontend
npm install
```

## Environment

Backend uses `backend/.env` (see `backend/.env.example`):
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_JWT_SECRET`
- `SUPABASE_STORAGE_BUCKET`

Frontend uses `frontend/.env` (see `frontend/.env.example`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE_URL`

## Running the App

### Backend

```bash
cd backend
/home/alyibrahim/projects/rent-manager/.venv/bin/python -m uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm run dev
```

## Architecture

- backend/app
    - API routes, services, DB models, auth context, migrations
- frontend/src
    - Auth gate, renter dashboard, query/mutation-driven UI
- .github/workflows/ci.yml
    - Backend and frontend CI checks

## Testing

Backend tests:

```bash
cd backend
/home/alyibrahim/projects/rent-manager/.venv/bin/python -m pytest -q
```

Frontend tests and build:

```bash
cd frontend
npm run test:run
npm run build
```

## Data Migration

Import legacy SQLite data into the tenant-scoped schema:

```bash
cd backend
/home/alyibrahim/projects/rent-manager/.venv/bin/python -c "from scripts.migrate_sqlite_to_supabase import run_migration; print(run_migration('/path/to/legacy.sqlite', 'Imported Tenant'))"
```

## CI

GitHub Actions workflow in `.github/workflows/ci.yml` runs:
- Backend: install + `pytest -q`
- Frontend: `npm ci` + `npm run test:run`

## License

Private / Personal Use. All rights reserved.

## Legal

- Privacy Policy: `docs/legal/privacy-policy.md`
- Terms of Service: `docs/legal/terms-of-service.md`

---

Last updated: 2026-04-16
