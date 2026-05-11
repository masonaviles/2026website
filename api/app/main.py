from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.rate_limit import limiter
from app.routers import ai_chat, contact, cover_letter, health

app = FastAPI(
    title="mason.os API",
    version="0.1.0",
    description="FastAPI backend for gitaddmason.dev",
)

app.state.limiter = limiter


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(_request: Request, exc: RateLimitExceeded) -> JSONResponse:
    return JSONResponse(
        status_code=429,
        content={"detail": f"Rate limit exceeded: {exc.detail}"},
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    allow_credentials=False,
)

app.include_router(health.router)
app.include_router(contact.router)
app.include_router(ai_chat.router)
app.include_router(cover_letter.router)


@app.get("/")
async def root() -> dict[str, str]:
    return {"service": "mason.os api", "version": "0.1.0"}
