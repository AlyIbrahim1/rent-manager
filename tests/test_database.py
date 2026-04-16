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
    test_db.updateRecord(101, "John Updated", 1500, "2026-02")
    records = test_db.getAllRecords()
    updated = next(r for r in records if r["appartmentNumber"] == 101)
    assert updated["name"] == "John Updated"
    assert updated["rentAmount"] == 1500
    assert updated["lastMonthPayed"] == "2026-02"

def test_update_record_does_not_affect_other_records(test_db):
    test_db.updateRecord(101, "John Updated", 1500, "2026-02")
    records = test_db.getAllRecords()
    jane = next(r for r in records if r["appartmentNumber"] == 202)
    assert jane["name"] == "Jane Smith"

def test_delete_record_removes_it(test_db):
    test_db.deleteRecord(101)
    records = test_db.getAllRecords()
    apt_numbers = [r["appartmentNumber"] for r in records]
    assert 101 not in apt_numbers
    assert 202 in apt_numbers

def test_delete_nonexistent_record_does_not_raise(test_db):
    test_db.deleteRecord(999)  # Should not raise
    assert len(test_db.getAllRecords()) == 2


def test_upsert_and_get_lease(test_db):
    test_db.upsertLease(101, "2026-01-01", "2026-12-31", 1000, "paid", "renew in fall")
    lease = test_db.getLease(101)
    assert lease is not None
    assert lease["endDate"] == "2026-12-31"
    assert lease["depositStatus"] == "paid"


def test_add_and_get_payments_most_recent_first(test_db):
    test_db.addPayment(101, "2026-01", 1200, "2026-01-05")
    test_db.addPayment(101, "2026-02", 1200, "2026-02-05")

    payments = test_db.getPayments(101)
    assert len(payments) == 2
    assert payments[0]["monthPaid"] == "2026-02"
    assert payments[1]["monthPaid"] == "2026-01"
