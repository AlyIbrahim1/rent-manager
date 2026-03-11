import sqlite3

conn = sqlite3.connect("data/rent_data.db") # connects to database file
cursor = conn.cursor() # creates a cursor

# creates the database table
cursor.execute("""CREATE TABLE IF NOT EXISTS renters (
        appartmentNumber INTEGER PRIMARY KEY,
        name TEXT,
        rentAmount INTEGER,
        lastMonthPayed TEXT,
        unpaidMonths INTEGER,
        rentDue INTEGER
    ); 
""")
conn.commit()

def addRecord(appartmentNumber, name, rentAmount, lastMonthPayed, unpaidMonths, rentDue):
    cursor.execute("""INSERT INTO renters VALUES (?,?,?,?,?,?);"""
        , (appartmentNumber, name, rentAmount, lastMonthPayed, unpaidMonths, rentDue)
    )
    conn.commit()

def deleteRecord(appartmentNumber):
    cursor.execute("DELETE FROM renters WHERE appartmentNumber = ?", (appartmentNumber,))
    conn.commit()

def clearTable():
    cursor.execute(""" DROP TABLE renters;""")
    conn.commit()

def getAllRecords():
    cursor.execute("SELECT * FROM renters")
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]
    return [dict(zip(columns, row)) for row in rows]

def updateRecord(appartmentNumber, name, rentAmount, lastMonthPayed, unpaidMonths, rentDue):
    cursor.execute("""UPDATE renters
        SET name=?, rentAmount=?, lastMonthPayed=?, unpaidMonths=?, rentDue=?
        WHERE appartmentNumber=?""",
        (name, rentAmount, lastMonthPayed, unpaidMonths, rentDue, appartmentNumber)
    )
    conn.commit()