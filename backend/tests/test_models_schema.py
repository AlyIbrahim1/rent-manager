from sqlalchemy import inspect

from app.db.session import engine


def test_expected_tables_exist():
    inspector = inspect(engine)
    tables = set(inspector.get_table_names())

    assert "tenants" in tables
    assert "tenant_memberships" in tables
    assert "renters" in tables
    assert "leases" in tables
    assert "payments" in tables
