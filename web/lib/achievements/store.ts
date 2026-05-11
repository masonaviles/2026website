import {
  type AchievementId,
  ACHIEVEMENT_IDS,
  REQUIRED_FOR_COMPLETIONIST,
} from "./registry";

const STORAGE_KEY = "mason-os-achievements";
const STORAGE_VERSION = 1;

export interface UnlockedAchievement {
  at: string; // ISO timestamp
}

export interface AchievementState {
  unlocked: Partial<Record<AchievementId, UnlockedAchievement>>;
  counters: {
    kbdUnique: string[];
    stacksViewed: string[];
  };
  /** Queue of toasts pending display; populated by unlock(). */
  toasts: { id: number; achievement: AchievementId }[];
}

interface PersistedShape {
  version: number;
  unlocked: AchievementState["unlocked"];
  counters: AchievementState["counters"];
}

function emptyState(): AchievementState {
  return {
    unlocked: {},
    counters: { kbdUnique: [], stacksViewed: [] },
    toasts: [],
  };
}

function loadFromStorage(): AchievementState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedShape;
    if (parsed.version !== STORAGE_VERSION) return null;
    return {
      unlocked: parsed.unlocked ?? {},
      counters: {
        kbdUnique: parsed.counters?.kbdUnique ?? [],
        stacksViewed: parsed.counters?.stacksViewed ?? [],
      },
      toasts: [],
    };
  } catch {
    return null;
  }
}

function persist(s: AchievementState) {
  if (typeof window === "undefined") return;
  try {
    const payload: PersistedShape = {
      version: STORAGE_VERSION,
      unlocked: s.unlocked,
      counters: s.counters,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage may be disabled (private mode, quota exceeded); silently skip.
  }
}

// Hydrate synchronously on client import so the first React paint sees the
// real unlocks. SSR returns a stable empty state via getServerSnapshot.
let state: AchievementState =
  typeof window === "undefined" ? emptyState() : (loadFromStorage() ?? emptyState());

const listeners = new Set<() => void>();
let nextToastId = 1;

function notify() {
  for (const l of listeners) l();
}

function maybeUnlockCompletionist(next: AchievementState): AchievementState {
  if (next.unlocked.completionist) return next;
  const allDone = REQUIRED_FOR_COMPLETIONIST.every((id) => Boolean(next.unlocked[id]));
  if (!allDone) return next;
  const at = new Date().toISOString();
  return {
    ...next,
    unlocked: { ...next.unlocked, completionist: { at } },
    toasts: [...next.toasts, { id: nextToastId++, achievement: "completionist" }],
  };
}

export function unlock(id: AchievementId): boolean {
  if (state.unlocked[id]) return false;
  const at = new Date().toISOString();
  state = maybeUnlockCompletionist({
    ...state,
    unlocked: { ...state.unlocked, [id]: { at } },
    toasts: [...state.toasts, { id: nextToastId++, achievement: id }],
  });
  persist(state);
  notify();
  return true;
}

export function recordKbd(combo: string): void {
  if (state.counters.kbdUnique.includes(combo)) return;
  const kbdUnique = [...state.counters.kbdUnique, combo];
  state = { ...state, counters: { ...state.counters, kbdUnique } };
  persist(state);
  notify();
  if (kbdUnique.length >= 5) unlock("power_user");
}

export function recordStack(mode: string): void {
  if (state.counters.stacksViewed.includes(mode)) return;
  const stacksViewed = [...state.counters.stacksViewed, mode];
  state = { ...state, counters: { ...state.counters, stacksViewed } };
  persist(state);
  notify();
  if (stacksViewed.length >= 3) unlock("polyglot");
}

export function dismissToast(toastId: number): void {
  if (!state.toasts.some((t) => t.id === toastId)) return;
  state = { ...state, toasts: state.toasts.filter((t) => t.id !== toastId) };
  notify();
}

export function reset(): void {
  state = emptyState();
  persist(state);
  notify();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const SERVER_SNAPSHOT = emptyState();
export function getServerSnapshot(): AchievementState {
  return SERVER_SNAPSHOT;
}

export function getSnapshot(): AchievementState {
  return state;
}

export function unlockedCount(s: AchievementState = state): number {
  return Object.keys(s.unlocked).filter((id) =>
    (ACHIEVEMENT_IDS as readonly string[]).includes(id),
  ).length;
}
