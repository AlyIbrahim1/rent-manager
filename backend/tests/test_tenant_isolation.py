def test_tenant_cannot_read_other_tenant_renter(api_client, tenant_a_header, tenant_b_header):
    created = api_client.post(
        "/api/renters",
        headers=tenant_a_header,
        json={"appartmentNumber": 1, "name": "A", "rentAmount": 500, "lastMonthPayed": "2026-01"},
    ).json()

    response = api_client.get(f"/api/renters/{created['id']}", headers=tenant_b_header)
    assert response.status_code == 404
