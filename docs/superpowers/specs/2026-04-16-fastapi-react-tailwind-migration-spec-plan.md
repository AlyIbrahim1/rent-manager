# Rent Manager SaaS Web Migration - Hybrid Spec Plan

**Date:** 2026-04-16  
**Status:** Draft for Review

---

## Goal

Migrate Rent Manager from a desktop CustomTkinter app to a SaaS web application using a hybrid architecture:

- Supabase for auth, managed Postgres, storage, and row-level security
- FastAPI for domain business logic, orchestration, receipts, and SaaS integrations
- React + TypeScript + Tailwind for the frontend

Primary outcome: each landlord account (tenant) gets isolated data and can perform all current renter, lease, payment, and receipt workflows in a browser.

---

## Current Baseline

Current implementation characteristics:

- Desktop UI in `src/ui.py` and `src/widgets.py`
- Business logic in `src/models.py`
- SQLite persistence in `src/database.py`
- PDF receipt generation via ReportLab in `src/invoice.py`
- Unit tests in `tests/`

Current domain behaviors to preserve:

- Apartment number is the domain key (unique per tenant in SaaS)
- `unpaidMonths` and `rentDue` are computed, not stored
- Payment history is append-only
- Lease expiry warning threshold is 30 days
- Receipt generation is optional after marking a payment

---

## Target Stack

- Frontend: React 18 + TypeScript + Tailwind CSS
- Frontend auth/session client: `@supabase/supabase-js`
- Backend API: FastAPI (Python 3.12+)
- Database: Supabase Postgres
- ORM/migrations in backend: SQLAlchemy + Alembic
- Auth: Supabase Auth (email/password for MVP)
- Storage: Supabase Storage (receipt PDFs)
- API docs: OpenAPI (FastAPI built-in)
- Optional SaaS billing integration: Stripe (post-MVP or Phase 5)

---

## Hybrid Architecture

### Responsibility Split

Supabase handles platform concerns:

- User authentication and session issuance
- Managed Postgres and backups
- Row-level security policies for tenant data boundaries
- Object storage for receipt PDFs

FastAPI handles application concerns:

- Rent, lease, and payment business rules
- Validation and orchestration for multi-step domain actions
- Receipt PDF generation and upload to storage
- Webhook and integration endpoints (for billing and future workflows)

Frontend responsibilities:

- User auth flows via Supabase client
- App UI/UX and form handling
- Calling FastAPI for domain operations

### Request Flow

1. User signs in with Supabase Auth.
2. Frontend receives Supabase access token (JWT).
3. Frontend calls FastAPI with `Authorization: Bearer <token>`.
4. FastAPI verifies token using Supabase JWT verification configuration.
5. FastAPI resolves tenant context (`tenant_id`) and enforces tenant scoping.
6. FastAPI reads/writes Postgres through SQLAlchemy.

### Data Access Rule

For MVP, all domain reads/writes go through FastAPI to keep business logic centralized.

- Supabase client is used directly in frontend for auth/session only.
- Domain table access from frontend is avoided during MVP.

---

## SaaS Multi-Tenant Data Model

### Core Tables

- `tenants`
  - `id` (uuid, pk)
  - `name` (text)
  - `owner_user_id` (uuid, references auth user id)
  - `created_at`
- `tenant_memberships`
  - `tenant_id` (uuid)
  - `user_id` (uuid)
  - `role` (`owner` | `admin` | `member`)
  - Composite unique: (`tenant_id`, `user_id`)

### Domain Tables

- `renters`
  - `id` (uuid, pk)
  - `tenant_id` (uuid, indexed)
  - `appartmentNumber` (int, required)
  - `name` (text, required)
  - `rentAmount` (int, required)
  - `lastMonthPayed` (text, nullable, `YYYY-MM`)
  - Unique constraint: (`tenant_id`, `appartmentNumber`)
- `leases`
  - `id` (uuid, pk)
  - `tenant_id` (uuid, indexed)
  - `renter_id` (uuid fk -> renters.id)
  - `startDate`, `endDate`, `depositAmount`, `depositStatus`, `renewalNotes`
  - Unique constraint: (`tenant_id`, `renter_id`)
- `payments`
  - `id` (uuid, pk)
  - `tenant_id` (uuid, indexed)
  - `renter_id` (uuid fk -> renters.id)
  - `monthPaid`, `amountPaid`, `dateRecorded`

### Computed Fields (Never Stored)

Returned by FastAPI response models:

- `unpaidMonths`
- `rentDue`
- `leaseExpiringSoon`

---

## Security and Authorization

### Authentication

- Supabase Auth for sign-up/sign-in/session lifecycle.
- FastAPI trusts only validated Supabase JWTs.

### Authorization

- Tenant membership required for all domain endpoints.
- Every domain query filtered by `tenant_id` in backend.
- Supabase RLS policies enforce tenant boundary as defense-in-depth.

