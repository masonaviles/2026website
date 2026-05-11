"use client";

import {
  Turnstile,
  type TurnstileInstance,
} from "@marsidev/react-turnstile";
import { forwardRef, useImperativeHandle, useRef } from "react";

export interface TurnstileGateHandle {
  /** Force the widget to issue a fresh token (after consuming the previous one). */
  reset: () => void;
}

export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export const turnstileEnabled = (): boolean => Boolean(TURNSTILE_SITE_KEY);

/**
 * Renders the Cloudflare Turnstile widget when a site key is configured.
 * In dev (no NEXT_PUBLIC_TURNSTILE_SITE_KEY) renders nothing — the backend
 * mirrors this with a dev-mode bypass when TURNSTILE_SECRET is unset.
 */
export const TurnstileGate = forwardRef<
  TurnstileGateHandle,
  { onToken: (token: string | null) => void; className?: string }
>(function TurnstileGate({ onToken, className }, ref) {
  const widgetRef = useRef<TurnstileInstance | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        widgetRef.current?.reset();
        // Reset clears the existing token until Cloudflare issues a new one.
        onToken(null);
      },
    }),
    [onToken],
  );

  if (!TURNSTILE_SITE_KEY) return null;

  return (
    <div className={className}>
      <Turnstile
        ref={widgetRef}
        siteKey={TURNSTILE_SITE_KEY}
        options={{
          theme: "auto",
          appearance: "interaction-only",
          size: "flexible",
        }}
        onSuccess={onToken}
        onError={() => onToken(null)}
        onExpire={() => onToken(null)}
      />
    </div>
  );
});
