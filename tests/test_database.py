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
