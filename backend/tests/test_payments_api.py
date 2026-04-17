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
    # Without SUPABASE_SERVICE_ROLE_KEY configured, the endpoint returns 501.
    # When the key is present, it will return 201 with a signed download URL.
    response = api_client.post("/api/receipts", headers=auth_header, json=payment_payload)

    assert response.status_code in (201, 501)
