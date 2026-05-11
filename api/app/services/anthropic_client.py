"""Anthropic API client wrapper with prompt caching.

The `MASON_KNOWLEDGE` markdown block is the cached prefix shared by both
the chat and cover-letter endpoints. Once warmed, subsequent requests see
cache_read_input_tokens > 0 — cheaper and faster TTFB.
"""

from __future__ import annotations

import functools
from pathlib import Path

from anthropic import AsyncAnthropic

from app.core.config import settings

# Model defaults per BUILD.md.
MODEL_CHAT = "claude-sonnet-4-6"
MODEL_LETTER = "claude-opus-4-7"

# Load the knowledge file once at module import — it's the cache key.
_KNOWLEDGE_PATH = Path(__file__).resolve().parent.parent / "prompts" / "mason_knowledge.md"
MASON_KNOWLEDGE = _KNOWLEDGE_PATH.read_text(encoding="utf-8")


@functools.lru_cache(maxsize=1)
def get_client() -> AsyncAnthropic:
    """Lazy-instantiated async client. Cached so we don't re-init per request."""
    if not settings.anthropic_api_key:
        raise RuntimeError("ANTHROPIC_API_KEY is not configured")
    return AsyncAnthropic(api_key=settings.anthropic_api_key)


def chat_system_blocks(extra_instructions: str | None = None) -> list[dict]:
    """System prompt for the chat assistant.

    Two blocks: a small uncached preamble + the long, cached knowledge file.
    Anthropic's prompt caching matches on the *prefix*, so the cacheable
    block must come last in the system array.
    """
    preamble = (
        "You are Mason Aviles's portfolio assistant. Answer questions about "
        "his career, skills, and fit for roles. Speak in third person about "
        "Mason. Be concise: 1 to 4 short paragraphs unless the user asks for "
        "depth. Always ground answers in the knowledge file below; if a fact "
        "isn't documented there, say so honestly."
    )
    if extra_instructions:
        preamble = f"{preamble}\n\n{extra_instructions}"

    return [
        {"type": "text", "text": preamble},
        {
            "type": "text",
            "text": MASON_KNOWLEDGE,
            "cache_control": {"type": "ephemeral"},
        },
    ]


def cover_letter_system_blocks() -> list[dict]:
    """System prompt for the cover-letter generator.

    Speaks in first person as Mason. Same cached knowledge tail.
    """
    preamble = (
        "You write cover letters in Mason Aviles's voice. Output ONLY the "
        "letter body, no salutation lines like 'Dear Hiring Manager', no "
        "sign-off, no preamble or commentary. First-person singular. "
        "Direct, confident, light contractions. Cite specific roles and "
        "metrics from the knowledge file when relevant. Aim for 3 to 5 "
        "short paragraphs: punchy, not padded. Never fabricate experience "
        "that isn't documented below."
    )
    return [
        {"type": "text", "text": preamble},
        {
            "type": "text",
            "text": MASON_KNOWLEDGE,
            "cache_control": {"type": "ephemeral"},
        },
    ]
