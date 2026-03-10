# Rent Management UI — Design Spec

**Date:** 2026-03-11
**Status:** Approved

---

## Overview

Build a fully functional CustomTkinter GUI for the RentManager app with complete CRUD operations and a "mark as paid" feature. The UI reads from and writes to the existing SQLite database via `src/database.py`.

---

## File Structure

```
src/
├── database.py     # Add getAllRecords() and updateRecord()
├── ui.py           # Main window, layout orchestrator, card grid, panel state
└── widgets.py      # NEW: RenterCard, SidePanel, AddRenterModal, compute_rent_status()
```

---

## Database Layer Changes (`database.py`)

Two new functions alongside the existing ones:

- **`getAllRecords()`** — `SELECT * FROM renters` returning a list of dicts keyed by column name
- **`updateRecord(appartmentNumber, name, rentAmount, lastMonthPayed, unpaidMonths, rentDue)`** — `UPDATE renters SET ... WHERE appartmentNumber = ?` with `conn.commit()`

`unpaidMonths` and `rentDue` passed to `updateRecord()` are always freshly computed by the UI before saving (the DB columns are kept in sync but are not the display source of truth).

---

## Calculated Fields

`lastMonthPayed` stored as `"YYYY-MM"` text (e.g. `"2026-01"`) is the source of truth.

```
unpaidMonths = months between lastMonthPayed and current month (exclusive of lastMonthPayed)
rentDue      = unpaidMonths × rentAmount
```

Rules:
- If `lastMonthPayed` is in the future → `unpaidMonths = 0`, `rentDue = 0`
- If `lastMonthPayed` is empty/null → display "N/A", prompt user to set it

A `compute_rent_status(lastMonthPayed, rentAmount)` helper in `widgets.py` handles this arithmetic using Python's `datetime` module.

---

## UI Layout

**Window:** 1000×650, unresizable (unchanged).

```
┌─────────────────────────────────────────────────────────────┐
│  Rent Management System                    [+ Add Renter]   │  ← Header
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ Apt #101 │  │ Apt #202 │  │ Apt #303 │  ← Scrollable    │
│  │ John D.  │  │ Jane S.  │  │ Bob K.   │    card grid     │
│  │ $1200/mo │  │ $900/mo  │  │ $1500/mo │                  │
│  │ 2 unpaid │  │ 0 unpaid │  │ 1 unpaid │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

When a card is clicked, the grid compresses left and the side panel appears right:

```
┌───────────────────────────┬─────────────────────────────────┐
│  Card grid (compressed)   │  Side Panel                 [✕] │
│                           │  Apt #  [101      ] (locked)    │
│  ┌──────┐  ┌──────┐       │  Name   [John Doe           ]   │
│  │ 101  │  │ 202  │       │  Rent   [1200               ]   │
│  └──────┘  └──────┘       │  Last Paid  [2026-01        ]   │
│                           │  Unpaid Months:  2  (computed)  │
│                           │  Rent Due:    $2400  (computed)  │
│                           │                                 │
│                           │  [Save] [Mark Paid] [Delete]    │
└───────────────────────────┴─────────────────────────────────┘
```

**Card color coding:**
- `unpaidMonths > 0` → red/orange accent border
- `unpaidMonths == 0` → green accent border

---

## Components (`widgets.py`)

### `compute_rent_status(lastMonthPayed, rentAmount)`
Pure function. Returns `(unpaidMonths, rentDue)` as integers. Uses `datetime` to calculate month difference. Clamps to 0 minimum.

### `RenterCard(master, record, on_click)`
A `CTkFrame` styled as a card. Displays: apartment number, name, rent amount, unpaid months, rent due. Accent color based on payment status. Calls `on_click(record)` when clicked.

### `SidePanel(master, record, on_save, on_delete, on_close)`
A `CTkFrame` rendered on the right portion of the main frame. Contains:
- Editable fields: name, rentAmount, lastMonthPayed (as text input, format hint shown)
- Read-only computed labels: unpaidMonths, rentDue (update live as lastMonthPayed changes)
- **Save** button → calls `updateRecord()` with computed values, then `on_save()`
- **Mark Paid** button → opens `MarkPaidDialog`, then updates record
- **Delete** button → shows inline confirm ("Are you sure? [Confirm]"), then `deleteRecord()` + `on_delete()`
- **✕** close button → calls `on_close()`

### `MarkPaidDialog(master, on_confirm)`
A `CTkToplevel` modal. Contains a month/year picker (dropdown for month, entry or dropdown for year). On confirm, returns the selected `"YYYY-MM"` string to `on_confirm(month_str)`. The caller updates `lastMonthPayed` and recomputes/saves.

### `AddRenterModal(master, on_submit)`
A `CTkToplevel` modal. Form fields: apartment number (integer), name (text), rent amount (integer), last month paid (text, `"YYYY-MM"` format). On submit: validates inputs, calls `addRecord()`, then `on_submit()` to trigger grid refresh. Inline error labels block submission if validation fails.

**Validation rules:**
- Apartment number: required, positive integer
- Name: required, non-empty string
- Rent amount: required, positive integer
- Last month paid: optional; if provided must match `YYYY-MM` format

---

## `ui.py` Responsibilities

- Build header bar with title label and "Add Renter" button
- Create a `CTkScrollableFrame` for the card grid
- Track side panel open/close state
- `refresh()` method: calls `getAllRecords()`, clears and redraws all `RenterCard` instances
- On card click: renders `SidePanel` on the right, compresses card grid
- On side panel close/save/delete: restores full-width grid, calls `refresh()`
- On "Add Renter": opens `AddRenterModal`; on submit calls `refresh()`

---

## Error Handling

| Scenario | Handling |
|---|---|
| Duplicate apartment number on add | Catch `sqlite3.IntegrityError`, show error label in modal |
| `lastMonthPayed` in the future | `unpaidMonths = 0`, `rentDue = 0` |
| `lastMonthPayed` empty | Display "N/A", user prompted to set via side panel |
| Delete without confirmation | Two-step: Delete button → confirm button appears before executing |
| Invalid form input on add | Inline error label, submit blocked |

---

## Refresh Strategy

After every write operation (add, save, delete, mark paid), `ui.py` calls `refresh()` which re-fetches all records and redraws the card grid. No partial updates — full redraw keeps state simple and consistent.

---

*Last updated: 2026-03-11*
