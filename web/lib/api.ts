export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

export async function submitContact(input: {
  name: string;
  email: string;
  message: string;
  turnstileToken?: string | null;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        message: input.message,
        turnstile_token: input.turnstileToken ?? null,
      }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as {
        detail?: string;
      };
      return {
        ok: false,
        error: body.detail ?? `Request failed (${res.status})`,
      };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}
