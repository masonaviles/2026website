"""Cloudflare Turnstile verification.

In production, every gated endpoint must receive a token from the browser
widget and call `require_turnstile()` before doing any expensive work
(LLM call, DB write, etc.).

In dev — when TURNSTILE_SECRET is not set — verification is *bypassed*
so local development doesn't need a real Cloudflare site. The bypass is
logged with a clear marker so production misconfiguration is visible.
"""

from __future__ import annotations

import logging

import httpx
from fastapi import HTTPException, Request, status

from app.core.config import settings

VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
TIMEOUT_SECONDS = 5.0

logger = logging.getLogger("mason.turnstile")


async def verify_turnstile(
    token: str | None,
    remote_ip: str | None = None,
) -> tuple[bool, str]:
    """Return (ok, reason). `reason` is informational — for logs, not UX."""
    if not settings.turnstile_secret:
        return True, "dev-bypass"
    if not token:
        return False, "missing-token"

    payload = {
        "secret": settings.turnstile_secret,
        "response": token,
    }
    if remote_ip:
        payload["remoteip"] = remote_ip

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS) as client:
            resp = await client.post(VERIFY_URL, data=payload)
            data = resp.json()
    except (httpx.HTTPError, ValueError) as exc:
        logger.warning("turnstile verify network/parse error: %s", exc)
        return False, "verify-network-error"

    if data.get("success"):
        return True, "ok"
    codes = data.get("error-codes") or []
    return False, ",".join(codes) or "unknown"


async def require_turnstile(request: Request, token: str | None) -> None:
    """Raise 403 if the token fails verification.

    Side-effect: logs a debug line on bypass and a warning on failure.
    """
    ip = request.client.host if request.client else None
    ok, reason = await verify_turnstile(token, ip)
    if not ok:
        logger.warning("turnstile rejected ip=%s reason=%s", ip, reason)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"verification required ({reason})",
        )
    if reason == "dev-bypass":
        logger.debug("turnstile bypassed (TURNSTILE_SECRET not set)")
