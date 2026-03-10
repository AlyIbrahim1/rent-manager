# RentManager

A lightweight desktop application for tracking tenant rent payment status and generating PDF invoices.

## Description

RentManager is a Python desktop application built for individual property managers and landlords who need a simple tool to manage tenant records. It stores tenant information — apartment number, name, rent amount, payment history, and outstanding balance — in a local SQLite database and provides a GUI for day-to-day management. PDF invoice generation is in progress.

## Features

**Implemented:**
- SQLite-backed tenant record management (add, delete, clear all)
- CustomTkinter GUI with dark-blue theme and system appearance mode detection
- Fixed 1000x650 application window with custom icon

**Planned:**
- Full data table with inline CRUD forms
- PDF invoice generation via ReportLab
- Desktop packaging with PyInstaller

## Prerequisites

- Python 3.8 or later
- A `data/` directory at the project root (for the SQLite database)
- `assets/app_icon.ico` present at the project root

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd RentManagement_app
```

2. (Optional) Create and activate a virtual environment:

```bash
python -m venv .venv
source .venv/Scripts/activate   # Windows / WSL
# or
source .venv/bin/activate        # Linux / macOS
```

3. Install dependencies:

```bash
pip install -r requirements.txt
pip install reportlab   # for invoice generation
```

4. Create the required directories if they do not exist:

```bash
mkdir -p data invoices
```

## Running the App

```bash
python main.py
```

## Project Structure

```
RentManagement_app/
├── main.py              # Entry point; initialises DB and launches the UI
├── requirements.txt     # Core dependencies
├── data/                # SQLite database directory
├── assets/
│   └── app_icon.ico     # Application window icon
├── invoices/            # PDF invoice output directory
└── src/
    ├── database.py      # Data layer; SQLite connection and renters table operations
    ├── ui.py            # GUI layer; CustomTkinter window (1000x650, dark-blue theme)
    └── invoice.py       # Invoice layer; ReportLab PDF generation (planned/incomplete)
```

### Database Schema

Table: `renters`

| Column           | Type    | Notes       |
|------------------|---------|-------------|
| appartmentNumber | INTEGER | Primary key |
| name             | TEXT    |             |
| rentAmount       | INTEGER |             |
| lastMonthPayed   | TEXT    |             |
| unpaidMonths     | INTEGER |             |
| rentDue          | INTEGER |             |

## License

Private / Personal Use. All rights reserved.

---

Last updated: 2026-03-11
