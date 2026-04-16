# Rent Manager

Desktop app for individual landlords to manage renters, leases, payments, and PDF receipts.

## Overview

Rent Manager is a CustomTkinter desktop application backed by SQLite. It follows a layered design so business logic can be reused in a future web migration.

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
- CustomTkinter 5.2.2
- SQLite (single local DB file)
- ReportLab (PDF receipts)

## Installation

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Ensure required directories/files exist:

```bash
mkdir -p data invoices assets
```

Required icon path:
- assets/app_icon.ico

## Running the App

Default:

```bash
python main.py
```

Repository virtualenv (recommended in this project):

```bash
.venv/Scripts/python.exe main.py
```

## SaaS Web Development

### Backend

```bash
cd backend
/home/alyibrahim/projects/rent-manager/.venv/bin/python -m uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Architecture

- src/database.py
    - Raw SQLite CRUD only
    - Creates/migrates schema on startup
    - No business rules
- src/models.py
    - Business logic (rent calculations, lease checks, payment recording)
    - Imports database only
- src/ui.py and src/widgets.py
    - GUI only
    - Imports models, never database directly
- src/invoice.py
    - Pure receipt PDF generation via ReportLab

## Database Schema

renters:
- appartmentNumber INTEGER PRIMARY KEY
- name TEXT NOT NULL
- rentAmount INTEGER NOT NULL
- lastMonthPayed TEXT

leases:
- appartmentNumber INTEGER PRIMARY KEY (FK -> renters.appartmentNumber)
- startDate TEXT
- endDate TEXT
- depositAmount INTEGER
- depositStatus TEXT
- renewalNotes TEXT

payments:
- id INTEGER PRIMARY KEY AUTOINCREMENT
- appartmentNumber INTEGER NOT NULL (FK -> renters.appartmentNumber)
- monthPaid TEXT NOT NULL
- amountPaid INTEGER NOT NULL
- dateRecorded TEXT NOT NULL

Notes:
- unpaidMonths and rentDue are not stored in the database
- Existing legacy renters tables are migrated automatically

## Testing

```bash
python -m pytest -q
```

Backend API tests:

```bash
cd backend
/home/alyibrahim/projects/rent-manager/.venv/bin/python -m pytest -q
```

Frontend tests/build:

```bash
cd frontend
npm run test:run
npm run build
```

## License

Private / Personal Use. All rights reserved.

---

Last updated: 2026-04-16
