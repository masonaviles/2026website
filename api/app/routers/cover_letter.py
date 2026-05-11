from __future__ import annotations

import json
import logging
from collections.abc import AsyncIterator

from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import StreamingResponse

from app.core.config import settings
from app.core.rate_limit import limiter
from app.schemas.ai import CoverLetterIn
from app.services.anthropic_client import (
    MODEL_LETTER,
    cover_letter_system_blocks,
    get_client,
    usage_to_dict,
)

router = APIRouter(prefix="/api/ai", tags=["ai"])
logger = logging.getLogger("mason.ai.letter")


def _build_user_message(payload: CoverLetterIn) -> str:
    header = []
    if payload.company_name:
        header.append(f"Company: {payload.company_name}")
    if payload.role_title:
        header.append(f"Role: {payload.role_title}")
    prefix = "\n".join(header)

    return (
        f"{prefix}\n\n"
        "Job description:\n"
        f"{payload.job_description}\n\n"
        "Write the body of a cover letter from Mason for this role. "
        "Open with a hook tied to a specific thing in the job description. "
        "Then 2 to 3 paragraphs of fit, grounded in real career facts. "
        "Close with a forward-looking sentence. Body only: no salutation, "
        "no signoff."
    )


async def _stream_letter(payload: CoverLetterIn) -> AsyncIterator[bytes]:
    client = get_client()
    system = cover_letter_system_blocks()
    user_message = _build_user_message(payload)

    try:
        async with client.messages.stream(
            model=MODEL_LETTER,
            max_tokens=1500,
            system=system,
            messages=[{"role": "user", "content": user_message}],
        ) as stream:
            async for text in stream.text_stream:
                yield f"data: {json.dumps({'type': 'delta', 'text': text})}\n\n".encode()

            final = await stream.get_final_message()
            usage = usage_to_dict(final.usage)
            logger.info("ai.letter.usage %s", usage)
            yield f"data: {json.dumps({'type': 'done', 'usage': usage})}\n\n".encode()
    except Exception as exc:
        logger.exception("ai.letter.error")
        yield f"data: {json.dumps({'type': 'error', 'detail': str(exc)})}\n\n".encode()


@router.post("/cover-letter")
@limiter.limit("3/hour")
async def cover_letter(
    request: Request, payload: CoverLetterIn
) -> StreamingResponse:
    if not settings.anthropic_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ai cover-letter is not configured (ANTHROPIC_API_KEY missing)",
        )
    return StreamingResponse(
        _stream_letter(payload),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
        },
    )