### Storage Security

- Receipts stored under tenant partitioned path, example: `receipts/{tenant_id}/apt{n}_{yyyy-mm}.pdf`.
- Access via signed URLs or controlled API download endpoints.

---

## Backend Specification (FastAPI)

### API Surface (MVP)

- `GET /health`
  - Liveness and version check.
- `GET /api/me`
  - Returns authenticated user + active tenant context.
- `GET /api/renters`
  - List renters for active tenant with computed status and lease summary.
- `POST /api/renters`
  - Add renter.
- `GET /api/renters/{renterId}`
  - Get one renter with lease and payment history.
- `PUT /api/renters/{renterId}`
  - Update renter fields.
- `DELETE /api/renters/{renterId}`
  - Delete renter and cascading lease/payments.
- `PUT /api/renters/{renterId}/lease`
  - Create or update lease details.
- `GET /api/renters/{renterId}/payments`
  - List payments newest first.
- `POST /api/renters/{renterId}/payments`
  - Record payment month and amount, update `lastMonthPayed`, return receipt payload.
- `POST /api/receipts`
  - Generate receipt PDF, upload to Supabase Storage, return path + signed URL.
- `GET /api/receipts/{receiptId}`
  - Return secure download URL or stream file.

### Validation Rules

- `appartmentNumber`: positive integer, unique within tenant.
- `name`: required, non-empty.
- `rentAmount`: positive integer.
- `lastMonthPayed`: optional, `YYYY-MM` if provided.
- Lease date format: `YYYY-MM-DD`.
- Lease end date must be after lease start date.
- `depositStatus` in `pending | paid | returned`.
- Payment amount must be positive integer.
- Payment month must be valid `YYYY-MM`.

### Service Layer Responsibilities

- `auth_context_service`
  - JWT verification and tenant membership resolution.
- `rent_service`
  - Rent status calculations and renter CRUD orchestration.
- `lease_service`
  - Lease validation and upsert behavior.
- `payment_service`
  - Append-only event creation and payment history ordering.
- `receipt_service`
  - PDF generation, storage upload, signed URL creation.
- `billing_service` (phase-gated)
  - Subscription state mapping and webhook processing.

No route handler should directly implement domain business rules.

---

## Frontend Specification (React + TypeScript + Tailwind)

### Information Architecture

- Auth pages for sign-in and sign-up.
- Main renter dashboard for day-to-day operations.
- Card grid + details panel interaction model preserved from desktop.
- Modal workflows for add renter, mark paid, and receipt confirmation.

### Route Plan

- `/login`
- `/signup`
- `/app` (protected)
- `/app/renters/:renterId` (optional route sync with selected card)

### Component Map (MVP)

- `AuthGate`
- `RenterDashboardPage`
- `RenterCardGrid`
- `RenterCard`
- `RenterDetailsPanel`
- `AddRenterModal`
- `MarkPaidModal`
- `ReceiptChoiceModal`
- `LeaseSection`
- `PaymentHistoryList`
- `InlineError`

### Data and State

- Supabase client manages auth state and token refresh.
- TanStack Query handles server state, caching, and invalidation.
- Form state managed locally (React Hook Form + Zod preferred).
- FastAPI remains source-of-truth for computed rent fields.

### Tailwind Strategy

- Define semantic design tokens in Tailwind config.
- Preserve status accents from current UX:
  - Overdue: red
  - Paid: green
  - Lease expiring soon: amber
- Ensure responsive behavior for desktop and mobile.

---

## SaaS Concerns

### Tenant Lifecycle

- First sign-up creates tenant + owner membership.
- Future team invites can be added after MVP.

### Billing Boundary

- Billing is isolated behind FastAPI endpoints and webhooks.
- Initial rollout can launch with a free tier and feature flags.

### Auditability

- Payment events remain append-only.
- Key write operations should be loggable with actor and tenant context.

---

## Migration Phases

### Phase 0: Foundation

- Create `backend/` and `frontend/` projects.
- Provision Supabase project and environment variables.
- Add CI skeleton for backend and frontend tests.
- Keep desktop app runnable in parallel.

Exit criteria:

- Backend and frontend boot successfully.
- Supabase connectivity validated in local environment.
- Existing desktop tests remain green.

### Phase 1: Tenant-Aware Backend Core

- Set up FastAPI app factory, settings, logging, CORS.
- Configure SQLAlchemy + Alembic for Supabase Postgres.
- Create initial tenant-aware schema and indexes.
- Port computation helpers from `src/models.py`.

Exit criteria:

- `GET /health` passes.
- Migrations apply cleanly to empty Supabase database.

### Phase 2: Auth + Authorization Integration

- Implement Supabase JWT verification in FastAPI.
- Implement tenant context resolution (`/api/me`).
- Add RLS policies and backend tenant filtering.
- Add tests for tenant isolation and unauthorized access.

