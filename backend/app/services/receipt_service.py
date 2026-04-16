from uuid import uuid4

from app.schemas.receipt import GenerateReceiptRequest


def generate_and_store_receipt(tenant_id: str, payload: GenerateReceiptRequest) -> dict:
    object_path = (
        f"receipts/{tenant_id}/apt{payload.appartmentNumber}_{payload.monthPaid}_{uuid4().hex[:8]}.pdf"
    )
    signed_url = f"https://storage.example.test/{object_path}?token=signed"
    return {
        "path": object_path,
        "downloadUrl": signed_url,
    }
