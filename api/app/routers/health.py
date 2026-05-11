from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.engine import get_session

router = APIRouter(tags=["health"])

SessionDep = Annotated[AsyncSession, Depends(get_session)]


@router.get("/health")
async def health(session: SessionDep) -> dict[str, str | bool]:
    try:
        result = await session.execute(text("select 1"))
        db_ok = result.scalar() == 1
    except Exception:
        db_ok = False
    return {"ok": True, "db": "ok" if db_ok else "down"}
