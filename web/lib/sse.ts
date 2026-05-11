import { API_BASE } from "./api";

export interface SseDelta {
  type: "delta";
  text: string;
}
export interface SseDone {
  type: "done";
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens: number;
    cache_read_input_tokens: number;
  };
}
export interface SseError {
  type: "error";
  detail: string;
}
export type SseEvent = SseDelta | SseDone | SseError;

/**
 * Stream POST a JSON body and yield each `data: ` SSE event as a parsed
 * object. Caller cancels mid-stream via the AbortSignal in `init`.
 */
export async function* streamSse<TBody>(
  path: string,
  body: TBody,
  init?: { signal?: AbortSignal },
): AsyncGenerator<SseEvent> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify(body),
    signal: init?.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    yield {
      type: "error",
      detail: text || `Request failed (${res.status})`,
    };
    return;
  }

  if (!res.body) {
    yield { type: "error", detail: "No response body" };
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE events separated by double-newlines; each may have multiple lines.
      let sep = buffer.indexOf("\n\n");
      while (sep !== -1) {
        const block = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        for (const line of block.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6);
          try {
            yield JSON.parse(raw) as SseEvent;
          } catch {
            // Skip malformed event quietly — the stream is best-effort.
          }
        }
        sep = buffer.indexOf("\n\n");
      }
    }
  } finally {
    reader.releaseLock();
  }
}
