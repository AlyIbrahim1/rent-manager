from unittest.mock import patch
from datetime import datetime

def test_compute_two_unpaid_months():
    from src.models import compute_rent_status
    with patch("src.models.date") as mock_date:
        mock_date.today.return_value = datetime(2026, 3, 15).date()
        unpaid, due = compute_rent_status("2026-01", 1200)
    assert unpaid == 2
    assert due == 2400

def test_compute_zero_when_paid_current_month():
    from src.models import compute_rent_status
    with patch("src.models.date") as mock_date:
        mock_date.today.return_value = datetime(2026, 3, 15).date()
        unpaid, due = compute_rent_status("2026-03", 1000)
    assert unpaid == 0
    assert due == 0

def test_compute_zero_when_future_date():
    from src.models import compute_rent_status
    with patch("src.models.date") as mock_date:
        mock_date.today.return_value = datetime(2026, 3, 15).date()
        unpaid, due = compute_rent_status("2026-06", 1000)
    assert unpaid == 0
    assert due == 0

def test_compute_returns_none_when_empty():
    from src.models import compute_rent_status
    unpaid, due = compute_rent_status("", 1000)
    assert unpaid is None
    assert due is None

def test_compute_returns_none_when_invalid_format():
    from src.models import compute_rent_status
    unpaid, due = compute_rent_status("January 2026", 1000)
    assert unpaid is None
    assert due is None
