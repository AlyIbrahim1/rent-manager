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
