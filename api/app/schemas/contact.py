from pydantic import BaseModel, EmailStr, Field


class ContactIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(..., min_length=1, max_length=5000)
    turnstile_token: str | None = Field(default=None, max_length=4000)


class ContactOut(BaseModel):
    ok: bool = True
