from unittest.mock import patch
from datetime import datetime

def test_compute_two_unpaid_months():
    from src.widgets import compute_rent_status
    with patch("src.widgets.datetime") as mock_dt:
        mock_dt.now.return_value = datetime(2026, 3, 15)
        mock_dt.strptime.side_effect = lambda *a, **kw: datetime.strptime(*a, **kw)
        unpaid, due = compute_rent_status("2026-01", 1200)
    assert unpaid == 2
    assert due == 2400

def test_compute_zero_when_paid_current_month():
    from src.widgets import compute_rent_status
    with patch("src.widgets.datetime") as mock_dt:
        mock_dt.now.return_value = datetime(2026, 3, 15)
        mock_dt.strptime.side_effect = lambda *a, **kw: datetime.strptime(*a, **kw)
        unpaid, due = compute_rent_status("2026-03", 1000)
    assert unpaid == 0
    assert due == 0

def test_compute_zero_when_future_date():
    from src.widgets import compute_rent_status
    with patch("src.widgets.datetime") as mock_dt:
        mock_dt.now.return_value = datetime(2026, 3, 15)
        mock_dt.strptime.side_effect = lambda *a, **kw: datetime.strptime(*a, **kw)
        unpaid, due = compute_rent_status("2026-06", 1000)
    assert unpaid == 0
    assert due == 0

def test_compute_returns_none_when_empty():
    from src.widgets import compute_rent_status
    unpaid, due = compute_rent_status("", 1000)
    assert unpaid is None
    assert due is None

def test_compute_returns_none_when_invalid_format():
    from src.widgets import compute_rent_status
    unpaid, due = compute_rent_status("January 2026", 1000)
    assert unpaid is None
    assert due is None
