def test_create_renter(api_client, auth_header):
    payload = {
        "appartmentNumber": 101,
        "name": "John Doe",
        "rentAmount": 1200,
        "lastMonthPayed": "2026-01",
    }
    response = api_client.post("/api/renters", json=payload, headers=auth_header)

    assert response.status_code == 201
    body = response.json()
    assert body["appartmentNumber"] == 101


def test_list_renters_returns_computed_fields(api_client, auth_header):
    create_payload = {
        "appartmentNumber": 101,
        "name": "John Doe",
        "rentAmount": 1200,
        "lastMonthPayed": "2026-01",
    }
    api_client.post("/api/renters", json=create_payload, headers=auth_header)

    response = api_client.get("/api/renters", headers=auth_header)

    assert response.status_code == 200
    assert "unpaidMonths" in response.json()[0]
    assert "rentDue" in response.json()[0]
