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
const LOG_PREFIX = "[konami]";

/**
 * Listens for the Konami sequence on window. Calls `onUnlock` exactly once
 * per page load when matched, and flips the <html> class so CSS can react
 * (alt theme is session-scoped — not persisted to localStorage).
 *
 * Logs progress to the console so you can debug in DevTools.
 *
 * Returns a teardown function for the calling effect.
 */
export function attachKonami(onUnlock: () => void): () => void {
  let pos = 0;
  let fired = false;

  console.info(
    `${LOG_PREFIX} listener attached · target sequence: ↑↑↓↓←→←→ba`,
  );

  function handler(e: KeyboardEvent) {
    if (fired) return;
    // Ignore typing in inputs/textareas.
    const target = e.target as HTMLElement | null;
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) {
      console.debug(
        `${LOG_PREFIX} skip · focus in ${target.tagName.toLowerCase()}`,
      );
      return;
    }

    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const expected = SEQUENCE[pos];

    if (key === expected) {
      pos += 1;
      console.info(
        `${LOG_PREFIX} match · "${key}" · progress ${pos}/${SEQUENCE.length}`,
      );
      if (pos === SEQUENCE.length) {
        fired = true;
        pos = 0;
        document.documentElement.classList.add(ALT_THEME_CLASS);
        console.info(
          `${LOG_PREFIX} 🥚 unlocked · alt-theme-konami class applied`,
        );
        onUnlock();
      }
    } else if (key === SEQUENCE[0]) {
      pos = 1;
      console.debug(
        `${LOG_PREFIX} reset → 1 · got "${key}", restarting on ArrowUp`,
      );
    } else {
      if (pos > 0) {
        console.debug(
          `${LOG_PREFIX} reset → 0 · got "${key}", expected "${expected}"`,
        );
      }
      pos = 0;
    }
  }

  window.addEventListener("keydown", handler);
  return () => {
    console.info(`${LOG_PREFIX} listener detached`);
    window.removeEventListener("keydown", handler);
  };
}
