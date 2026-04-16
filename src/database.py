import sqlite3

conn = sqlite3.connect("data/rent_data.db")
cursor = conn.cursor()
cursor.execute("PRAGMA foreign_keys = ON")


def _table_columns(table_name):
    cursor.execute(f"PRAGMA table_info({table_name})")
    return [row[1] for row in cursor.fetchall()]


def _migrate_renters_table_if_needed():
    cursor.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='renters'"
    )
    if not cursor.fetchone():
        return

    columns = _table_columns("renters")
    if "unpaidMonths" not in columns and "rentDue" not in columns:
        return

    cursor.execute(
        """
        CREATE TABLE renters_new (
            appartmentNumber INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            rentAmount INTEGER NOT NULL,
            lastMonthPayed TEXT
        )
        """
    )
    cursor.execute(
        """
        INSERT INTO renters_new (appartmentNumber, name, rentAmount, lastMonthPayed)
        SELECT appartmentNumber, name, rentAmount, lastMonthPayed FROM renters
        """
    )
    cursor.execute("DROP TABLE renters")
    cursor.execute("ALTER TABLE renters_new RENAME TO renters")
    conn.commit()


def initialize_database():
    _migrate_renters_table_if_needed()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS renters (
            appartmentNumber INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            rentAmount INTEGER NOT NULL,
            lastMonthPayed TEXT
        )
        """
    )
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS leases (
            appartmentNumber INTEGER PRIMARY KEY,
            startDate TEXT,
            endDate TEXT,
            depositAmount INTEGER,
            depositStatus TEXT,
            renewalNotes TEXT,
            FOREIGN KEY (appartmentNumber) REFERENCES renters(appartmentNumber)
                ON DELETE CASCADE
        )
        """
    )
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            appartmentNumber INTEGER NOT NULL,
            monthPaid TEXT NOT NULL,
            amountPaid INTEGER NOT NULL,
            dateRecorded TEXT NOT NULL,
            FOREIGN KEY (appartmentNumber) REFERENCES renters(appartmentNumber)
                ON DELETE CASCADE
        )
        """
    )
    conn.commit()


initialize_database()


def addRecord(appartmentNumber, name, rentAmount, lastMonthPayed):
    cursor.execute(
        """
        INSERT INTO renters (appartmentNumber, name, rentAmount, lastMonthPayed)
        VALUES (?, ?, ?, ?)
        """,
        (appartmentNumber, name, rentAmount, lastMonthPayed),
    )
    conn.commit()


def deleteRecord(appartmentNumber):
    cursor.execute("DELETE FROM renters WHERE appartmentNumber = ?", (appartmentNumber,))
    conn.commit()


def clearTable():
    cursor.execute("DELETE FROM payments")
    cursor.execute("DELETE FROM leases")
    cursor.execute("DELETE FROM renters")
    conn.commit()


def getAllRecords():
    cursor.execute("SELECT * FROM renters ORDER BY appartmentNumber")
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]
    return [dict(zip(columns, row)) for row in rows]


def updateRecord(appartmentNumber, name, rentAmount, lastMonthPayed):
    cursor.execute(
        """
        UPDATE renters
        SET name = ?, rentAmount = ?, lastMonthPayed = ?
        WHERE appartmentNumber = ?
        """,
        (name, rentAmount, lastMonthPayed, appartmentNumber),
    )
    conn.commit()


def getLease(appartmentNumber):
    cursor.execute("SELECT * FROM leases WHERE appartmentNumber = ?", (appartmentNumber,))
    row = cursor.fetchone()
    if not row:
        return None
    columns = [desc[0] for desc in cursor.description]
    return dict(zip(columns, row))


def upsertLease(appartmentNumber, startDate, endDate, depositAmount, depositStatus, renewalNotes):
    cursor.execute(
        """
        INSERT INTO leases (appartmentNumber, startDate, endDate, depositAmount, depositStatus, renewalNotes)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(appartmentNumber) DO UPDATE SET
            startDate = excluded.startDate,
            endDate = excluded.endDate,
            depositAmount = excluded.depositAmount,
            depositStatus = excluded.depositStatus,
            renewalNotes = excluded.renewalNotes
        """,
        (appartmentNumber, startDate, endDate, depositAmount, depositStatus, renewalNotes),
    )
    conn.commit()


def addPayment(appartmentNumber, monthPaid, amountPaid, dateRecorded):
    cursor.execute(
        """
        INSERT INTO payments (appartmentNumber, monthPaid, amountPaid, dateRecorded)
        VALUES (?, ?, ?, ?)
        """,
        (appartmentNumber, monthPaid, amountPaid, dateRecorded),
    )
    conn.commit()


def getPayments(appartmentNumber):
    cursor.execute(
        """
        SELECT * FROM payments
        WHERE appartmentNumber = ?
        ORDER BY dateRecorded DESC, id DESC
        """,
        (appartmentNumber,),
    )
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]
    return [dict(zip(columns, row)) for row in rows]