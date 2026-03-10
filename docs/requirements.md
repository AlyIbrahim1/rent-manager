# RentManager — Requirements Document

## 1. Overview

**RentManager** is a desktop GUI application for individual landlords and property managers to track tenant rent payment status and generate PDF invoices. It runs locally on Windows (including WSL) and stores all data in a local SQLite database. There is no network component; all data remains on the host machine.

**Version:** 0.1 (pre-release)
**Entry point:** `main.py`
**Primary language:** Python 3.8+

---

## 2. Stakeholders

| Role | Description |
|---|---|
| Primary User | Individual property manager or landlord (personal use) |
| Developer / Maintainer | Application author; responsible for bug fixes and feature additions |

---

## 3. Functional Requirements

| ID | Requirement | Status |
|---|---|---|
| FR-001 | The system shall maintain a `renters` table in a local SQLite database (`data/rent_data.db`) with fields: `appartmentNumber` (PK), `name`, `rentAmount`, `lastMonthPayed`, `unpaidMonths`, `rentDue`. | [x] |
| FR-002 | The system shall initialize the database and required tables on application startup. | [x] |
| FR-003 | The system shall allow the user to add a new tenant record (apartment number, name, rent amount, last month paid, unpaid months, rent due). | [x] |
| FR-004 | The system shall persist all `addRecord()` operations to disk via `conn.commit()`. | [x] |
| FR-005 | The system shall allow the user to delete a specific tenant record by apartment number. | [x] |
| FR-006 | The system shall persist all `deleteRecord()` operations to disk via `conn.commit()`. | [x] |
| FR-007 | The system shall allow the user to clear all tenant records from the database. | [x] |
| FR-008 | The system shall persist all `clearTable()` operations to disk via `conn.commit()`. | [x] |
| FR-009 | The system shall display a GUI window (1000x650, unresizable) with the application title and icon on launch. | [x] |
| FR-010 | The GUI shall display a table listing all current tenant records with all schema fields visible. | [ ] |
| FR-011 | The GUI shall provide a form or dialog to add a new tenant record. | [ ] |
| FR-012 | The GUI shall provide a control to delete a selected tenant record. | [ ] |
| FR-013 | The GUI shall provide a control to clear all tenant records, with a confirmation prompt. | [ ] |
| FR-014 | The system shall generate a PDF invoice for a selected tenant using ReportLab and save it to the `invoices/` directory. | [ ] |
| FR-015 | The application shall be packageable as a standalone Windows executable using PyInstaller. | [ ] |

---

## 4. Non-Functional Requirements

| ID | Requirement | Status |
|---|---|---|
| NFR-001 | All database read and write operations shall complete within 500 ms under normal single-user load. | [ ] |
| NFR-002 | The GUI shall apply the system appearance mode (light/dark) via `darkdetect` and use the `dark-blue` CustomTkinter theme. | [x] |
| NFR-003 | The application window shall be fixed at 1000x650 pixels and shall not be resizable by the user. | [x] |
| NFR-004 | The application shall run on Python 3.8 or later on Windows and WSL environments. | [x] |
| NFR-005 | All required dependencies shall be listed in `requirements.txt` and installable via `pip install -r requirements.txt`. | [x] |
| NFR-006 | Every database mutation (insert, delete, truncate) shall call `conn.commit()` before returning to ensure data durability. | [x] |
| NFR-007 | The `data/` and `invoices/` directories shall be created on first run if they do not exist, without requiring manual setup. | [ ] |

---

## 5. Constraints

- **Local only:** The application has no network functionality. All data is stored on the local filesystem.
- **Single-user:** There is no authentication, multi-user access control, or concurrent access handling.
- **Fixed schema:** The `renters` table schema is defined at initialization; there is no migration system for schema changes.
- **Column name typo:** The primary key column is named `appartmentNumber` (double `p`). Correcting this would require a schema migration.
- **Window size fixed:** The GUI is locked to 1000x650 and cannot be resized; layout must fit within this constraint.
- **Python runtime required:** The application is not yet packaged; a Python 3.8+ installation is required to run it.

---

## 6. Out of Scope

- Multi-property or multi-user support
- Cloud storage or remote database backends
- Tenant portal or any web-based interface
- Automated rent reminders or email/SMS notifications
- Payment processing or integration with payment gateways
- Accounting, ledger, or financial reporting beyond PDF invoices
- Mobile platforms (iOS, Android)
- Database migration tooling

---

## 7. Open Issues

**Outstanding requirements gaps:**

- `src/invoice.py` does not exist yet — PDF invoice generation is planned but not implemented (FR-014).
- No GUI forms or data table are implemented yet (FR-010 through FR-013).
- The `invoices/` and `data/` directories are not created automatically on first run (NFR-007).
- PyInstaller packaging has not been configured (FR-015).

---

*Last updated: 2026-03-11*
