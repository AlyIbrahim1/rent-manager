# Rent Management UI Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional CustomTkinter GUI with a card grid, side panel, and modals wired to SQLite CRUD operations.

**Architecture:** `database.py` gets two new functions (`getAllRecords`, `updateRecord`) and a fixed `deleteRecord`. A new `src/widgets.py` holds all reusable components (`RenterCard`, `SidePanel`, `MarkPaidDialog`, `AddRenterModal`, `compute_rent_status`). `ui.py` is rebuilt as the layout orchestrator that owns the card grid and panel state.

**Tech Stack:** Python 3, CustomTkinter 5.2.2, SQLite3, pytest

---

## Chunk 1: Database Layer

### Task 1: Install pytest and add `getAllRecords()`

**Files:**
- Modify: `src/database.py`
- Create: `tests/__init__.py`
- Create: `tests/conftest.py`
- Create: `tests/test_database.py`

- [ ] **Step 1: Install pytest**

```bash
.venv/Scripts/python.exe -m pip install pytest -q
```

Expected: pytest installs cleanly.

- [ ] **Step 2: Create `tests/__init__.py`**

Create an empty file at `tests/__init__.py`.

- [ ] **Step 3: Create `tests/conftest.py`** with a temporary database fixture

```python
import sqlite3
import pytest
import os

# Runs at conftest import time (before any test module is collected),
# ensuring data/ exists before src.database opens its connection.
os.makedirs("data", exist_ok=True)

@pytest.fixture
def test_db(tmp_path, monkeypatch):
    """Patch database module to use a temporary SQLite file."""
    db_path = str(tmp_path / "test_rent.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""CREATE TABLE renters (
        appartmentNumber INTEGER PRIMARY KEY,
        name TEXT,
        rentAmount INTEGER,
        lastMonthPayed TEXT,
        unpaidMonths INTEGER,
        rentDue INTEGER
    )""")
    conn.commit()

    # Seed two records
    cursor.execute("INSERT INTO renters VALUES (101, 'John Doe', 1200, '2026-01', 2, 2400)")
    cursor.execute("INSERT INTO renters VALUES (202, 'Jane Smith', 900, '2026-02', 1, 900)")
    conn.commit()

    import src.database as db
    monkeypatch.setattr(db, "conn", conn)
    monkeypatch.setattr(db, "cursor", cursor)
    yield db
    conn.close()
```

- [ ] **Step 4: Write failing tests for `getAllRecords()`**

Create `tests/test_database.py`:

```python
def test_get_all_records_returns_list_of_dicts(test_db):
    records = test_db.getAllRecords()
    assert isinstance(records, list)
    assert len(records) == 2
    assert records[0]["appartmentNumber"] == 101
    assert records[0]["name"] == "John Doe"

def test_get_all_records_empty_table(test_db):
    test_db.cursor.execute("DELETE FROM renters")
    test_db.conn.commit()
    records = test_db.getAllRecords()
    assert records == []
```

- [ ] **Step 5: Run tests to confirm they fail**

```bash
.venv/Scripts/python.exe -m pytest tests/test_database.py::test_get_all_records_returns_list_of_dicts -v
```

Expected: `FAILED` — `AttributeError: module has no attribute 'getAllRecords'`

- [ ] **Step 6: Implement `getAllRecords()` in `src/database.py`**

Append after the existing functions:

```python
def getAllRecords():
    cursor.execute("SELECT * FROM renters")
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]
    return [dict(zip(columns, row)) for row in rows]
```

- [ ] **Step 7: Run tests to confirm they pass**

```bash
.venv/Scripts/python.exe -m pytest tests/test_database.py -v
```

Expected: both `getAllRecords` tests `PASSED`.

- [ ] **Step 8: Commit**

```bash
git add src/database.py tests/
git commit -m "Feat: add getAllRecords() to database with tests"
```

---

### Task 2: Fix `deleteRecord()` and add `updateRecord()`

**Files:**
- Modify: `src/database.py`
- Modify: `tests/test_database.py`

- [ ] **Step 1: Fix `deleteRecord()` to accept a plain integer**

The existing `deleteRecord` passes its argument directly as the sqlite3 params sequence, which requires a tuple. Normalize it to accept a plain integer:

```python
def deleteRecord(appartmentNumber):
    cursor.execute("DELETE FROM renters WHERE appartmentNumber = ?", (appartmentNumber,))
    conn.commit()
```

