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


class MarkPaidDialog(ctk.CTkToplevel):
    MONTHS = ["January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"]

    def __init__(self, master, on_confirm, **kwargs):
        super().__init__(master, **kwargs)
        self.on_confirm = on_confirm
        self.title("Mark Month as Paid")
        self.geometry("300x200")
        self.resizable(False, False)
        self.grab_set()

        ctk.CTkLabel(self, text="Select month paid:", font=("Roboto", 14)).pack(pady=(20, 5))

        now = datetime.now()
        self.month_var = ctk.StringVar(value=self.MONTHS[now.month - 1])
        self.year_var = ctk.StringVar(value=str(now.year))

        row = ctk.CTkFrame(self, fg_color="transparent")
        row.pack(pady=5)

        self.month_menu = ctk.CTkOptionMenu(row, variable=self.month_var, values=self.MONTHS, width=140)
        self.month_menu.pack(side="left", padx=5)

        years = [str(now.year - i) for i in range(5)]
        self.year_menu = ctk.CTkOptionMenu(row, variable=self.year_var, values=years, width=90)
        self.year_menu.pack(side="left", padx=5)

        ctk.CTkButton(self, text="Confirm", command=self._confirm).pack(pady=15)

    def _confirm(self):
        month_num = self.MONTHS.index(self.month_var.get()) + 1
        year = int(self.year_var.get())
        month_str = f"{year}-{month_num:02d}"
        self.on_confirm(month_str)
        self.destroy()


class SidePanel(ctk.CTkFrame):
    def __init__(self, master, record, on_save, on_delete, on_close, **kwargs):
        super().__init__(master, **kwargs)
        self.record = record
        self.on_save = on_save
        self.on_delete = on_delete
        self.on_close = on_close
        self._build()

    def _build(self):
        r = self.record

        ctk.CTkButton(self, text="✕", width=30, command=self.on_close).pack(anchor="ne", padx=10, pady=(10, 0))
        ctk.CTkLabel(self, text=f"Apt #{r['appartmentNumber']}", font=("Roboto", 18, "bold")).pack(pady=(0, 10))

        self._name_var = ctk.StringVar(value=r.get("name", ""))
        self._rent_var = ctk.StringVar(value=str(r.get("rentAmount", "")))
        self._last_paid_var = ctk.StringVar(value=r.get("lastMonthPayed", ""))
        self._last_paid_var.trace_add("write", lambda *_: self._update_computed())

        for label, var, hint in [
            ("Name", self._name_var, None),
            ("Rent Amount ($)", self._rent_var, None),
            ("Last Month Paid", self._last_paid_var, "YYYY-MM"),
        ]:
            ctk.CTkLabel(self, text=label, font=("Roboto", 12)).pack(anchor="w", padx=20)
            ctk.CTkEntry(self, textvariable=var, placeholder_text=hint or "").pack(fill="x", padx=20, pady=(0, 8))

        self._unpaid_label = ctk.CTkLabel(self, text="", font=("Roboto", 12))
        self._unpaid_label.pack(anchor="w", padx=20)
        self._due_label = ctk.CTkLabel(self, text="", font=("Roboto", 12))
        self._due_label.pack(anchor="w", padx=20, pady=(0, 12))
        self._update_computed()

        self._error_label = ctk.CTkLabel(self, text="", text_color="red", font=("Roboto", 11))
        self._error_label.pack()

        btn_frame = ctk.CTkFrame(self, fg_color="transparent")
        btn_frame.pack(pady=10, fill="x", padx=20)

        ctk.CTkButton(btn_frame, text="Save", command=self._save).pack(side="left", padx=4)
        ctk.CTkButton(btn_frame, text="Mark Paid", command=self._mark_paid).pack(side="left", padx=4)

        self._delete_btn = ctk.CTkButton(btn_frame, text="Delete", fg_color="#e74c3c",
                                          hover_color="#c0392b", command=self._delete_step1)
        self._delete_btn.pack(side="left", padx=4)

    def _update_computed(self):
        try:
            rent = int(self._rent_var.get())
        except ValueError:
            rent = 0
        unpaid, due = compute_rent_status(self._last_paid_var.get(), rent)
        if unpaid is None:
            self._unpaid_label.configure(text="Unpaid months: N/A")
            self._due_label.configure(text="Rent due: N/A")
        else:
            self._unpaid_label.configure(text=f"Unpaid months: {unpaid}")
            self._due_label.configure(text=f"Rent due: ${due}")

    def _save(self):
        name = self._name_var.get().strip()
        if not name:
            self._error_label.configure(text="Name cannot be empty.")
            return
        try:
            rent = int(self._rent_var.get())
            if rent <= 0:
                raise ValueError
        except ValueError:
            self._error_label.configure(text="Rent must be a positive integer.")
            return
        last_paid = self._last_paid_var.get().strip()
        unpaid, due = compute_rent_status(last_paid, rent)
        if unpaid is None:
            unpaid = self.record.get("unpaidMonths", 0)
            due = self.record.get("rentDue", 0)
        database.updateRecord(self.record["appartmentNumber"], name, rent, last_paid, unpaid, due)
        self.on_save()

    def _mark_paid(self):
        def on_confirm(month_str):
            self._last_paid_var.set(month_str)
            self._save()
        MarkPaidDialog(self, on_confirm=on_confirm)

    def _delete_step1(self):
        self._delete_btn.configure(text="Are you sure?", command=self._delete_confirm)

    def _delete_confirm(self):
        database.deleteRecord(self.record["appartmentNumber"])
        self.on_delete()
