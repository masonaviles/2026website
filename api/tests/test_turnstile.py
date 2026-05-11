"""Turnstile gating tests.

We don't actually call Cloudflare in tests. The verifier has three
branches and we exercise each:

1. No `TURNSTILE_SECRET` set -> dev bypass (returns True).
2. Secret set, token missing -> 403 returned.
3. Secret set, token present -> verifier is called (we monkeypatch it).
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from types import SimpleNamespace
from typing import Any

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.services import anthropic_client, turnstile


class _FakeStream:
    def __init__(self, chunks: list[str]):
        self._chunks = chunks

    @property
    def text_stream(self):
        chunks = self._chunks

        async def _gen():
            for c in chunks:
                yield c

        return _gen()

    async def get_final_message(self):
        usage = SimpleNamespace(
            input_tokens=10,
            output_tokens=5,
            cache_creation_input_tokens=0,
            cache_read_input_tokens=0,
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
def fake_anthropic(monkeypatch: pytest.MonkeyPatch):
    chunks = ["ok"]
    monkeypatch.setattr(anthropic_client, "get_client", lambda: _FakeClient(chunks))
    monkeypatch.setattr("app.routers.ai_chat.get_client", lambda: _FakeClient(chunks))
    from app.core.config import settings

    monkeypatch.setattr(settings, "anthropic_api_key", "test-key")
    return chunks


@pytest.mark.asyncio
async def test_chat_bypasses_when_secret_unset(fake_anthropic):
    from app.core.config import settings

    assert settings.turnstile_secret in (None, "")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/ai/chat",
            json={"messages": [{"role": "user", "content": "hi"}]},
        )
    assert response.status_code == 200, response.text


@pytest.mark.asyncio
async def test_chat_requires_token_when_secret_set(
    fake_anthropic, monkeypatch: pytest.MonkeyPatch
):
    from app.core.config import settings

    monkeypatch.setattr(settings, "turnstile_secret", "ts-test-secret")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/ai/chat",
            json={"messages": [{"role": "user", "content": "hi"}]},
        )
    assert response.status_code == 403
    assert "verification" in response.json()["detail"]


@pytest.mark.asyncio
async def test_chat_passes_with_valid_token(
    fake_anthropic, monkeypatch: pytest.MonkeyPatch
):
    from app.core.config import settings

    monkeypatch.setattr(settings, "turnstile_secret", "ts-test-secret")

    async def fake_verify(token, ip=None):
        assert token == "test-turnstile-token"
        return True, "ok"

    monkeypatch.setattr(turnstile, "verify_turnstile", fake_verify)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/ai/chat",
            json={
                "messages": [{"role": "user", "content": "hi"}],
                "turnstile_token": "test-turnstile-token",
            },
        )
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_contact_requires_token_when_secret_set(monkeypatch: pytest.MonkeyPatch):
    from app.core.config import settings

    monkeypatch.setattr(settings, "turnstile_secret", "ts-test-secret")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/contact",
            json={"name": "x", "email": "x@example.com", "message": "y"},
        )
    assert response.status_code == 403