- [ ] **Step 2: Write failing tests for `updateRecord()`**

Append to `tests/test_database.py`:

```python
def test_update_record_changes_fields(test_db):
    test_db.updateRecord(101, "John Updated", 1500, "2026-02", 1, 1500)
    records = test_db.getAllRecords()
    updated = next(r for r in records if r["appartmentNumber"] == 101)
    assert updated["name"] == "John Updated"
    assert updated["rentAmount"] == 1500
    assert updated["lastMonthPayed"] == "2026-02"
    assert updated["unpaidMonths"] == 1
    assert updated["rentDue"] == 1500

def test_update_record_does_not_affect_other_records(test_db):
    test_db.updateRecord(101, "John Updated", 1500, "2026-02", 1, 1500)
    records = test_db.getAllRecords()
    jane = next(r for r in records if r["appartmentNumber"] == 202)
    assert jane["name"] == "Jane Smith"
```

- [ ] **Step 3: Run to confirm failure**

```bash
.venv/Scripts/python.exe -m pytest tests/test_database.py::test_update_record_changes_fields -v
```

Expected: `FAILED` — `AttributeError: module has no attribute 'updateRecord'`

- [ ] **Step 4: Implement `updateRecord()` in `src/database.py`**

```python
def updateRecord(appartmentNumber, name, rentAmount, lastMonthPayed, unpaidMonths, rentDue):
    cursor.execute("""UPDATE renters
        SET name=?, rentAmount=?, lastMonthPayed=?, unpaidMonths=?, rentDue=?
        WHERE appartmentNumber=?""",
        (name, rentAmount, lastMonthPayed, unpaidMonths, rentDue, appartmentNumber)
    )
    conn.commit()
```

- [ ] **Step 5: Run all database tests**

```bash
.venv/Scripts/python.exe -m pytest tests/test_database.py -v
```

Expected: all 4 tests `PASSED`.

- [ ] **Step 6: Commit**

```bash
git add src/database.py tests/test_database.py
git commit -m "Feat: fix deleteRecord(), add updateRecord() with tests"
```

---

## Chunk 2: Core Logic — compute_rent_status

### Task 3: Create `widgets.py` with `compute_rent_status()`

**Files:**
- Create: `src/widgets.py`
- Create: `tests/test_widgets.py`

- [ ] **Step 1: Write failing tests for `compute_rent_status()`**

Create `tests/test_widgets.py`:

```python
from unittest.mock import patch
from datetime import datetime

def test_compute_two_unpaid_months():
    from src.widgets import compute_rent_status
    with patch("src.widgets.datetime") as mock_dt:
        mock_dt.now.return_value = datetime(2026, 3, 15)
        mock_dt.strptime.side_effect = lambda *a, **kw: datetime.strptime(*a, **kw)
        unpaid, due = compute_rent_status("2026-01", 1200)
    assert unpaid == 2
    assert due == 2400

def test_compute_zero_when_paid_current_month():
    from src.widgets import compute_rent_status
    with patch("src.widgets.datetime") as mock_dt:
        mock_dt.now.return_value = datetime(2026, 3, 15)
        mock_dt.strptime.side_effect = lambda *a, **kw: datetime.strptime(*a, **kw)
        unpaid, due = compute_rent_status("2026-03", 1000)
    assert unpaid == 0
    assert due == 0

def test_compute_zero_when_future_date():
    from src.widgets import compute_rent_status
    with patch("src.widgets.datetime") as mock_dt:
        mock_dt.now.return_value = datetime(2026, 3, 15)
        mock_dt.strptime.side_effect = lambda *a, **kw: datetime.strptime(*a, **kw)
        unpaid, due = compute_rent_status("2026-06", 1000)
    assert unpaid == 0
    assert due == 0

def test_compute_returns_none_when_empty():
    from src.widgets import compute_rent_status
    unpaid, due = compute_rent_status("", 1000)
    assert unpaid is None
    assert due is None

def test_compute_returns_none_when_invalid_format():
    from src.widgets import compute_rent_status
    unpaid, due = compute_rent_status("January 2026", 1000)
    assert unpaid is None
    assert due is None
```

- [ ] **Step 2: Run to confirm failure**

```bash
.venv/Scripts/python.exe -m pytest tests/test_widgets.py -v
```

