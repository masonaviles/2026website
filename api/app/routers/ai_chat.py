from __future__ import annotations

import json
import logging
from collections.abc import AsyncIterator

from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import StreamingResponse

from app.core.config import settings
from app.core.rate_limit import limiter
from app.schemas.ai import ChatIn
from app.services.anthropic_client import (
    MODEL_CHAT,
    chat_system_blocks,
    get_client,
    usage_to_dict,
)

router = APIRouter(prefix="/api/ai", tags=["ai"])
logger = logging.getLogger("mason.ai.chat")


async def _stream_chat(payload: ChatIn) -> AsyncIterator[bytes]:
    """Yield SSE-formatted events. Each line: data: {json}\\n\\n."""
    client = get_client()
    system = chat_system_blocks()
    messages = [{"role": m.role, "content": m.content} for m in payload.messages]

    try:
        async with client.messages.stream(
            model=MODEL_CHAT,
            max_tokens=1024,
            system=system,
            messages=messages,
        ) as stream:
            async for text in stream.text_stream:
                yield f"data: {json.dumps({'type': 'delta', 'text': text})}\n\n".encode()

            final = await stream.get_final_message()
            usage = usage_to_dict(final.usage)
            logger.info("ai.chat.usage %s", usage)
            yield f"data: {json.dumps({'type': 'done', 'usage': usage})}\n\n".encode()
    except Exception as exc:
        logger.exception("ai.chat.error")
        yield f"data: {json.dumps({'type': 'error', 'detail': str(exc)})}\n\n".encode()


@router.post("/chat")
@limiter.limit("10/hour")
async def chat(request: Request, payload: ChatIn) -> StreamingResponse:
    if not settings.anthropic_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ai chat is not configured (ANTHROPIC_API_KEY missing)",
        )
    return StreamingResponse(
        _stream_chat(payload),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
        },
    )
