# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Instructions

**On git commits:** Never add a co-author note

## Running the App

```bash
.venv/Scripts/python.exe main.py
```

The app requires a `data/` directory for the SQLite database and an `assets/app_icon.ico` file to be present.

## Installing Dependencies

```bash
pip install -r requirements.txt
```

Or activate the existing virtualenv first:

```bash
.venv/Scripts/python.exe  # Windows/WSL — use this directly instead of activating
```

## Architecture

**Entry point:** `main.py` — imports `src.database` to initialize the DB on startup, then `src/ui.py` launches the Tkinter window via `window.mainloop()`.

**Data layer (`src/database.py`):** Raw SQLite CRUD only — no business logic. Module-level connection opened at import time. Tables: `renters`, `leases`, `payments`. All DB mutations must call `conn.commit()` to persist.

**Business logic (`src/models.py`):** Pure Python — rent calculations, lease expiry checks, payment recording. No DB or UI imports. This is the layer to wrap when migrating to a web backend.

**UI layer (`src/ui.py`, `src/widgets.py`):** CustomTkinter GUI (fixed 1000×650, unresizable). Calls `models`, never `database` directly. System appearance mode with dark-blue theme.

**Invoice layer (`src/invoice.py`):** ReportLab-based PDF receipt generation. Pure function — takes a data dict, writes to `invoices/`, returns file path. No UI logic.

## Database Schema

Three tables — all in `data/` (SQLite, single file):

- **`renters`** — `appartmentNumber` PK, `name`, `rentAmount`, `lastMonthPayed`
- **`leases`** — `appartmentNumber` FK, `startDate`, `endDate`, `depositAmount`, `depositStatus`, `renewalNotes`
- **`payments`** — `id` PK (auto), `appartmentNumber` FK, `monthPaid`, `amountPaid`, `dateRecorded`

`unpaidMonths` and `rentDue` are **always computed, never stored**. Source of truth is `lastMonthPayed` + `rentAmount`.

## Layer Rules

- `database.py` — imports `sqlite3` only
- `models.py` — imports `database` only
- `ui.py` / `widgets.py` — imports `models` and `ctk` only
- `invoice.py` — imports `reportlab` only

Keeping these boundaries clean is what enables a future web migration.

## PRD

Full product requirements: `docs/superpowers/specs/2026-04-16-rent-manager-prd-design.md`

## Commit Style

When creating git commits, do NOT add a `Co-Authored-By` line. Keep commit messages clean without any co-author attribution.