Expected: all `FAILED` — `ModuleNotFoundError: No module named 'src.widgets'`

- [ ] **Step 3: Create `src/widgets.py` with `compute_rent_status()`**

```python
import customtkinter as ctk
from datetime import datetime
from src import database
import sqlite3


def compute_rent_status(lastMonthPayed, rentAmount):
    """Return (unpaidMonths, rentDue). Returns (None, None) if lastMonthPayed is empty/invalid."""
    if not lastMonthPayed:
        return (None, None)
    try:
        last_paid = datetime.strptime(lastMonthPayed, "%Y-%m")
    except ValueError:
        return (None, None)
    now = datetime.now().replace(day=1)
    last_paid = last_paid.replace(day=1)
    months = (now.year - last_paid.year) * 12 + (now.month - last_paid.month)
    months = max(0, months)
    return (months, months * rentAmount)
```

- [ ] **Step 4: Run tests**

```bash
.venv/Scripts/python.exe -m pytest tests/test_widgets.py -v
```

Expected: all 5 tests `PASSED`.

- [ ] **Step 5: Commit**

```bash
git add src/widgets.py tests/test_widgets.py
git commit -m "Feat: create widgets.py with compute_rent_status()"
```

---

## Chunk 3: RenterCard Component

### Task 4: Implement `RenterCard`

**Files:**
- Modify: `src/widgets.py`

`RenterCard` is a visual component — tests are manual (run the app after Task 8 wires the grid).

- [ ] **Step 1: Add `RenterCard` class to `src/widgets.py`**

Append to `src/widgets.py`:

```python
class RenterCard(ctk.CTkFrame):
    def __init__(self, master, record, on_click, **kwargs):
        super().__init__(master, **kwargs)
        self.record = record
        self.on_click = on_click

        unpaid, due = compute_rent_status(record.get("lastMonthPayed", ""), record.get("rentAmount", 0))

        border_color = "#2ecc71" if (unpaid is None or unpaid == 0) else "#e74c3c"
        self.configure(border_width=2, border_color=border_color, corner_radius=10, cursor="hand2")

        apt_label = ctk.CTkLabel(self, text=f"Apt #{record['appartmentNumber']}",
                                  font=("Roboto", 16, "bold"))
        apt_label.pack(pady=(12, 2), padx=12)

        name_label = ctk.CTkLabel(self, text=record.get("name", "—"), font=("Roboto", 13))
        name_label.pack(pady=2, padx=12)

        rent_label = ctk.CTkLabel(self, text=f"${record.get('rentAmount', 0)}/mo", font=("Roboto", 12))
        rent_label.pack(pady=2, padx=12)

        if unpaid is None:
            unpaid_text = "Last paid: N/A"
            due_text = "Due: N/A"
        else:
            unpaid_text = f"{unpaid} month{'s' if unpaid != 1 else ''} unpaid"
            due_text = f"Due: ${due}"

        unpaid_label = ctk.CTkLabel(self, text=unpaid_text, font=("Roboto", 12),
                                     text_color=border_color)
        unpaid_label.pack(pady=2, padx=12)

        due_label = ctk.CTkLabel(self, text=due_text, font=("Roboto", 12))
        due_label.pack(pady=(2, 12), padx=12)

        for widget in [self, apt_label, name_label, rent_label, unpaid_label, due_label]:
            widget.bind("<Button-1>", lambda e: self.on_click(self.record))
```

- [ ] **Step 2: Verify no import errors**

```bash
.venv/Scripts/python.exe -c "from src.widgets import RenterCard; print('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add src/widgets.py
git commit -m "Feat: add RenterCard component"
```

---

## Chunk 4: SidePanel and MarkPaidDialog

### Task 5: Implement `MarkPaidDialog`

**Files:**
- Modify: `src/widgets.py`

- [ ] **Step 1: Append `MarkPaidDialog` to `src/widgets.py`**

