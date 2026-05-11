import { recordKbd, recordStack, unlock } from "./store";

export type AchievementEvent =
  | { type: "app:mounted" }
  | { type: "route:mounted"; route: string }
  | { type: "inspector:opened" }
  | { type: "stack:viewed"; mode: string }
  | { type: "blog:read:complete"; slug: string }
  | { type: "kbd:shortcut"; combo: string }
  | { type: "email-demo:opened" }
  | { type: "chat:message:sent" }
  | { type: "cta:resume" }
  | { type: "cta:contact" }
  | { type: "easter:konami" }
  | { type: "easter:cmd"; cmd: string };

/**
 * Single emit() entry point. Maps every event to its store action.
 * Keep this map exhaustive — TS will complain if a new event variant is added
 * without a case here.
 */
export function emit(event: AchievementEvent): void {
  switch (event.type) {
    case "app:mounted":
      unlock("hello_world");
      return;
    case "route:mounted":
      if (event.route === "/system") unlock("architect");
      return;
    case "inspector:opened":
      unlock("curious_cat");
      return;
    case "stack:viewed":
      recordStack(event.mode);
      return;
    case "blog:read:complete":
      unlock("speed_reader");
      return;
    case "kbd:shortcut":
      recordKbd(event.combo);
      return;
    case "email-demo:opened":
      unlock("mailman");
      return;
    case "chat:message:sent":
      unlock("whisperer");
      return;
    case "cta:resume":
    case "cta:contact":
      unlock("recruiter");
      return;
    case "easter:konami":
    case "easter:cmd":
      unlock("egg_hunter");
      return;
  }
}
