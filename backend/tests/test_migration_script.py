def test_migration_creates_single_tenant_and_imports_rows(sqlite_fixture, pg_session):
    from scripts.migrate_sqlite_to_supabase import run_migration

    result = run_migration(sqlite_fixture.path, tenant_name="Imported Tenant")

    assert result["tenantsCreated"] == 1
    assert result["rentersImported"] == 2
    assert result["paymentsImported"] >= 0