```python
class MarkPaidDialog(ctk.CTkToplevel):
    MONTHS = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"]

    def __init__(self, master, on_confirm, **kwargs):
        super().__init__(master, **kwargs)
        self.on_confirm = on_confirm
        self.title("Mark Month as Paid")
        self.geometry("300x200")
        self.resizable(False, False)
        self.grab_set()

        ctk.CTkLabel(self, text="Select month paid:", font=("Roboto", 14)).pack(pady=(20, 5))

        now = datetime.now()
        self.month_var = ctk.StringVar(value=self.MONTHS[now.month - 1])
        self.year_var = ctk.StringVar(value=str(now.year))

        row = ctk.CTkFrame(self, fg_color="transparent")
        row.pack(pady=5)

        self.month_menu = ctk.CTkOptionMenu(row, variable=self.month_var, values=self.MONTHS, width=140)
        self.month_menu.pack(side="left", padx=5)

        years = [str(now.year - i) for i in range(5)]
        self.year_menu = ctk.CTkOptionMenu(row, variable=self.year_var, values=years, width=90)
        self.year_menu.pack(side="left", padx=5)

        ctk.CTkButton(self, text="Confirm", command=self._confirm).pack(pady=15)

    def _confirm(self):
        month_num = self.MONTHS.index(self.month_var.get()) + 1
        year = int(self.year_var.get())
        month_str = f"{year}-{month_num:02d}"
        self.on_confirm(month_str)
        self.destroy()
```

- [ ] **Step 2: Commit**

```bash
git add src/widgets.py
git commit -m "Feat: add MarkPaidDialog component"
```

---

### Task 6: Implement `SidePanel`

**Files:**
- Modify: `src/widgets.py`

- [ ] **Step 1: Append `SidePanel` to `src/widgets.py`**

```python
class SidePanel(ctk.CTkFrame):
    def __init__(self, master, record, on_save, on_delete, on_close, **kwargs):
        super().__init__(master, **kwargs)
        self.record = record
        self.on_save = on_save
        self.on_delete = on_delete
        self.on_close = on_close
        self._build()

    def _build(self):
        r = self.record

        ctk.CTkButton(self, text="✕", width=30, command=self.on_close).pack(anchor="ne", padx=10, pady=(10, 0))
        ctk.CTkLabel(self, text=f"Apt #{r['appartmentNumber']}", font=("Roboto", 18, "bold")).pack(pady=(0, 10))

        self._name_var = ctk.StringVar(value=r.get("name", ""))
        self._rent_var = ctk.StringVar(value=str(r.get("rentAmount", "")))
        self._last_paid_var = ctk.StringVar(value=r.get("lastMonthPayed", ""))
        self._last_paid_var.trace_add("write", lambda *_: self._update_computed())

        for label, var, hint in [
            ("Name", self._name_var, None),
            ("Rent Amount ($)", self._rent_var, None),
            ("Last Month Paid", self._last_paid_var, "YYYY-MM"),
        ]:
            ctk.CTkLabel(self, text=label, font=("Roboto", 12)).pack(anchor="w", padx=20)
            ctk.CTkEntry(self, textvariable=var, placeholder_text=hint or "").pack(fill="x", padx=20, pady=(0, 8))

        self._unpaid_label = ctk.CTkLabel(self, text="", font=("Roboto", 12))
        self._unpaid_label.pack(anchor="w", padx=20)
        self._due_label = ctk.CTkLabel(self, text="", font=("Roboto", 12))
        self._due_label.pack(anchor="w", padx=20, pady=(0, 12))
        self._update_computed()

        self._error_label = ctk.CTkLabel(self, text="", text_color="red", font=("Roboto", 11))
        self._error_label.pack()

        btn_frame = ctk.CTkFrame(self, fg_color="transparent")
        btn_frame.pack(pady=10, fill="x", padx=20)

        ctk.CTkButton(btn_frame, text="Save", command=self._save).pack(side="left", padx=4)
        ctk.CTkButton(btn_frame, text="Mark Paid", command=self._mark_paid).pack(side="left", padx=4)

        self._delete_btn = ctk.CTkButton(btn_frame, text="Delete", fg_color="#e74c3c",
                                          hover_color="#c0392b", command=self._delete_step1)
        self._delete_btn.pack(side="left", padx=4)

    def _update_computed(self):
        try:
            rent = int(self._rent_var.get())
        except ValueError:
            rent = 0
        unpaid, due = compute_rent_status(self._last_paid_var.get(), rent)
        if unpaid is None:
            self._unpaid_label.configure(text="Unpaid months: N/A")
            self._due_label.configure(text="Rent due: N/A")
        else:
            self._unpaid_label.configure(text=f"Unpaid months: {unpaid}")
            self._due_label.configure(text=f"Rent due: ${due}")

    def _save(self):
        name = self._name_var.get().strip()
        if not name:
            self._error_label.configure(text="Name cannot be empty.")
            return
        try:
            rent = int(self._rent_var.get())
            if rent <= 0:
                raise ValueError
        except ValueError:
            self._error_label.configure(text="Rent must be a positive integer.")
            return
        last_paid = self._last_paid_var.get().strip()
        unpaid, due = compute_rent_status(last_paid, rent)
        if unpaid is None:
            unpaid = self.record.get("unpaidMonths", 0)
            due = self.record.get("rentDue", 0)
        database.updateRecord(self.record["appartmentNumber"], name, rent, last_paid, unpaid, due)
        self.on_save()

    def _mark_paid(self):
        def on_confirm(month_str):
            self._last_paid_var.set(month_str)
            self._save()
        MarkPaidDialog(self, on_confirm=on_confirm)

    def _delete_step1(self):
        self._delete_btn.configure(text="Are you sure?", command=self._delete_confirm)

    def _delete_confirm(self):
        database.deleteRecord(self.record["appartmentNumber"])
        self.on_delete()
```

