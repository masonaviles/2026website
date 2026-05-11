"""Standalone Anthropic prompt-caching diagnostic.

Run from api/:
    ANTHROPIC_API_KEY=sk-ant-... uv run python scripts/cache_diag.py

Hits the API twice with an identical, intentionally-long system prefix
and prints the full usage object both times. If caching works:
  call 1 -> ephemeral_5m_input_tokens > 0, cache_read_input_tokens = 0
  call 2 -> cache_read_input_tokens > 0  (and total input_tokens drops)

If both are zero, the issue is environmental (account tier, model
availability, or beta header), not my routing code.
"""

from __future__ import annotations

import asyncio
import json
import os
import sys
from pathlib import Path

from anthropic import AsyncAnthropic


async def main() -> int:
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        print("ANTHROPIC_API_KEY not set in environment", file=sys.stderr)
        return 1

    # Load the actual MASON_KNOWLEDGE so we test with the real prefix.
    here = Path(__file__).resolve().parent.parent
    knowledge = (here / "app" / "prompts" / "mason_knowledge.md").read_text(
        encoding="utf-8"
    )
    print(f"knowledge chars: {len(knowledge)}  (~{len(knowledge) // 4} tokens)\n")

    client = AsyncAnthropic(api_key=key)
    system = [
        {"type": "text", "text": "You are a portfolio assistant. Be brief."},
        {
            "type": "text",
            "text": knowledge,
            "cache_control": {"type": "ephemeral"},
        },
    ]

    for i in (1, 2):
        print(f"== call {i} ==")
        resp = await client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=80,
            system=system,
            messages=[{"role": "user", "content": f"Say hello in 5 words. (call {i})"}],
        )
        usage = resp.usage.model_dump()
        print(json.dumps(usage, indent=2))
        print()
        if i == 1:
            await asyncio.sleep(2)

    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
