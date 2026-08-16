from slowapi import Limiter
from starlette.requests import Request

from app.core.config import get_settings

settings = get_settings()


def get_client_ip(request: Request) -> str:
    """Rate-limit key = the real client IP, not the proxy.

    Behind Cloud Run (and other reverse proxies) ``request.client.host`` is the
    load balancer's address, so keying on it would collapse every user into a
    single shared bucket. Prefer the first ``X-Forwarded-For`` hop and fall
    back to the socket peer when the header is absent (e.g. local dev).
    """
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client and request.client.host:
        return request.client.host
    return "127.0.0.1"


limiter = Limiter(
    key_func=get_client_ip,
    default_limits=[f"{settings.rate_limit_requests}/minute"],
)
