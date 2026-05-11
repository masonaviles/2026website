const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const ALT_THEME_CLASS = "alt-theme-konami";

/**
 * Listens for the Konami sequence on window. Calls `onUnlock` exactly once
 * per page load when matched, and flips the <html> class so CSS can react
 * (alt theme is session-scoped — not persisted to localStorage).
 *
 * Returns a teardown function for the calling effect.
 */
export function attachKonami(onUnlock: () => void): () => void {
  let pos = 0;
  let fired = false;

  function handler(e: KeyboardEvent) {
    if (fired) return;
    // Ignore typing in inputs/textareas.
    const target = e.target as HTMLElement | null;
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === SEQUENCE[pos]) {
      pos += 1;
      if (pos === SEQUENCE.length) {
        fired = true;
        pos = 0;
        document.documentElement.classList.add(ALT_THEME_CLASS);
        onUnlock();
      }
    } else if (key === SEQUENCE[0]) {
      pos = 1;
    } else {
      pos = 0;
    }
  }

  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}
