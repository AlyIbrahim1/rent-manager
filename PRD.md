# Rent Manager — Product Requirements Document

**Date:** 2026-04-16
**Status:** Approved

---

## 1. Product Overview

**Rent Manager** is a desktop application for individual landlords to manage apartment renters, track rent payments, manage leases, and generate receipts. The primary platform is Windows desktop (CustomTkinter). The data layer and business logic must be kept platform-agnostic to enable a future web migration.

**Target user:** A single landlord managing one residential building with multiple apartment units.

**Core principles:**
- Apartment number is the primary key — it is the anchor for all renter, lease, and payment data
- All financial figures in whole-dollar integers
- No authentication required (single-user desktop tool)

---

## 2. Renter Management

The core of the app — a scrollable grid of apartment cards, each showing the unit's current occupant and payment status.

### Renter Record Fields

| Field | Type | Notes |
|---|---|---|
| `appartmentNumber` | Integer PK | Positive integer, unique |
| `name` | Text | Tenant full name |
| `rentAmount` | Integer | Monthly rent in whole dollars |
| `lastMonthPayed` | Text | Format: YYYY-MM |

### Card Display

Each card shows apartment number, tenant name, rent amount, unpaid months (computed), and total amount due (computed). Color-coded border: **green** if fully paid up, **red** if any months are overdue.

### Operations

- **Add renter** — modal with apartment number, name, rent amount, optional last month paid
- **Edit renter** — side panel with all fields editable; unpaid months and amount due update live as you type
- **Mark paid** — dialog to select month + year; updates `lastMonthPayed` and triggers recalculation
- **Delete renter** — two-step confirmation to prevent accidental deletion

### Data Integrity

`unpaidMonths` and `rentDue` are always computed from `lastMonthPayed` and `rentAmount` at display time — they are **not** stored. The database keeps only the source fields.

---

## 3. Lease Management

Each apartment unit can have an associated lease record.

### Lease Record Fields

| Field | Type | Notes |
|---|---|---|
| `appartmentNumber` | Integer FK | Links to renter |
| `startDate` | Text | YYYY-MM-DD |
| `endDate` | Text | YYYY-MM-DD; must be after startDate |
| `depositAmount` | Integer | Security deposit in whole dollars |
| `depositStatus` | Text | `pending` / `paid` / `returned` |
| `renewalNotes` | Text | Free-text, optional |

### Display

Lease details appear in the side panel beneath renter fields. Cards for leases expiring within **30 days** display an **amber/yellow** visual accent.

### Operations

- **Add / edit lease** — inline in the side panel; saved with the same Save button as renter edits
- **Track deposit status** — dropdown to update between `pending`, `paid`, `returned`

### Constraints

- One active lease per apartment at a time
- End date must be after start date
- Lease is optional — apartments can exist without one (backward-compatible)

---

## 4. Payment Tracking

### Computed Fields (never stored)

| Field | Computation |
|---|---|
| Unpaid months | Months elapsed since `lastMonthPayed` to today |
| Total due | Unpaid months × `rentAmount` |

Calculated live at display time on both the card and side panel.

### Payment History Log

Each "Mark Paid" action appends one record:

| Field | Type | Notes |
|---|---|---|
| `id` | Integer PK | Auto-increment |
| `appartmentNumber` | Integer FK | |
| `monthPaid` | Text | YYYY-MM |
| `amountPaid` | Integer | Snapshot at time of payment |
| `dateRecorded` | Text | Auto-set to today, YYYY-MM-DD |

### Display

Side panel shows a scrollable history list beneath lease details — most recent first. Each row: month covered, amount paid, date recorded.

### Constraints

- Append-only — no editing or deletion of past records
- Every "Mark Paid" action writes exactly one payment event

---

## 5. Invoicing (PDF Receipts)

### Receipt Contents

Tenant name, apartment number, month covered, amount paid, date issued.

### Behavior

- After confirming "Mark Paid", a prompt asks: **"Generate receipt?" (Yes / No)**
- If Yes, PDF saved to `invoices/` as `apt{N}_{YYYY-MM}.pdf`
- Re-generatable from payment history — click any past entry → "Generate Receipt"
- Local file only, no email delivery

### Implementation

- Uses ReportLab (already in `requirements.txt`)
- Lives in `src/invoice.py` — pure function: takes a data dict, returns output file path
- No UI logic inside the invoice module

---

## 6. Architecture & Data Model

### Layer Separation

| Module | Responsibility | May import |
|---|---|---|
| `src/database.py` | Raw SQLite CRUD only | `sqlite3` |
| `src/models.py` *(new)* | Business logic: rent calc, lease expiry, payment recording | `database` |
| `src/ui.py`, `src/widgets.py` | UI only | `models`, `ctk` |
| `src/invoice.py` | Pure PDF generation | `reportlab` |

No UI imports in database or models. No database imports in UI.

### Database Schema

**`renters`** — `appartmentNumber` PK, `name`, `rentAmount`, `lastMonthPayed`

**`leases`** — `appartmentNumber` FK, `startDate`, `endDate`, `depositAmount`, `depositStatus`, `renewalNotes`

**`payments`** — `id` PK (auto), `appartmentNumber` FK, `monthPaid`, `amountPaid`, `dateRecorded`

### Removed Columns

`unpaidMonths` and `rentDue` are dropped from `renters`. Always computed, never stored. Existing data requires a migration.

### Future Web Migration Path

1. Replace `src/database.py` with a PostgreSQL adapter
2. Wrap `src/models.py` in a REST API
3. Replace the CustomTkinter UI with a web frontend

---

## 7. Non-Functional Requirements

- **Platform:** Windows desktop (WSL-compatible), Python 3.12+
- **UI framework:** CustomTkinter 5.2.2
- **Database:** SQLite, single file in `data/`
- **PDF output:** ReportLab, saved to `invoices/`
- **Window:** Fixed 1000×650, unresizable (relaxable in future web version)
- **Performance:** All operations perceptibly instant for up to 200 units
- **Auth:** None — single-user tool
