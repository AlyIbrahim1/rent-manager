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


class RenterCard(ctk.CTkFrame):
    def __init__(self, master, record, on_click, **kwargs):
        super().__init__(master, **kwargs)
        self.record = record
        self.on_click = on_click

        unpaid, due = compute_rent_status(record.get("lastMonthPayed", ""), record.get("rentAmount", 0))

        border_color = "#2ecc71" if (unpaid is None or unpaid == 0) else "#e74c3c"
        self.configure(border_width=2, border_color=border_color, corner_radius=10, cursor="hand2")

        apt_label = ctk.CTkLabel(self, text=f"Apt #{record['appartmentNumber']}",
                                  font=("Roboto", 16, "bold"))
        apt_label.pack(pady=(12, 2), padx=12)

        name_label = ctk.CTkLabel(self, text=record.get("name", "—"), font=("Roboto", 13))
        name_label.pack(pady=2, padx=12)

        rent_label = ctk.CTkLabel(self, text=f"${record.get('rentAmount', 0)}/mo", font=("Roboto", 12))
        rent_label.pack(pady=2, padx=12)

        if unpaid is None:
            unpaid_text = "Last paid: N/A"
            due_text = "Due: N/A"
        else:
            unpaid_text = f"{unpaid} month{'s' if unpaid != 1 else ''} unpaid"
            due_text = f"Due: ${due}"

        unpaid_label = ctk.CTkLabel(self, text=unpaid_text, font=("Roboto", 12),
                                     text_color=border_color)
        unpaid_label.pack(pady=2, padx=12)

        due_label = ctk.CTkLabel(self, text=due_text, font=("Roboto", 12))
        due_label.pack(pady=(2, 12), padx=12)

        for widget in [self, apt_label, name_label, rent_label, unpaid_label, due_label]:
            widget.bind("<Button-1>", lambda e: self.on_click(self.record))
