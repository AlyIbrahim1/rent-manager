import customtkinter as ctk
from datetime import date
from src import models


class MarkPaidDialog(ctk.CTkToplevel):
    MONTHS = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    def __init__(self, master, on_confirm, **kwargs):
        super().__init__(master, **kwargs)
        self.on_confirm = on_confirm
        self.title("Mark Month as Paid")
        self.geometry("300x200")
        self.resizable(False, False)
        self.grab_set()

        ctk.CTkLabel(self, text="Select month paid:", font=("Roboto", 14)).pack(pady=(20, 5))

        now = date.today()
        self.month_var = ctk.StringVar(value=self.MONTHS[now.month - 1])
        self.year_var = ctk.StringVar(value=str(now.year))

        row = ctk.CTkFrame(self, fg_color="transparent")
        row.pack(pady=5)

        ctk.CTkOptionMenu(row, variable=self.month_var, values=self.MONTHS, width=140).pack(side="left", padx=5)

        years = [str(now.year + 1 - i) for i in range(6)]
        ctk.CTkOptionMenu(row, variable=self.year_var, values=years, width=90).pack(side="left", padx=5)

        ctk.CTkButton(self, text="Confirm", command=self._confirm).pack(pady=15)

    def _confirm(self):
        month_num = self.MONTHS.index(self.month_var.get()) + 1
        year = int(self.year_var.get())
        month_str = f"{year}-{month_num:02d}"
        self.on_confirm(month_str)
        self.destroy()


class ReceiptPromptDialog(ctk.CTkToplevel):
    def __init__(self, master, on_choice, **kwargs):
        super().__init__(master, **kwargs)
        self.on_choice = on_choice
        self.title("Generate Receipt")
        self.geometry("320x140")
        self.resizable(False, False)
        self.grab_set()

        ctk.CTkLabel(self, text="Generate receipt?", font=("Roboto", 15, "bold")).pack(pady=(20, 6))
        ctk.CTkLabel(self, text="A PDF will be saved to invoices/", font=("Roboto", 12)).pack()

        row = ctk.CTkFrame(self, fg_color="transparent")
        row.pack(pady=12)

        ctk.CTkButton(row, text="Yes", width=90, command=lambda: self._finish(True)).pack(side="left", padx=8)
        ctk.CTkButton(row, text="No", width=90, command=lambda: self._finish(False)).pack(side="left", padx=8)

    def _finish(self, should_generate):
        self.on_choice(should_generate)
        self.destroy()


class RenterCard(ctk.CTkFrame):
    def __init__(self, master, record, on_click, **kwargs):
        super().__init__(master, **kwargs)
        self.record = record
        self.on_click = on_click

        unpaid = record.get("unpaidMonths")
        due = record.get("rentDue")

        if unpaid is not None and unpaid > 0:
            border_color = "#e74c3c"
        elif record.get("leaseExpiringSoon"):
            border_color = "#f39c12"
        else:
            border_color = "#2ecc71"

        self.configure(border_width=2, border_color=border_color, corner_radius=10, cursor="hand2")

        apt_label = ctk.CTkLabel(self, text=f"Apt #{record['appartmentNumber']}", font=("Roboto", 16, "bold"))
        apt_label.pack(pady=(12, 2), padx=12)

        name_label = ctk.CTkLabel(self, text=record.get("name", "-"), font=("Roboto", 13))
        name_label.pack(pady=2, padx=12)

        rent_label = ctk.CTkLabel(self, text=f"${record.get('rentAmount', 0)}/mo", font=("Roboto", 12))
        rent_label.pack(pady=2, padx=12)

        if unpaid is None:
            unpaid_text = "Last paid: N/A"
            due_text = "Due: N/A"
        else:
            unpaid_text = f"{unpaid} month{'s' if unpaid != 1 else ''} unpaid"
            due_text = f"Due: ${due}"

        unpaid_label = ctk.CTkLabel(self, text=unpaid_text, font=("Roboto", 12), text_color=border_color)
        unpaid_label.pack(pady=2, padx=12)

        due_label = ctk.CTkLabel(self, text=due_text, font=("Roboto", 12))
        due_label.pack(pady=(2, 12), padx=12)

        for widget in [self, apt_label, name_label, rent_label, unpaid_label, due_label]:
            widget.bind("<Button-1>", lambda _e: self.on_click(self.record))


