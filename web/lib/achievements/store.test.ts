import { afterEach, describe, expect, it, beforeEach } from "vitest";
import {
  dismissToast,
  getSnapshot,
  recordKbd,
  recordStack,
  reset,
  unlock,
} from "./store";

beforeEach(() => {
  reset();
});

afterEach(() => {
  reset();
});

describe("achievement store", () => {
  it("unlock() persists an achievement and enqueues a toast", () => {
    const ok = unlock("hello_world");
    expect(ok).toBe(true);
    const s = getSnapshot();
    expect(s.unlocked.hello_world).toBeDefined();
    expect(s.toasts).toHaveLength(1);
    expect(s.toasts[0]?.achievement).toBe("hello_world");
  });

  it("re-unlocking is a no-op (returns false, no extra toast)", () => {
    expect(unlock("hello_world")).toBe(true);
    expect(unlock("hello_world")).toBe(false);
    expect(getSnapshot().toasts).toHaveLength(1);
  });

  it("dismissToast removes a toast by id", () => {
    unlock("hello_world");
    const toastId = getSnapshot().toasts[0]!.id;
    dismissToast(toastId);
    expect(getSnapshot().toasts).toHaveLength(0);
  });

  it("recordKbd unlocks power_user at 5 unique combos", () => {
    recordKbd("meta+k");
    recordKbd("meta+k"); // dup — no-op
    recordKbd("meta+/");
    recordKbd("meta+b");
    recordKbd("meta+shift+p");
    expect(getSnapshot().unlocked.power_user).toBeUndefined();
    recordKbd("meta+j");
    expect(getSnapshot().unlocked.power_user).toBeDefined();
  });

  it("recordStack unlocks polyglot at 3 unique modes", () => {
    recordStack("react");
    recordStack("react"); // dup
    recordStack("next");
    expect(getSnapshot().unlocked.polyglot).toBeUndefined();
    recordStack("vue");
    expect(getSnapshot().unlocked.polyglot).toBeDefined();
  });

  it("unlocking everything else cascades into completionist", () => {
    const others = [
      "hello_world",
      "curious_cat",
      "polyglot",
      "speed_reader",
      "power_user",
      "architect",
      "mailman",
      "whisperer",
      "recruiter",
      "egg_hunter",
      "bug_hunter",
      "terminator",
    ] as const;
    for (const id of others) unlock(id);
    expect(getSnapshot().unlocked.completionist).toBeDefined();
  });
});
