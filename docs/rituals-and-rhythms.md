# Rituals and Rhythms

*The daily shared moments that structure the app experience.*

For **when and why** rituals appear through the day, see [`daily-rhythm.md`](./daily-rhythm.md) — the behavioural source of truth.  
For technical implementation, see [`architecture.md`](./architecture.md).  
For copy guidelines, see [`dialogue-style.md`](./dialogue-style.md).

---

## What is a ritual?

A ritual is a **gentle invitation** to share an ordinary moment — not a task to complete.

Each ritual reuses the same interaction template:

1. Tilly appears with a speech bubble (invitation dialogue)
2. The user accepts (green button) or postpones (red button)
3. On accept: celebration line + party sprite → settling line → return to idle
4. On dismiss: Tilly accepts quietly → return to idle

There is **one screen** (`MainScreen`). Rituals differ by **configuration**, not by layout.

---

## Ritual catalog

Defined in `src/rituals/catalog.ts`:

| Ritual ID | Daily rhythm | Sprite variant |
|-----------|-------------|----------------|
| `morning` | Starting the day together | `default` |
| `water` | Drinking water | `drinking` |
| `medicine` | Medication | `default` |
| `sunshine` | Getting outside / sunshine | `default` |
| `walks` | Walks and stretching | `default` |
| `dinner` | Meals | `default` |
| `rest` | Slowing down, pausing | `resting` |
| `bedtime` | Winding down for sleep | `resting` |
| `cuddles` | Closeness and contact | `default` |
| `random_affection` | Unprompted warmth | `default` |
| `encouragement` | Gentle nudges | `default` |

Each entry includes a `cooldownHours` value to avoid repeating the same ritual too soon.

---

## Session flow

All rituals share one session lifecycle (`src/sessions/sessionMachine.ts`):

```
idle ──→ inviting ──→ celebrating ──→ settling ──→ idle
           │              │
           └── dismiss ───┘ (returns to idle)
```

| Phase | What the user sees |
|-------|-------------------|
| `idle` | Greeting dialogue + Tilly default sprite + optional "Hi Baby" button |
| `inviting` | Ritual invitation dialogue + accept/dismiss buttons + ritual sprite |
| `celebrating` | Completion dialogue + party sprite (2.5s) |
| `settling` | Settling dialogue + resting sprite (2s) |
| `resting` | Tilly resting, no dialogue (quiet hours) |

---

## Reminder timing

The reminder engine (`src/reminders/engine.ts`) decides **when** and **which** ritual to offer:

- Respects user preferences: notifications on/off, interval, quiet hours
- Excludes rituals on cooldown and recently shown rituals
- Picks a random invitation line from the ritual's dialogue category
- Applies dismiss backoff (1.5× interval) and post-completion cooldown (30 min minimum)

Policies live in `src/reminders/policies.ts`.

---

## Figma prototype = ritual library

When the Figma prototype is updated, interpret changes as:

| Figma change | Code change |
|--------------|-------------|
| New ritual frame | Add entry to `rituals/catalog.ts` + dialogue JSON |
| Different invitation copy | Update `src/content/dialogues/{category}.json` |
| Ritual-specific accept button | Extend ritual config (planned — see roadmap) |
| New sprite pose | Add variant to `CharacterDisplay`, reference from catalog |
| Multi-step ritual (e.g. bedtime light switch) | Add steps to ritual config, reuse `RitualMoment` template |
| Layout repositioning | Update `tokens.css` once — all rituals inherit |

Do **not** create new screens, routes, or duplicate layout components for new rituals.

---

## Interaction templates

Scene templates compose the UI kit. They are not full screens.

| Template | Used in phase | Components |
|----------|--------------|------------|
| Idle greeting | `idle` | `DialogueBox` + `CharacterDisplay` + optional `PixelButton` |
| `RitualMoment` | `inviting` | `DialogueBox` + `PixelButton` stack |
| Celebration | `celebrating` | `DialogueBox` + `CharacterDisplay` (party) |
| Settling | `settling` | `DialogueBox` + `CharacterDisplay` (resting) |
| Quiet hours | `resting` | `CharacterDisplay` (resting) only |

Future rituals with extra steps (e.g. bedtime light-switch interaction) should add new templates that still compose the same kit components.

---

## Startup ritual

The morning/start-of-day experience combines:

- **Idle greeting** — `"Hi {name}!"` when the app opens outside quiet hours
- **Morning ritual** — `morning` category invitations offered by the reminder engine

These share the idle template today. A richer startup sequence (e.g. light gradually brightening) would extend ritual configuration, not add a new screen.

---

## Affection rituals

`cuddles`, `random_affection`, and `encouragement` are warmth rituals — not tied to a daily schedule item. They appear between care rituals to reinforce companionship without productivity framing.

The purple "Hi Baby" button (idle state) is intended for connection moments. It is rendered but not yet wired to an interaction — see [`roadmap.md`](./roadmap.md).
