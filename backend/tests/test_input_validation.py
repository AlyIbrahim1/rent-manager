def test_create_renter_rejects_zero_rent_amount(api_client, auth_header):
    response = api_client.post(
        "/api/renters",
        headers=auth_header,
        json={
            "appartmentNumber": 900,
            "name": "Invalid Rent",
            "rentAmount": 0,
            "lastMonthPayed": "2026-01",
        },
    )

    assert response.status_code == 422


def test_create_renter_rejects_invalid_last_month_payed(api_client, auth_header):
    response = api_client.post(
        "/api/renters",
        headers=auth_header,
        json={
            "appartmentNumber": 901,
            "name": "Invalid Month",
            "rentAmount": 2000,
            "lastMonthPayed": "2026-13",
        },
    )

    assert response.status_code == 422


def test_record_payment_rejects_invalid_month(api_client, auth_header, renter_id):
    response = api_client.post(
        f"/api/renters/{renter_id}/payments",
        headers=auth_header,
        json={"monthPaid": "2026-13", "amountPaid": 1200},
    )

    assert response.status_code == 422


def test_record_payment_rejects_zero_amount(api_client, auth_header, renter_id):
    response = api_client.post(
        f"/api/renters/{renter_id}/payments",
        headers=auth_header,
        json={"monthPaid": "2026-02", "amountPaid": 0},
    )

    assert response.status_code == 422


def test_upsert_lease_rejects_invalid_date(api_client, auth_header, renter_id):
    response = api_client.put(
        f"/api/renters/{renter_id}/lease",
        headers=auth_header,
        json={
            "startDate": "2026-02-30",
            "endDate": "2026-12-31",
            "depositAmount": 1200,
            "depositStatus": "paid",
        },
    )

    assert response.status_code == 422


def test_upsert_lease_rejects_end_before_start(api_client, auth_header, renter_id):
    response = api_client.put(
        f"/api/renters/{renter_id}/lease",
        headers=auth_header,
        json={
            "startDate": "2026-12-31",
            "endDate": "2026-01-01",
            "depositAmount": 1200,
            "depositStatus": "paid",
        },
    )

    assert response.status_code == 422
