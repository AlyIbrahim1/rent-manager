from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.api.routes.me import router as me_router
from app.api.routes.receipts import router as receipts_router
from app.api.routes.renters import router as renters_router


def create_app() -> FastAPI:
    app = FastAPI(title="Rent Manager API", version="0.1.0")
    app.include_router(health_router)
    app.include_router(me_router)
    app.include_router(renters_router)
    app.include_router(receipts_router)
    return app


app = create_app()