class SidePanel(ctk.CTkFrame):
    def __init__(self, master, record, on_generate_receipt, on_save, on_delete, on_close, **kwargs):
        super().__init__(master, **kwargs)
        self.record = record
        self.on_generate_receipt = on_generate_receipt
        self.on_save = on_save
        self.on_delete = on_delete
        self.on_close = on_close
        self._build()

    def _build(self):
        record = self.record
        lease = models.get_lease(record["appartmentNumber"]) or {}

        ctk.CTkButton(self, text="X", width=30, command=self.on_close).pack(anchor="ne", padx=10, pady=(10, 0))
        ctk.CTkLabel(self, text=f"Apt #{record['appartmentNumber']}", font=("Roboto", 18, "bold")).pack(pady=(0, 10))

        self._name_var = ctk.StringVar(value=record.get("name", ""))
        self._rent_var = ctk.StringVar(value=str(record.get("rentAmount", "")))
        self._last_paid_var = ctk.StringVar(value=record.get("lastMonthPayed", ""))

        self._lease_start_var = ctk.StringVar(value=lease.get("startDate", ""))
        self._lease_end_var = ctk.StringVar(value=lease.get("endDate", ""))
        self._deposit_var = ctk.StringVar(value=str(lease.get("depositAmount", "")) if lease else "")
        self._deposit_status_var = ctk.StringVar(value=lease.get("depositStatus", "pending"))
        self._renewal_notes_var = ctk.StringVar(value=lease.get("renewalNotes", ""))

        self._last_paid_var.trace_add("write", lambda *_args: self._update_computed())
        self._rent_var.trace_add("write", lambda *_args: self._update_computed())

        for label, var, hint in [
            ("Name", self._name_var, ""),
            ("Rent Amount ($)", self._rent_var, ""),
            ("Last Month Paid", self._last_paid_var, "YYYY-MM"),
        ]:
            ctk.CTkLabel(self, text=label, font=("Roboto", 12)).pack(anchor="w", padx=20)
            ctk.CTkEntry(self, textvariable=var, placeholder_text=hint).pack(fill="x", padx=20, pady=(0, 8))

        self._unpaid_label = ctk.CTkLabel(self, text="", font=("Roboto", 12))
        self._unpaid_label.pack(anchor="w", padx=20)
        self._due_label = ctk.CTkLabel(self, text="", font=("Roboto", 12))
        self._due_label.pack(anchor="w", padx=20, pady=(0, 8))
        self._update_computed()

        ctk.CTkLabel(self, text="Lease Details", font=("Roboto", 13, "bold")).pack(anchor="w", padx=20, pady=(4, 2))

        for label, var, hint in [
            ("Start Date", self._lease_start_var, "YYYY-MM-DD"),
            ("End Date", self._lease_end_var, "YYYY-MM-DD"),
            ("Deposit Amount ($)", self._deposit_var, "0"),
        ]:
            ctk.CTkLabel(self, text=label, font=("Roboto", 12)).pack(anchor="w", padx=20)
            ctk.CTkEntry(self, textvariable=var, placeholder_text=hint).pack(fill="x", padx=20, pady=(0, 6))

        ctk.CTkLabel(self, text="Deposit Status", font=("Roboto", 12)).pack(anchor="w", padx=20)
        ctk.CTkOptionMenu(
            self,
            variable=self._deposit_status_var,
            values=["pending", "paid", "returned"],
        ).pack(fill="x", padx=20, pady=(0, 6))

        ctk.CTkLabel(self, text="Renewal Notes", font=("Roboto", 12)).pack(anchor="w", padx=20)
        ctk.CTkEntry(self, textvariable=self._renewal_notes_var, placeholder_text="optional").pack(
            fill="x", padx=20, pady=(0, 8)
        )

        self._error_label = ctk.CTkLabel(self, text="", text_color="red", font=("Roboto", 11))
        self._error_label.pack(anchor="w", padx=20)

        buttons = ctk.CTkFrame(self, fg_color="transparent")
        buttons.pack(pady=(6, 4), fill="x", padx=20)

        ctk.CTkButton(buttons, text="Save", command=self._save).pack(side="left", padx=4)
        ctk.CTkButton(buttons, text="Mark Paid", command=self._mark_paid).pack(side="left", padx=4)

        self._delete_btn = ctk.CTkButton(
            buttons,
            text="Delete",
            fg_color="#e74c3c",
            hover_color="#c0392b",
            command=self._delete_step1,
        )
        self._delete_btn.pack(side="left", padx=4)

        ctk.CTkLabel(self, text="Payment History", font=("Roboto", 13, "bold")).pack(anchor="w", padx=20, pady=(4, 2))
        history_frame = ctk.CTkScrollableFrame(self, height=130)
        history_frame.pack(fill="x", padx=20, pady=(0, 8))

        history = models.get_payment_history(record["appartmentNumber"])
        if not history:
            ctk.CTkLabel(history_frame, text="No payments recorded yet.", font=("Roboto", 12)).pack(anchor="w", pady=6)
        else:
            for payment in history:
                row = ctk.CTkFrame(history_frame, fg_color="transparent")
                row.pack(fill="x", pady=2)
                text = f"{payment['monthPaid']} | ${payment['amountPaid']} | {payment['dateRecorded']}"
                ctk.CTkLabel(row, text=text, font=("Roboto", 11)).pack(side="left", padx=(0, 6))
                ctk.CTkButton(
                    row,
                    text="Generate Receipt",
                    width=130,
                    height=24,
                    command=lambda p=payment: self._generate_from_history(p),
                ).pack(side="right")

    def _update_computed(self):
        try:
            rent = int(self._rent_var.get())
        except ValueError:
            rent = 0

        unpaid, due = models.compute_rent_status(self._last_paid_var.get().strip(), rent)
        if unpaid is None:
            self._unpaid_label.configure(text="Unpaid months: N/A")
            self._due_label.configure(text="Rent due: N/A")
        else:
            self._unpaid_label.configure(text=f"Unpaid months: {unpaid}")
            self._due_label.configure(text=f"Rent due: ${due}")

    def _save(self):
        try:
            rent = int(self._rent_var.get())
        except ValueError:
            self._error_label.configure(text="Rent must be a positive integer.")
            return

        try:
            models.update_renter(
                appartment_number=self.record["appartmentNumber"],
                name=self._name_var.get().strip(),
                rent_amount=rent,
                last_month_payed=self._last_paid_var.get().strip(),
            )

            models.save_lease(
                appartment_number=self.record["appartmentNumber"],
                start_date=self._lease_start_var.get().strip(),
                end_date=self._lease_end_var.get().strip(),
                deposit_amount=self._deposit_var.get().strip(),
                deposit_status=self._deposit_status_var.get().strip(),
                renewal_notes=self._renewal_notes_var.get(),
            )
        except ValueError as exc:
            self._error_label.configure(text=str(exc))
            return

        self._error_label.configure(text="")
        self.on_save()

    def _mark_paid(self):
        def on_confirm(month_str):
            try:
                amount_paid = int(self._rent_var.get())
            except ValueError:
                self._error_label.configure(text="Set a valid rent amount before marking paid.")
                return

            try:
                receipt_data = models.record_payment(
                    appartment_number=self.record["appartmentNumber"],
                    month_paid=month_str,
                    amount_paid=amount_paid,
                )
            except ValueError as exc:
                self._error_label.configure(text=str(exc))
                return

            self._error_label.configure(text="")

            def on_receipt_choice(should_generate):
                if should_generate:
                    self.on_generate_receipt(receipt_data)
                self.on_save()

            ReceiptPromptDialog(self, on_choice=on_receipt_choice)

        MarkPaidDialog(self, on_confirm=on_confirm)

    def _generate_from_history(self, payment):
        receipt_data = {
            "appartmentNumber": self.record["appartmentNumber"],
            "name": self._name_var.get().strip() or self.record.get("name", ""),
            "monthPaid": payment["monthPaid"],
            "amountPaid": payment["amountPaid"],
            "dateIssued": payment["dateRecorded"],
        }
        self.on_generate_receipt(receipt_data)

    def _delete_step1(self):
        self._delete_btn.configure(text="Are you sure?", command=self._delete_confirm)

    def _delete_confirm(self):
        models.delete_renter(self.record["appartmentNumber"])
        self.on_delete()


