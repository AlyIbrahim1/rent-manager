from datetime import date, datetime
from src import database

DEPOSIT_STATUSES = {"pending", "paid", "returned"}


def _parse_paid_month(value):
    if not value:
        return None
    return datetime.strptime(value, "%Y-%m").date().replace(day=1)


def _parse_iso_date(value):
    if not value:
        return None
    return datetime.strptime(value, "%Y-%m-%d").date()


def compute_rent_status(last_month_payed, rent_amount, today=None):
    if not last_month_payed:
        return (None, None)

    try:
        last_paid = _parse_paid_month(last_month_payed)
    except ValueError:
        return (None, None)

    if today is None:
        today = date.today()

    months_elapsed = (today.year - last_paid.year) * 12 + (today.month - last_paid.month)
    unpaid_months = max(0, months_elapsed)
    return (unpaid_months, unpaid_months * rent_amount)


def lease_is_expiring_within_days(end_date, days=30, today=None):
    if not end_date:
        return False

    try:
        parsed_end = _parse_iso_date(end_date)
    except ValueError:
        return False

    if today is None:
        today = date.today()

    delta = (parsed_end - today).days
    return 0 <= delta <= days


def list_renters():
    records = database.getAllRecords()
    enriched = []
    for record in records:
        unpaid, due = compute_rent_status(record.get("lastMonthPayed"), record.get("rentAmount", 0))
        lease = database.getLease(record["appartmentNumber"])
        record_with_status = {
            **record,
            "unpaidMonths": unpaid,
            "rentDue": due,
            "lease": lease,
            "leaseExpiringSoon": lease_is_expiring_within_days(lease.get("endDate") if lease else None),
        }
        enriched.append(record_with_status)
    return enriched


def add_renter(appartment_number, name, rent_amount, last_month_payed=""):
    if appartment_number <= 0:
        raise ValueError("Apartment number must be a positive integer.")
    if not name.strip():
        raise ValueError("Name cannot be empty.")
    if rent_amount <= 0:
        raise ValueError("Rent amount must be a positive integer.")
    if last_month_payed:
        _parse_paid_month(last_month_payed)

    try:
        database.addRecord(appartment_number, name.strip(), rent_amount, last_month_payed)
    except Exception as exc:
        if "UNIQUE constraint failed" in str(exc):
            raise ValueError(f"Apartment #{appartment_number} already exists.") from exc
        raise


def update_renter(appartment_number, name, rent_amount, last_month_payed=""):
    if not name.strip():
        raise ValueError("Name cannot be empty.")
    if rent_amount <= 0:
        raise ValueError("Rent amount must be a positive integer.")
    if last_month_payed:
        _parse_paid_month(last_month_payed)

    database.updateRecord(appartment_number, name.strip(), rent_amount, last_month_payed)


def delete_renter(appartment_number):
    database.deleteRecord(appartment_number)


def save_lease(appartment_number, start_date="", end_date="", deposit_amount=None, deposit_status="pending", renewal_notes=""):
    if not start_date and not end_date and deposit_amount in (None, "") and not renewal_notes.strip() and not deposit_status:
        return

    if deposit_status not in DEPOSIT_STATUSES:
        raise ValueError("Deposit status must be pending, paid, or returned.")

    parsed_start = _parse_iso_date(start_date) if start_date else None
    parsed_end = _parse_iso_date(end_date) if end_date else None

    if parsed_start and parsed_end and parsed_end <= parsed_start:
        raise ValueError("Lease end date must be after start date.")

    if deposit_amount in (None, ""):
        normalized_deposit = 0
    else:
        normalized_deposit = int(deposit_amount)
        if normalized_deposit < 0:
            raise ValueError("Deposit amount cannot be negative.")

    database.upsertLease(
        appartment_number,
        start_date,
        end_date,
        normalized_deposit,
        deposit_status,
        renewal_notes.strip(),
    )


def get_lease(appartment_number):
    return database.getLease(appartment_number)


def get_payment_history(appartment_number):
    return database.getPayments(appartment_number)


def record_payment(appartment_number, month_paid, amount_paid):
    _parse_paid_month(month_paid)
    if amount_paid <= 0:
        raise ValueError("Amount paid must be a positive integer.")

    renter = next(
        (item for item in database.getAllRecords() if item["appartmentNumber"] == appartment_number),
        None,
    )
    if not renter:
        raise ValueError("Renter not found.")

    today_str = date.today().isoformat()
    database.addPayment(appartment_number, month_paid, amount_paid, today_str)

    database.updateRecord(appartment_number, renter["name"], renter["rentAmount"], month_paid)

    return {
        "appartmentNumber": appartment_number,
        "name": renter["name"],
        "monthPaid": month_paid,
        "amountPaid": amount_paid,
        "dateIssued": today_str,
    }
