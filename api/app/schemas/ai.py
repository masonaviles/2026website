from typing import Literal

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1, max_length=4000)


class ChatIn(BaseModel):
    messages: list[ChatMessage] = Field(..., min_length=1, max_length=20)


class CoverLetterIn(BaseModel):
    job_description: str = Field(..., min_length=20, max_length=12000)
    company_name: str | None = Field(default=None, max_length=120)
    role_title: str | None = Field(default=None, max_length=160)
