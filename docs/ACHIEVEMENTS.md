# mason.os — Achievements spec

Companion to [`BUILD.md`](BUILD.md). The canonical list of achievements, their triggers, and the event names that emit them.

## Design rules

- Each achievement has a stable `id` (snake_case) — never rename, never reuse.
- Toasts cap at 3 concurrent on screen; older slide out.
- All unlocks persist to `localStorage` (`mason-os-achievements`). Optional opt-in sync to FastAPI (SQLite-backed) when the user supplies an email.
- Re-unlocking a previously unlocked achievement is a no-op (no second toast).
- Achievements are device-local first. We don't track users without explicit consent.

## The set (v1: 11 achievements)

| id | label | trigger event | description |
|---|---|---|---|
| `hello_world` | Hello, world | `app:mounted` (first visit) | First visit to the site. Auto-fires after ~0.8s. |
| `curious_cat` | Curious cat | `inspector:opened` | Toggled the Inspector overlay. |
| `polyglot` | Polyglot | `stack:viewed:N` (3 unique) | Viewed React / Next.js / Vue modes of the stack-switcher. |
| `speed_reader` | Speed reader | `blog:read:complete` | Read a blog post end-to-end (scroll ≥ 90% AND time ≥ 70% of read time). |
| `power_user` | Power user | `kbd:shortcut:N` (5 unique) | Used 5+ unique keyboard shortcuts. |
| `architect` | Architect | `route:mounted:system` | Opened `~/system`. |
| `mailman` | Mailman | `email-demo:opened` | Opened the email inbox demo. |
| `whisperer` | Whisperer | `chat:message:sent` | Sent a message in the Ask Mason chat. |
| `recruiter` | Recruiter | `cta:resume` OR `cta:contact` | Clicked Download Résumé or Contact. |
| `egg_hunter` | Egg hunter | `easter:konami` OR `easter:cmd` | Activated Konami code or typed a hidden command. |
| `completionist` | Completionist | computed | All of the above unlocked. |

## Optional Bug Hunt additions (v1.1)

| id | label | trigger event | description |
|---|---|---|---|
| `bug_hunter` | Bug hunter | `game:bug-hunt:solved:any` | Solved your first Bug Hunt puzzle. |
| `terminator` | Terminator | `game:bug-hunt:solved:all` | Solved every Bug Hunt puzzle. |

If shipped, bump `completionist` to require these too and update the status-bar count from 11 → 13.

## Event bus shape

```ts
// web/lib/achievements/events.ts
type Event =
  | { type: 'app:mounted' }
  | { type: 'route:mounted'; route: string }
  | { type: 'inspector:opened' }
  | { type: 'stack:viewed'; mode: 'react' | 'next' | 'vue' }
  | { type: 'blog:read:complete'; slug: string }
  | { type: 'kbd:shortcut'; key: string }
  | { type: 'email-demo:opened' }
  | { type: 'chat:message:sent' }
  | { type: 'cta:resume' }
  | { type: 'cta:contact' }
  | { type: 'easter:konami' }
  | { type: 'easter:cmd'; cmd: string }
  | { type: 'game:bug-hunt:solved'; puzzleId: string };

function emit(e: Event): void;
function on(handler: (e: Event) => void): () => void;
```

## Storage shape

```ts
// localStorage['mason-os-achievements']
{
  version: 1,
  unlocked: {
    hello_world: { at: '2026-05-10T13:42:00.000Z' },
    architect:   { at: '2026-05-10T13:44:12.000Z' }
  },
  counters: {
    kbd_unique: ['k', '/', 'g', 'b'],
    stacks_viewed: ['react', 'next']
  }
}
```

## Toast UX

- Slide in from right, bottom-right corner, with a 0.6–1.0s delay after the trigger.
- Soft bounce on entry; honors `prefers-reduced-motion` (opacity-only).
- Auto-dismiss after 5s, hoverable to pause.
- Click → opens `/profile` and scrolls to the AchievementsPanel.
- Stack vertically; cap 3; older fade.

## Tests

- Unit: store mutations are pure; double-unlock is idempotent.
- Integration: each trigger emits its event; each event mutates the store correctly.
- E2E (Playwright): a single test that walks the golden completion path and asserts the `completionist` achievement.