class AddRenterModal(ctk.CTkToplevel):
    def __init__(self, master, on_submit, **kwargs):
        super().__init__(master, **kwargs)
        self.on_submit = on_submit
        self.title("Add Renter")
        self.geometry("360x380")
        self.resizable(False, False)
        self.grab_set()

        ctk.CTkLabel(self, text="Add New Renter", font=("Roboto", 18, "bold")).pack(pady=(20, 10))

        self._apt_var = ctk.StringVar()
        self._name_var = ctk.StringVar()
        self._rent_var = ctk.StringVar()
        self._last_paid_var = ctk.StringVar()

        for label, var, hint in [
            ("Apartment Number", self._apt_var, ""),
            ("Name", self._name_var, ""),
            ("Rent Amount ($)", self._rent_var, ""),
            ("Last Month Paid (YYYY-MM)", self._last_paid_var, "optional"),
        ]:
            ctk.CTkLabel(self, text=label, font=("Roboto", 12)).pack(anchor="w", padx=30)
            ctk.CTkEntry(self, textvariable=var, placeholder_text=hint).pack(fill="x", padx=30, pady=(0, 8))

        self._error_label = ctk.CTkLabel(self, text="", text_color="red", font=("Roboto", 11))
        self._error_label.pack()

        ctk.CTkButton(self, text="Add Renter", command=self._submit).pack(pady=10)

    def _submit(self):
        try:
            apt = int(self._apt_var.get())
            rent = int(self._rent_var.get())
        except ValueError:
            self._error_label.configure(text="Apartment and rent must be positive integers.")
            return

        try:
            models.add_renter(
                appartment_number=apt,
                name=self._name_var.get().strip(),
                rent_amount=rent,
                last_month_payed=self._last_paid_var.get().strip(),
            )
        except ValueError as exc:
            self._error_label.configure(text=str(exc))
            return

        self.on_submit()
        self.destroy()
