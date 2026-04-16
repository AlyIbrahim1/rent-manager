def test_record_payment_updates_last_month_and_creates_event(api_client, auth_header, renter_id):
    response = api_client.post(
        f"/api/renters/{renter_id}/payments",
        headers=auth_header,
        json={"monthPaid": "2026-02", "amountPaid": 1200},
    )

    assert response.status_code == 201
    body = response.json()
    assert body["monthPaid"] == "2026-02"


def test_generate_receipt_returns_signed_url(api_client, auth_header, payment_payload):
    response = api_client.post("/api/receipts", headers=auth_header, json=payment_payload)

    assert response.status_code == 201
    assert response.json()["downloadUrl"].startswith("http")
