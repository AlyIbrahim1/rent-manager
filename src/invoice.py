from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas


def generate_receipt(receipt_data):
    appartment_number = receipt_data["appartmentNumber"]
    month_paid = receipt_data["monthPaid"]
    file_path = f"invoices/apt{appartment_number}_{month_paid}.pdf"

    pdf = canvas.Canvas(file_path, pagesize=LETTER)
    width, height = LETTER

    y = height - 72
    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(72, y, "Rent Payment Receipt")

    y -= 36
    pdf.setFont("Helvetica", 12)
    pdf.drawString(72, y, f"Tenant Name: {receipt_data['name']}")

    y -= 24
    pdf.drawString(72, y, f"Apartment Number: {appartment_number}")

    y -= 24
    pdf.drawString(72, y, f"Month Covered: {month_paid}")

    y -= 24
    pdf.drawString(72, y, f"Amount Paid: ${receipt_data['amountPaid']}")

    y -= 24
    pdf.drawString(72, y, f"Date Issued: {receipt_data['dateIssued']}")

    pdf.showPage()
    pdf.save()

    return file_path
