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
        lastMonthPayed TEXT
    )""")
    cursor.execute("""CREATE TABLE leases (
        appartmentNumber INTEGER PRIMARY KEY,
        startDate TEXT,
        endDate TEXT,
        depositAmount INTEGER,
        depositStatus TEXT,
        renewalNotes TEXT
    )""")
    cursor.execute("""CREATE TABLE payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        appartmentNumber INTEGER,
        monthPaid TEXT,
        amountPaid INTEGER,
        dateRecorded TEXT
    )""")
    conn.commit()

    # Seed two records
    cursor.execute("INSERT INTO renters VALUES (101, 'John Doe', 1200, '2026-01')")
    cursor.execute("INSERT INTO renters VALUES (202, 'Jane Smith', 900, '2026-02')")
    conn.commit()

    import src.database as db
    monkeypatch.setattr(db, "conn", conn)
    monkeypatch.setattr(db, "cursor", cursor)
    yield db
    conn.close()
