from typing import Annotated

from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.rate_limit import limiter
from app.db.engine import get_session
from app.db.models.contact import Contact
from app.schemas.contact import ContactIn, ContactOut

router = APIRouter(prefix="/api", tags=["contact"])

SessionDep = Annotated[AsyncSession, Depends(get_session)]


@router.post("/contact", response_model=ContactOut)
@limiter.limit("5/hour")
async def submit_contact(
    request: Request,
    payload: ContactIn,
    session: SessionDep,
) -> ContactOut:
    contact = Contact(
        name=payload.name.strip(),
        email=payload.email,
        message=payload.message.strip(),
        source_ip=request.client.host if request.client else None,
    )
    session.add(contact)
    await session.commit()
    return ContactOut(ok=True)
