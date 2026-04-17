import io
from uuid import uuid4

from fastapi import HTTPException, status
from reportlab.pdfgen import canvas

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.payment import Payment
from app.models.renter import Renter
from app.schemas.receipt import GenerateReceiptRequest


def generate_and_store_receipt(tenant_id: str, payload: GenerateReceiptRequest) -> dict:
    with SessionLocal() as session:
        renter = (
            session.query(Renter)
            .filter(
                Renter.tenant_id == tenant_id,
                Renter.appartmentNumber == payload.appartmentNumber,
            )
            .first()
        )
        if renter is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Renter not found")

        payment = (
            session.query(Payment)
            .filter(
                Payment.tenant_id == tenant_id,
                Payment.renter_id == renter.id,
                Payment.monthPaid == payload.monthPaid,
                Payment.amountPaid == payload.amountPaid,
            )
            .first()
        )
        if payment is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")

    if not settings.supabase_service_role_key:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Receipt storage is not configured. Set SUPABASE_SERVICE_ROLE_KEY to enable.",
        )

    pdf_payload = payload.model_copy(update={"name": renter.name})
    pdf_bytes = _build_receipt_pdf(pdf_payload)

    object_path = (
        f"receipts/{tenant_id}/apt{payload.appartmentNumber}_{payload.monthPaid}_{uuid4().hex[:8]}.pdf"
    )

    from supabase import create_client

    client = create_client(settings.supabase_url, settings.supabase_service_role_key)
    client.storage.from_(settings.supabase_storage_bucket).upload(
        path=object_path,
        file=pdf_bytes,
        file_options={"content-type": "application/pdf"},
    )
    signed = client.storage.from_(settings.supabase_storage_bucket).create_signed_url(
        object_path, expires_in=3600
    )
    return {
        "path": object_path,
        "downloadUrl": signed["signedURL"],
    }


def _build_receipt_pdf(payload: GenerateReceiptRequest) -> bytes:
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=(595, 842))  # A4

    c.setFont("Helvetica-Bold", 20)
    c.drawString(72, 780, "RENT RECEIPT")

    c.setFont("Helvetica", 12)
    c.drawString(72, 740, f"Name:             {payload.name}")
    c.drawString(72, 720, f"Apartment:        {payload.appartmentNumber}")
    c.drawString(72, 700, f"Month Paid:       {payload.monthPaid}")
    c.drawString(72, 680, f"Amount Paid:      ${payload.amountPaid:,}")

    c.setFont("Helvetica", 10)
    c.drawString(72, 72, "This is an automatically generated receipt.")

    c.save()
    return buffer.getvalue()
