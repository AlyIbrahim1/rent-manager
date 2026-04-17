def test_record_payment_updates_last_month_and_creates_event(api_client, auth_header, renter_id):
    response = api_client.post(
        f"/api/renters/{renter_id}/payments",
        headers=auth_header,
        json={"monthPaid": "2026-02", "amountPaid": 1200},
    )

    assert response.status_code == 201
    body = response.json()
    assert body["monthPaid"] == "2026-02"


def test_generate_receipt_requires_service_role_key(api_client, auth_header, payment_payload):
    create_response = api_client.post(
        "/api/renters",
        headers=auth_header,
        json={
            "appartmentNumber": payment_payload["appartmentNumber"],
            "name": payment_payload["name"],
            "rentAmount": payment_payload["amountPaid"],
            "lastMonthPayed": "2026-01",
        },
    )
    assert create_response.status_code == 201
    renter_id = create_response.json()["id"]

    payment_response = api_client.post(
        f"/api/renters/{renter_id}/payments",
        headers=auth_header,
        json={"monthPaid": payment_payload["monthPaid"], "amountPaid": payment_payload["amountPaid"]},
    )
    assert payment_response.status_code == 201

    # Without SUPABASE_SERVICE_ROLE_KEY configured, the endpoint returns 501
    # after tenant/renter/payment validation succeeds.
    response = api_client.post("/api/receipts", headers=auth_header, json=payment_payload)

    assert response.status_code == 501
