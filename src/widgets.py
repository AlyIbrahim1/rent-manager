import customtkinter as ctk
from datetime import datetime
from src import database
import sqlite3


def compute_rent_status(lastMonthPayed, rentAmount):
    """Return (unpaidMonths, rentDue). Returns (None, None) if lastMonthPayed is empty/invalid."""
    if not lastMonthPayed:
        return (None, None)
    try:
        last_paid = datetime.strptime(lastMonthPayed, "%Y-%m")
    except ValueError:
        return (None, None)
    now = datetime.now().replace(day=1)
    last_paid = last_paid.replace(day=1)
    months = (now.year - last_paid.year) * 12 + (now.month - last_paid.month)
    months = max(0, months)
    return (months, months * rentAmount)
