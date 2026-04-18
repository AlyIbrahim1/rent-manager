from collections import defaultdict, deque
from threading import Lock
from time import monotonic

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from starlette.types import ASGIApp


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(
        self,
        app: ASGIApp,
        *,
        max_requests: int,
        window_seconds: int,
        exempt_paths: set[str] | None = None,
    ) -> None:
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.exempt_paths = exempt_paths or set()
        self._events: dict[str, deque[float]] = defaultdict(deque)
        self._lock = Lock()

    def _client_key(self, request: Request) -> str:
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",", maxsplit=1)[0].strip()
        if request.client:
            return request.client.host
        return "unknown"

    async def dispatch(self, request: Request, call_next):
        if request.url.path in self.exempt_paths:
            return await call_next(request)

        now = monotonic()
        key = self._client_key(request)

        with self._lock:
            events = self._events[key]
            cutoff = now - self.window_seconds
            while events and events[0] <= cutoff:
                events.popleft()

            if len(events) >= self.max_requests:
                retry_after = max(1, int(self.window_seconds - (now - events[0])))
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Rate limit exceeded. Try again later."},
                    headers={"Retry-After": str(retry_after)},
                )

            events.append(now)

        return await call_next(request)
