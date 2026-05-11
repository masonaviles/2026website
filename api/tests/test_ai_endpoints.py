"""AI endpoint tests with a mocked Anthropic client.

We monkeypatch `get_client` to avoid network calls and make the test
independent of ANTHROPIC_API_KEY being set.
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from types import SimpleNamespace
from typing import Any

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.services import anthropic_client


class _FakeStream:
    """Mimics the async-iterator interface of anthropic's MessageStreamManager."""

    def __init__(self, chunks: list[str]):
        self._chunks = chunks

    @property
    def text_stream(self):
        chunks = self._chunks

        async def _gen():
            for c in chunks:
                yield c

        return _gen()

    async def get_final_message(self) -> Any:
        usage = SimpleNamespace(
            input_tokens=10,
            output_tokens=5,
            cache_creation_input_tokens=0,
            cache_read_input_tokens=42,
        )
        return SimpleNamespace(usage=usage)


class _FakeMessages:
    def __init__(self, chunks: list[str]):
        self._chunks = chunks

    def stream(self, **_kwargs: Any):
        chunks = self._chunks

        @asynccontextmanager
        async def _ctx():
            yield _FakeStream(chunks)

        return _ctx()


class _FakeClient:
    def __init__(self, chunks: list[str]):
        self.messages = _FakeMessages(chunks)


@pytest.fixture
def mock_anthropic(monkeypatch: pytest.MonkeyPatch):
    chunks = ["Mason has ", "shipped at Apple ", "and Smartsheet."]
    monkeypatch.setattr(anthropic_client, "get_client", lambda: _FakeClient(chunks))
    monkeypatch.setattr(
        "app.routers.ai_chat.get_client", lambda: _FakeClient(chunks)
    )
    monkeypatch.setattr(
        "app.routers.cover_letter.get_client", lambda: _FakeClient(chunks)
    )
    # Make the endpoint config check pass.
    from app.core.config import settings

    monkeypatch.setattr(settings, "anthropic_api_key", "test-key")
    return chunks


@pytest.mark.asyncio
async def test_chat_streams_sse(mock_anthropic):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/ai/chat",
            json={"messages": [{"role": "user", "content": "tell me about Mason"}]},
        )
    assert response.status_code == 200
    body = response.text
    assert "data: " in body
    assert "Mason has " in body
    assert "shipped at Apple " in body
    assert '"type": "done"' in body
    assert '"cache_read_input_tokens": 42' in body


@pytest.mark.asyncio
async def test_cover_letter_streams_sse(mock_anthropic):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/ai/cover-letter",
            json={
                "job_description": (
                    "Senior Frontend Engineer focused on design systems and "
                    "accessibility. React + TypeScript stack."
                ),
                "company_name": "Acme",
                "role_title": "Senior FE Engineer",
            },
        )
    assert response.status_code == 200
    body = response.text
    assert "data: " in body
    assert '"type": "delta"' in body
    assert '"type": "done"' in body


@pytest.mark.asyncio
async def test_chat_503_without_key(monkeypatch: pytest.MonkeyPatch):
    from app.core.config import settings

    monkeypatch.setattr(settings, "anthropic_api_key", None)
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/ai/chat",
            json={"messages": [{"role": "user", "content": "hi"}]},
        )
    assert response.status_code == 503


@pytest.mark.asyncio
async def test_chat_validates_payload(mock_anthropic):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/ai/chat", json={"messages": []})
    assert response.status_code == 422
