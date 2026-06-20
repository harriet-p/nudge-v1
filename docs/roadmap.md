# Development Roadmap

*Logical milestones for iterative expansion — not a rebuild plan.*

> **For current prioritisation**, see [`backlog.md`](./backlog.md) — the phased backlog organised around daily rhythms and emotional authenticity.

Each milestone extends existing components and configuration. Nothing here requires new screens or architectural rewrites.

For current implementation status, see [`architecture.md`](./architecture.md).

---

## Guiding principle

> Add rituals by composing existing components with different dialogue, sprites, and button configurations — not by creating unique screens.

When the Figma prototype grows, each new frame is a new ritual entry — not a redesign.

---

## Phase 1 — Core ritual polish

The foundation exists. These milestones deepen individual rituals using the current single-step flow (`inviting → celebrating → settling → idle`).

| Milestone | Status | Work involved |
|-----------|--------|---------------|
| **Startup / morning ritual** | Partial | Idle greeting works; enrich morning dialogue, consider time-of-day greeting variants |
| **Water ritual** | Partial | `drinking` sprite wired; expand dialogue, per-ritual accept label ("Let's Get Water") |
| **Rest ritual** | Partial | `resting` sprite wired; expand dialogue library |
| **Walk ritual** | Partial | Catalogue + dialogue exist; per-ritual button label ("Let's Walk") |
| **Sunshine ritual** | Partial | Catalogue + dialogue exist; per-ritual button label ("Let's Go Outside") |
| **Dinner ritual** | Partial | Catalogue + dialogue exist; per-ritual button label ("Let's Eat") |
| **Medication ritual** | Partial | Catalogue + dialogue exist; per-ritual button label ("Let's Take Our Medicine") |
| **Bedtime ritual** | Partial | `resting` sprite wired; light-switch interaction not yet implemented |

**Shared work across Phase 1:**

- [ ] Per-ritual accept/dismiss button labels on `Ritual` type (extend `catalog.ts`, update `mapSessionToScreen.ts`)
- [ ] Expand dialogue libraries with more lines per category
- [ ] Review sprite assignments — add new variants only where rituals need distinct poses

---

## Phase 2 — Richer ritual interactions

Multi-step rituals that still compose the same UI kit.

| Milestone | Status | Work involved |
|-----------|--------|---------------|
| **Bedtime light switch** | Not started | Assets exist (`light-switch-on/off.png`); add step config to bedtime ritual, new scene template using existing components |
| **Hi Baby button** | Rendered, not wired | Wire idle purple button to affection interaction (dialogue from `cuddles` or `random_affection`) |
| **Celebration variety** | Basic | Party sprite + completion line; consider ritual-specific celebration sprites or lines |
| **Settling variety** | Basic | Random settling lines; consider ritual-aware settling copy |

**Shared work across Phase 2:**

- [ ] Extend `Ritual` type with optional `steps[]` for multi-beat rituals
- [ ] Add scene templates beyond `RitualMoment` (e.g. `BedtimeScene`, `AffectionMoment`)
- [ ] Extend session machine to advance through ritual steps

---

## Phase 3 — Settings and personalisation

| Milestone | Status | Work involved |
|-----------|--------|---------------|
| **Settings panel** | Implemented | Names, interval, quiet hours, notifications toggle |
| **Settings visual polish** | Basic | Match pixel-art aesthetic; consider sprite-based controls |
| **Ritual frequency tuning** | Partial | Global interval exists; per-ritual cooldowns in catalog; no user-facing per-ritual controls yet |

---

## Phase 4 — Platform extensions

| Milestone | Status | Work involved |
|-----------|--------|---------------|
| **PWA install / offline** | Configured | Vite PWA plugin in place; test and refine manifest, icons, offline behaviour |
| **Home screen widgets** | Not started | iOS/Android widget showing Tilly idle or next ritual hint |
| **Push notifications** | Not started | Gentle nudge when app is closed; must respect quiet hours and invitation tone |
| **Sound** | Not started | Optional soft sounds for invitations and celebrations; off by default |

---

## Phase 5 — Memory and companionship

| Milestone | Status | Work involved |
|-----------|--------|---------------|
| **Memory system** | Not started | "Remember when…" moments; photos, dates, gentle nostalgia — never grief tourism |
| **Return-after-absence** | Not started | Warm welcome back without guilt for time away |
| **Shared history** | Partial | Ritual events logged in localStorage; not yet surfaced to the user |
| **Encouragement rituals** | Partial | Category exists; could trigger contextually after other rituals |

---

## Phase 6 — Animation

| Milestone | Status | Work involved |
|-----------|--------|---------------|
| **Sprite variant expansion** | Ongoing | Add PNG poses as rituals need them (preferred approach) |
| **Phase transitions** | Not started | Gentle fade or sprite swap between session phases |
| **Procedural CSS animation** | Exists, unused | `TillySprite` + `useTillyAnimation`; reconnect only if it serves a specific ritual need |

---

## What not to build

These are explicitly out of scope unless the North Star changes:

- Streak counters, badges, or completion percentages
- Task lists or habit tracking dashboards
- Multiple screens or routes per ritual
- Gamification or levelling systems
- Guilt-inducing copy for missed days
- Productivity framing ("complete your goals")

---

## Suggested order of work

For the highest impact with the least structural change:

1. **Per-ritual button labels** — small config change, big UX improvement
2. **Expand dialogue libraries** — content-only, no code changes
3. **Wire Hi Baby button** — reuses existing affection dialogue
4. **Bedtime light-switch ritual** — first multi-step ritual; validates the step model
5. **Return-after-absence greeting** — emotional impact, uses existing idle template
6. **Push notifications** — extends reminder engine to work when app is closed

Each step builds on what exists. None require replacing the current architecture.
