from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import health

app = FastAPI(
    title="mason.os API",
    version="0.1.0",
    description="FastAPI backend for gitaddmason.dev",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    allow_credentials=False,
)

app.include_router(health.router)


@app.get("/")
async def root() -> dict[str, str]:
    return {"service": "mason.os api", "version": "0.1.0"}
