# Rent Manager

SaaS web application for managing renters, leases, payments, and PDF receipts.

## Overview

Rent Manager is now a web-first stack:
- Backend: FastAPI + SQLAlchemy + Alembic
- Frontend: React + TypeScript + Vite + Tailwind
- Auth/Data/Storage: Supabase

Core behavior:
- Apartment number is the primary key for each unit
- Financial amounts are whole-dollar integers
- Unpaid months and rent due are computed live (never stored)

## Features

- Add, edit, and delete renter records
- Mark rent paid by month/year
- Append-only payment history per apartment
- Optional PDF receipt generation after payment confirmation
- Regenerate receipts from historical payment entries
- Lease details per apartment (start/end, deposit amount/status, renewal notes)
- Lease-expiry visual warning (within 30 days)
- Card status accents:
    - Green: paid up
    - Red: overdue
    - Amber: lease expiring soon

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

## License

Private / Personal Use. All rights reserved.

---

Last updated: 2026-04-16
