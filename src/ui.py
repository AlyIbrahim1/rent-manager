import customtkinter
from src import database

customtkinter.set_appearance_mode("system")
customtkinter.set_default_color_theme("dark-blue")

window = customtkinter.CTk()

window.title("Rent Management")
window.iconbitmap("assets/app_icon.ico")
window.geometry("1000x650")
window.resizable(False, False) # Makes window unresizable 

frame = customtkinter.CTkFrame(master=window)
frame.pack(pady=20, padx=20, fill="both", expand=True)

label = customtkinter.CTkLabel(master=frame, text="Rent Management System", font=("Roboto", 24))
label.pack(pady=20, padx=10)

window.mainloop()