Exit criteria:

- Tenant A cannot access Tenant B records in tests.
- Authenticated domain endpoints require valid bearer token.

### Phase 3: Domain API Parity

- Implement renter, lease, payment, and receipt endpoints.
- Implement receipt upload/download through Supabase Storage.
- Add API integration tests and error model conventions.

Exit criteria:

- All MVP endpoints documented in OpenAPI.
- Backend suite passes including tenant isolation tests.

### Phase 4: Frontend Auth + Core UI

- Bootstrap React + TypeScript + Tailwind app shell.
- Implement login/signup and protected app routes.
- Implement dashboard shell with card grid + details panel.

Exit criteria:

- User can authenticate and reach protected dashboard.
- Empty and loading states behave correctly.

### Phase 5: Frontend Feature Parity

- Implement add/edit/delete renter flows.
- Implement lease editing.
- Implement mark-paid, payment history, and receipt actions.
- Add e2e coverage for critical workflows.

Exit criteria:

- Manual parity checklist completed against desktop behavior.
- Core e2e paths pass.

### Phase 6: SaaS Hardening and Cutover

- Add billing integration and webhook handling (if in scope for launch).
- Validate performance, accessibility, and error observability.
- Update docs, runbooks, and support flows.
- Freeze desktop feature work and announce web cutover.

Exit criteria:

- Production-ready deployment and runbook.
- Stakeholder sign-off on parity, security, and reliability.

---

## Data Migration Plan

### Strategy

- Source data from existing SQLite file: `data/rent_data.db`.
- Create an initial tenant for migrated legacy data.
- Import renter/lease/payment records into tenant-aware Postgres schema.

### Steps

- Backup source SQLite file before migration.
- Run Alembic migrations for target Supabase schema.
- Execute idempotent migration script:
  - create tenant
  - map legacy apartment records to renter rows
  - map leases and payments by renter linkage
  - assign `tenant_id` to all imported rows
- Generate validation report:
  - row counts per table
  - duplicate apartment checks per tenant
  - referential integrity checks

### Rollback

- If validation fails, discard imported transaction and rerun after correction.
- Keep backup artifact until cutover sign-off.

---

## Testing Strategy

### Backend

- Unit tests for rent computations, validators, and service logic.
- Integration tests for CRUD and payment history behaviors.
- Auth tests for token verification and tenant membership checks.
- Tenant isolation tests for all key endpoints.

### Frontend

- Unit tests for formatting and validation logic.
- Component tests for renter cards, details panel, and modals.
- Integration tests with mocked API responses.
- E2E tests for login, add renter, mark paid, and download receipt.

### Security and Contract Confidence

- Validate RLS policies with positive and negative test cases.
- Generate TypeScript API types from OpenAPI.
- Add contract smoke tests for key payload shapes.

---

## Non-Functional Requirements

- Handle at least 200 units per tenant with responsive UI behavior.
- Enforce tenant data isolation at auth, API, and DB policy layers.
- Provide accessible form labeling and keyboard support for core flows.
- Keep receipt file naming deterministic and auditable.
- Maintain operational logs sufficient for debugging auth and billing events.

---

## Risks and Mitigations

- Risk: token verification or auth misconfiguration.
  - Mitigation: integration tests against Supabase JWT settings and strict env validation.
- Risk: incorrect tenant isolation leading to data leaks.
  - Mitigation: layered enforcement (FastAPI filters + RLS) and explicit isolation test matrix.
- Risk: behavior drift from desktop logic.
  - Mitigation: port existing calculation tests first and reuse expected outputs.
- Risk: migration data mismatches.
  - Mitigation: idempotent import script, backup, and row-level validation reports.
- Risk: first launch scope too broad for SaaS extras.
  - Mitigation: prioritize parity MVP; gate billing/team features by phase.

---

## Out of Scope (This Migration)

- Enterprise SSO and advanced identity providers.
- Complex RBAC beyond owner/admin/member.
- Multi-property portfolio analytics.
- Email/SMS receipt delivery automation.
- Native mobile app clients.

---

## Acceptance Criteria

- User can sign up, sign in, and access a protected renter dashboard.
- Tenant data is isolated and verified by automated tests.
- Web app supports renter, lease, payment, and receipt workflows with desktop parity.
- Computed rent status matches current behavior for tested scenarios.
- Payment history remains append-only and sorted newest first.
- Receipts are generated and stored in tenant-scoped storage paths.
- CI runs backend and frontend tests successfully.
- Desktop code remains available until explicit deprecation sign-off.

---

## Follow-Up Deliverable

After this hybrid spec is approved, create an implementation plan in:

`docs/superpowers/plans/2026-04-16-fastapi-supabase-hybrid-migration.md`

The plan should break implementation into task-level checklists with test-first steps and clear commit boundaries.
