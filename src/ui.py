import customtkinter as ctk
from src import invoice, models
from src.widgets import RenterCard, SidePanel, AddRenterModal

ctk.set_appearance_mode("system")
ctk.set_default_color_theme("dark-blue")


class App(ctk.CTk):
    CARD_WIDTH = 180
    CARD_HEIGHT = 160
    PANEL_WIDTH = 340

    def __init__(self):
        super().__init__()
        self.title("Rent Management")
        self.iconbitmap("assets/app_icon.ico")
        self.geometry("1000x650")
        self.resizable(False, False)

        self._side_panel = None
        self._build_header()
        self._build_body()
        self.refresh()

    def _build_header(self):
        header = ctk.CTkFrame(self, height=60, corner_radius=0)
        header.pack(fill="x")
        header.pack_propagate(False)

        ctk.CTkLabel(header, text="Rent Management System",
                    font=("Roboto", 22, "bold")).pack(side="left", padx=20, pady=10)

        ctk.CTkButton(header, text="+ Add Renter", width=130,
                    command=self._open_add_modal).pack(side="right", padx=20, pady=10)

    def _build_body(self):
        self._body = ctk.CTkFrame(self, fg_color="transparent")
        self._body.pack(fill="both", expand=True, padx=10, pady=10)

        self._grid_frame = ctk.CTkScrollableFrame(self._body, fg_color="transparent")
        self._grid_frame.pack(side="left", fill="both", expand=True)

    def refresh(self):
        if self._side_panel:
            self._side_panel.destroy()
            self._side_panel = None
            self._grid_frame.pack(side="left", fill="both", expand=True)

        for widget in self._grid_frame.winfo_children():
            widget.destroy()

        records = models.list_renters()
        if not records:
            ctk.CTkLabel(self._grid_frame, text="No renters yet. Add one to get started.",
                        font=("Roboto", 14), text_color="gray").pack(pady=40)
            return

        cols = max(1, (1000 - 20) // (self.CARD_WIDTH + 16))
        for i, record in enumerate(records):
            row, col = divmod(i, cols)
            card = RenterCard(self._grid_frame, record, on_click=self._open_side_panel,
                            width=self.CARD_WIDTH, height=self.CARD_HEIGHT)
            card.grid(row=row, column=col, padx=8, pady=8, sticky="nw")

    def _open_side_panel(self, record):
        if self._side_panel:
            self._side_panel.destroy()

        self._grid_frame.pack_configure(expand=False)
        self._grid_frame.configure(width=1000 - self.PANEL_WIDTH - 30)

        self._side_panel = SidePanel(
            self._body,
            record=record,
            on_generate_receipt=self._generate_receipt,
            on_save=self.refresh,
            on_delete=self.refresh,
            on_close=self.refresh,
            width=self.PANEL_WIDTH,
        )
        self._side_panel.pack(side="right", fill="y", padx=(0, 5))

    def _open_add_modal(self):
        AddRenterModal(self, on_submit=self.refresh)

    def _generate_receipt(self, receipt_data):
        return invoice.generate_receipt(receipt_data)


