from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health import router as health_router
from app.api.routes.me import router as me_router
from app.api.routes.receipts import router as receipts_router
from app.api.routes.renters import router as renters_router
from app.api.routes.seed import router as seed_router
from app.core.config import settings
from app.core.rate_limit import RateLimitMiddleware


def create_app() -> FastAPI:
    app = FastAPI(title="Rent Manager API", version="0.1.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins.split(","),
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
    )
    if settings.rate_limit_enabled:
        app.add_middleware(
            RateLimitMiddleware,
            max_requests=settings.rate_limit_requests,
            window_seconds=settings.rate_limit_window_seconds,
            exempt_paths={"/health", "/docs", "/openapi.json", "/redoc"},
        )
    app.include_router(health_router)
    app.include_router(me_router)
    app.include_router(renters_router)
    app.include_router(receipts_router)
    app.include_router(seed_router)
    return app


app = create_app()
