# Rent Manager

> Multi-tenant property management — track renters, leases, payments, and generate PDF receipts from a clean web dashboard.

[![CI](https://github.com/AlyIbrahim1/RentManagement_app/actions/workflows/ci.yml/badge.svg)](https://github.com/AlyIbrahim1/RentManagement_app/actions/workflows/ci.yml)
![Python](https://img.shields.io/badge/Python-3.12+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-auth%20%26%20storage-3ECF8E?logo=supabase&logoColor=white)

---

## What It Does

Rent Manager gives landlords a single place to stay on top of their properties:

- **Dashboard** — portfolio KPIs (total revenue, collection rate, occupancy, pending balance) plus a searchable renter ledger
- **Renter details** — side panel on desktop / expandable sheet on mobile; shows balance, overdue badge, last paid month, and payment history
- **Payment tracking** — mark months as paid with a two-section modal (payment details + optional receipt toggle); append-only payment history
- **Lease management** — store and update lease details per renter
- **PDF receipts** — generate and store signed-payment receipts in one click
- **Multi-tenant** — each landlord workspace is fully isolated; no cross-tenant data leakage
- **Auth options** — email+password, Google OAuth, and email-based password reset
- **Legal transparency** — Privacy Policy and Terms of Service accessible from every auth screen
- **Mobile-friendly** — responsive layout with bottom nav bar and FAB for quick actions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend API | FastAPI + SQLAlchemy + Alembic |
| Auth & Database | Supabase (PostgreSQL + JWT) |
| File Storage | Supabase Storage |
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| PDF Generation | ReportLab |
| CI | GitHub Actions |

---

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/AlyIbrahim1/RentManagement_app.git
cd RentManagement_app

# Backend
cd backend && pip install -e .[dev] && cd ..

# Frontend
cd frontend && npm install && cd ..
```

### 2. Configure environment

**`backend/.env`**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_JWT_SECRET=<Project Settings → API → JWT Secret>
SUPABASE_SERVICE_ROLE_KEY=<Project Settings → API → service_role key>
DATABASE_URL=postgresql+psycopg://postgres:<password>@db.<ref>.supabase.co:5432/postgres
```

**`frontend/.env`**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=<Project Settings → API → anon key>
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Run

```bash
# Terminal 1 — Backend (http://localhost:8000)
cd backend
uvicorn app.main:app --reload

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

---

## Architecture

```
rent-manager/
├── backend/
│   └── app/
│       ├── api/routes/     # FastAPI route handlers
│       ├── services/       # Domain logic + tenant-scoped checks
│       ├── models/         # SQLAlchemy persistence models
│       └── core/           # Auth context, security, config
├── frontend/
│   └── src/
│       ├── features/       # Auth gate, dashboard, renter flows
│       └── api/            # Typed API client
└── .github/workflows/      # CI pipeline
```

**Key design decisions:**
- `unpaidMonths` and `rentDue` are computed at query time — never persisted
- All protected API operations are tenant-scoped; cross-tenant access returns `404`
- Financial amounts are stored as whole-dollar integers

---

## Testing

```bash
# Backend
cd backend && python -m pytest -q

# Frontend
cd frontend && npm run test:run && npm run build
```

---

## Data Migration

Importing from a legacy SQLite database:

```bash
cd backend
python -c "
from scripts.migrate_sqlite_to_supabase import run_migration
print(run_migration('/path/to/legacy.sqlite', 'My Tenant Workspace'))
"
```

---

## License

Private / Personal Use — All rights reserved.

[Privacy Policy](docs/legal/privacy-policy.md) · [Terms of Service](docs/legal/terms-of-service.md)