- [ ] **Step 2: Commit**

```bash
git add src/widgets.py
git commit -m "Feat: add SidePanel component"
```

---

## Chunk 5: AddRenterModal

### Task 7: Implement `AddRenterModal`

**Files:**
- Modify: `src/widgets.py`

- [ ] **Step 1: Append `AddRenterModal` to `src/widgets.py`**

```python
class AddRenterModal(ctk.CTkToplevel):
    def __init__(self, master, on_submit, **kwargs):
        super().__init__(master, **kwargs)
        self.on_submit = on_submit
        self.title("Add Renter")
        self.geometry("360x380")
        self.resizable(False, False)
        self.grab_set()

        ctk.CTkLabel(self, text="Add New Renter", font=("Roboto", 18, "bold")).pack(pady=(20, 10))

        self._apt_var = ctk.StringVar()
        self._name_var = ctk.StringVar()
        self._rent_var = ctk.StringVar()
        self._last_paid_var = ctk.StringVar()

        for label, var, hint in [
            ("Apartment Number", self._apt_var, None),
            ("Name", self._name_var, None),
            ("Rent Amount ($)", self._rent_var, None),
            ("Last Month Paid (YYYY-MM)", self._last_paid_var, "optional"),
        ]:
            ctk.CTkLabel(self, text=label, font=("Roboto", 12)).pack(anchor="w", padx=30)
            ctk.CTkEntry(self, textvariable=var, placeholder_text=hint or "").pack(fill="x", padx=30, pady=(0, 8))

        self._error_label = ctk.CTkLabel(self, text="", text_color="red", font=("Roboto", 11))
        self._error_label.pack()

        ctk.CTkButton(self, text="Add Renter", command=self._submit).pack(pady=10)

    def _submit(self):
        try:
            apt = int(self._apt_var.get())
            if apt <= 0:
                raise ValueError
        except ValueError:
            self._error_label.configure(text="Apartment number must be a positive integer.")
            return

        name = self._name_var.get().strip()
        if not name:
            self._error_label.configure(text="Name cannot be empty.")
            return

        try:
            rent = int(self._rent_var.get())
            if rent <= 0:
                raise ValueError
        except ValueError:
            self._error_label.configure(text="Rent amount must be a positive integer.")
            return

        last_paid = self._last_paid_var.get().strip()
        if last_paid:
            try:
                datetime.strptime(last_paid, "%Y-%m")
            except ValueError:
                self._error_label.configure(text="Last month paid must be YYYY-MM (e.g. 2026-01).")
                return

        unpaid, due = compute_rent_status(last_paid, rent)
        if unpaid is None:
            unpaid, due = 0, 0

        try:
            database.addRecord(apt, name, rent, last_paid, unpaid, due)
        except sqlite3.IntegrityError:
            self._error_label.configure(text=f"Apartment #{apt} already exists.")
            return

        self.on_submit()
        self.destroy()
```

- [ ] **Step 2: Commit**

```bash
git add src/widgets.py
git commit -m "Feat: add AddRenterModal component"
```

---

## Chunk 6: Main UI Layout

### Task 8: Rebuild `ui.py` as layout orchestrator

**Files:**
- Modify: `src/ui.py`

- [ ] **Step 1: Replace `src/ui.py` entirely**

