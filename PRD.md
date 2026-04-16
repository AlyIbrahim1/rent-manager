# Rent Manager — Product Requirements Document

**Date:** 2026-04-16
**Status:** Approved

---

## 1. Product Overview

**Rent Manager** is a multi-tenant SaaS web application for landlords and property teams to manage renters, leases, payments, and receipts.

**Target user:** Property owners and staff managing one or more residential properties inside isolated tenant workspaces.

**Core principles:**
- Every protected operation is tenant-scoped
- Apartment number is a key business identifier per tenant
- Financial values use whole-dollar integers
- `unpaidMonths` and `rentDue` are computed, never stored

---

## 2. Authentication and Tenant Isolation

- Authentication uses Supabase bearer JWTs.
- API extracts auth context (`userId`, `tenantId`, `role`) from token claims.
- Protected endpoints reject missing/invalid tokens with `401`.
- Tenant isolation is enforced in service/database access; cross-tenant resources return `404`.

---

## 3. Renter Management

Renter management is tenant-scoped and exposed via `/api/renters`.

### Renter Record Fields

| Field | Type | Notes |
|---|---|---|
| `id` | UUID/String | Server-generated renter identifier |
| `appartmentNumber` | Integer | Positive integer, business-facing apartment number |
| `name` | Text | Tenant full name |
| `rentAmount` | Integer | Monthly rent in whole dollars |
| `lastMonthPayed` | Text | Format: YYYY-MM |

### Computed Outputs

API responses provide:
- `unpaidMonths`
- `rentDue`

Both are computed from `lastMonthPayed` and `rentAmount`.

### Operations

- **Create renter** — `POST /api/renters`
- **List renters** — `GET /api/renters`
- **Get renter** — `GET /api/renters/{renter_id}`

### Data Integrity Rules

- Renter queries must be tenant-filtered.
- Computed fields are never persisted.

---

## 4. Lease Management

Lease operations are tenant-scoped and associated to renter records.

### Lease Record Fields

| Field | Type | Notes |
|---|---|---|
| `renter_id` | UUID/String FK | Links lease to renter |
| `startDate` | Text | YYYY-MM-DD |
| `endDate` | Text | YYYY-MM-DD; must be after startDate |
| `depositAmount` | Integer | Security deposit in whole dollars |
| `depositStatus` | Text | `unpaid` / `paid` / `returned` |
| `renewalNotes` | Text | Free-text, optional |

### Operations

- **Upsert lease** — `PUT /api/renters/{renter_id}/lease`

### Constraints

- Lease write requires renter to exist in current tenant.
- One lease record per renter in current implementation.

---

## 5. Payment Tracking

Payment operations are tenant-scoped and append-only.

### Payment Event Fields

| Field | Type | Notes |
|---|---|---|
| `id` | UUID/String | Server-generated |
| `monthPaid` | Text | YYYY-MM |
| `amountPaid` | Integer | Snapshot at record time |
| `dateRecorded` | Text | YYYY-MM-DD |

### Operations

- **List payments** — `GET /api/renters/{renter_id}/payments`
- **Add payment** — `POST /api/renters/{renter_id}/payments`

### Behavior

- On payment creation, renter `lastMonthPayed` is updated.
- Payment history remains append-only.

---

## 6. Receipts

Receipt generation is available via `POST /api/receipts`.

### Request Fields

| Field | Type | Notes |
|---|---|---|
| `appartmentNumber` | Integer | Apartment number for receipt naming |
| `monthPaid` | Text | Covered month |
| `amountPaid` | Integer | Paid amount |
| `name` | Text | Renter name |

### Response Fields

| Field | Type | Notes |
|---|---|---|
| `path` | Text | Tenant-partitioned receipt object path |
| `downloadUrl` | Text | Signed/public URL-like link |

---

## 7. Frontend Requirements

Frontend stack: React + TypeScript + Vite + Tailwind + TanStack Query.

### Required UX Flows

- Auth gate renders login for unauthenticated users.
- Authenticated users see renter dashboard.
- Dashboard supports renter listing, add renter, renter detail selection, mark paid flow.
- Payment history is visible for selected renter.

### Frontend Test Coverage

- Auth gate behavior test.
- Dashboard renter-card rendering test.
- Playwright smoke spec for login/dashboard path.

---

## 8. Architecture & Data Model

### Backend Layers

| Module | Responsibility |
|---|---|
| `backend/app/api/routes/*` | HTTP routing and dependency wiring |
| `backend/app/services/*` | Business logic and tenant checks |
| `backend/app/models/*` | SQLAlchemy persistence models |
| `backend/app/schemas/*` | Request/response contracts |
| `backend/alembic/*` | Schema migration management |

### Core Tables

- `tenants`
- `tenant_memberships`
- `renters`
- `leases`
- `payments`
- `receipts`

### Legacy Migration

`backend/scripts/migrate_sqlite_to_supabase.py` imports legacy SQLite data into tenant-scoped schema and reports import counts.

---

## 9. Non-Functional Requirements

- **Backend runtime:** Python 3.12+
- **Frontend runtime:** Node 20+
- **API performance target:** CRUD operations perceptibly instant for typical small/medium portfolios
- **Security:** Bearer token required for protected routes, tenant isolation enforced server-side
- **Quality gates:** Backend pytest + frontend unit tests + frontend build in CI on push/PR
- **Portability:** Web-based deployment model; no desktop UI dependency

---

## 10. CI Requirements

- Backend CI job must install backend dev dependencies and run `pytest -q`.
- Frontend CI job must run `npm ci` and `npm run test:run`.
- CI runs on pushes to `main` and pull requests.

