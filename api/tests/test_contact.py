import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text

from app.db.engine import engine
from app.main import app


@pytest.mark.asyncio
async def test_contact_submission_persists_row():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/contact",
            json={
                "name": "Test User",
                "email": "test@example.com",
                "message": "Hello from the test suite",
            },
        )

    assert response.status_code == 200, response.text
    assert response.json() == {"ok": True}

    async with engine.connect() as conn:
        result = await conn.execute(
            text("select name, email, message from contacts order by id desc limit 1")
        )
        row = result.first()
    assert row is not None
    assert row[0] == "Test User"
    assert row[1] == "test@example.com"
    assert row[2] == "Hello from the test suite"


@pytest.mark.asyncio
async def test_contact_rejects_bad_email():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/contact",
            json={"name": "x", "email": "not-an-email", "message": "y"},
        )
    assert response.status_code == 422