```python
import customtkinter as ctk
from src import database
from src.widgets import RenterCard, SidePanel, AddRenterModal

ctk.set_appearance_mode("system")
ctk.set_default_color_theme("dark-blue")


class App(ctk.CTk):
    CARD_WIDTH = 180
    CARD_HEIGHT = 160
    PANEL_WIDTH = 340

    def __init__(self):
        super().__init__()
        self.title("Rent Management")
        self.iconbitmap("assets/app_icon.ico")
        self.geometry("1000x650")
        self.resizable(False, False)

        self._side_panel = None
        self._build_header()
        self._build_body()
        self.refresh()

    def _build_header(self):
        header = ctk.CTkFrame(self, height=60, corner_radius=0)
        header.pack(fill="x")
        header.pack_propagate(False)

        ctk.CTkLabel(header, text="Rent Management System",
                     font=("Roboto", 22, "bold")).pack(side="left", padx=20, pady=10)

        ctk.CTkButton(header, text="+ Add Renter", width=130,
                      command=self._open_add_modal).pack(side="right", padx=20, pady=10)

    def _build_body(self):
        self._body = ctk.CTkFrame(self, fg_color="transparent")
        self._body.pack(fill="both", expand=True, padx=10, pady=10)

        self._grid_frame = ctk.CTkScrollableFrame(self._body, fg_color="transparent")
        self._grid_frame.pack(side="left", fill="both", expand=True)

    def refresh(self):
        if self._side_panel:
            self._side_panel.destroy()
            self._side_panel = None
            self._grid_frame.pack(side="left", fill="both", expand=True)

        for widget in self._grid_frame.winfo_children():
            widget.destroy()

        records = database.getAllRecords()
        if not records:
            ctk.CTkLabel(self._grid_frame, text="No renters yet. Add one to get started.",
                         font=("Roboto", 14), text_color="gray").pack(pady=40)
            return

        cols = max(1, (1000 - 20) // (self.CARD_WIDTH + 16))
        for i, record in enumerate(records):
            row, col = divmod(i, cols)
            card = RenterCard(self._grid_frame, record, on_click=self._open_side_panel,
                              width=self.CARD_WIDTH, height=self.CARD_HEIGHT)
            card.grid(row=row, column=col, padx=8, pady=8, sticky="nw")

    def _open_side_panel(self, record):
        if self._side_panel:
            self._side_panel.destroy()

        self._grid_frame.pack_configure(expand=False)
        self._grid_frame.configure(width=1000 - self.PANEL_WIDTH - 30)

        self._side_panel = SidePanel(
            self._body,
            record=record,
            on_save=self.refresh,
            on_delete=self.refresh,
            on_close=self.refresh,
            width=self.PANEL_WIDTH,
        )
        self._side_panel.pack(side="right", fill="y", padx=(0, 5))

    def _open_add_modal(self):
        AddRenterModal(self, on_submit=self.refresh)


window = App()
window.mainloop()
```

- [ ] **Step 2: Confirm `main.py` is unchanged**

`main.py` should contain:

```python
from src import database
from src import ui
```

- [ ] **Step 3: Run the app and manually verify**

```bash
.venv/Scripts/python.exe main.py
```

Verify each of the following:

- [ ] Card grid shows all renters from the DB (or empty-state message if DB is empty)
- [ ] Cards show correct computed unpaid months and rent due based on `lastMonthPayed`
- [ ] Green border for paid-up renters; red border for those with unpaid months
- [ ] Clicking a card opens the side panel on the right; grid compresses
- [ ] Side panel computed labels update live as "Last Month Paid" is edited
- [ ] Save updates the DB and refreshes the card grid
- [ ] Mark Paid opens the month picker; selecting a month updates `lastMonthPayed` and saves
- [ ] Delete shows "Are you sure?" before executing; card is removed on confirm
- [ ] "✕" closes the side panel and restores the full-width grid
- [ ] "Add Renter" opens the modal; validation blocks invalid input; duplicate apt number shows error
- [ ] Successful add closes the modal and the new card appears in the grid

- [ ] **Step 4: Run all tests**

```bash
.venv/Scripts/python.exe -m pytest tests/ -v
```

Expected: all tests `PASSED`.

- [ ] **Step 5: Final commit**

```bash
git add src/ui.py
git commit -m "Feat: implement full CRUD UI with card grid, side panel, and modals"
```

---

*Last updated: 2026-03-11*
