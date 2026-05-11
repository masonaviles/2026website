"use client";

import { useEffect, useRef } from "react";
import { emit } from "@/lib/achievements/events";

/**
 * Wraps a blog post and emits the `speed_reader` achievement event when:
 *   - the reader has scrolled past 90% of the article, AND
 *   - they've spent at least 70% of the estimated reading time on page.
 */
export function Reader({
  slug,
  readingMinutes,
  children,
}: {
  slug: string;
  readingMinutes: number;
  children: React.ReactNode;
}) {
  const articleRef = useRef<HTMLElement>(null);
  const startRef = useRef<number>(0);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;

    const minMs = readingMinutes * 60 * 1000 * 0.7;
    startRef.current = Date.now();

    function check() {
      if (firedRef.current) return;
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const scrolledPast = -rect.top + viewportH;
      const totalH = rect.height;
      const pct = Math.min(100, Math.max(0, (scrolledPast / totalH) * 100));
      const dwellMs = Date.now() - startRef.current;
      if (pct > 90 && dwellMs > minMs) {
        firedRef.current = true;
        emit({ type: "blog:read:complete", slug });
      }
    }

    const onScroll = () => check();
    window.addEventListener("scroll", onScroll, { passive: true });
    const interval = window.setInterval(check, 2000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(interval);
    };
  }, [slug, readingMinutes]);

  return <article ref={articleRef}>{children}</article>;
}
