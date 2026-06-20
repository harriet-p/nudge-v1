# Tilly Development Backlog

*Gradually recreate the shared daily rhythms that shaped life with Tilly.*

This backlog is not a feature list. Each completed phase should make the application feel more alive, more companionable, and more emotionally authentic.

**Guiding question for every milestone:**

> Does this feel like spending another ordinary day with Tilly?

**Implementation rule:** Missing artwork or animation must never block progress. Use placeholder sprites, reuse idle poses, and stub animation states for later replacement.

For technical structure, see [`architecture.md`](./architecture.md). For voice and copy, see [`dialogue-style.md`](./dialogue-style.md).

---

## Current baseline

The architecture is established: single-screen PWA, session machine (`idle → inviting → celebrating → settling → idle`), reminder engine, UI kit, and 11 rituals in the catalog. Four PNG sprite variants are wired (`default`, `drinking`, `party`, `resting`). Hi Baby affection is wired. Bedtime light-switch assets exist but are unwired. Ritual selection is random with no time-of-day weighting. Idle behaviour is static — `useTillyAnimation` and `TillySprite` exist but are not connected to the live app.

---

## Phase 1 — Core Presence

*Tilly feels present even when nothing is happening.*

| Item | Status |
|------|--------|
| Startup greeting | Partial |
| Idle behaviour system | Not started |
| Time-of-day weighting | Not started |
| Dialogue variation | Partial |
| Sprite placeholder system | Not started |
| Morning greeting variants | Not started |

### Startup greeting

| | |
|---|---|
| **Purpose** | The first thing seen when opening the app should feel like Tilly noticing you — not loading a screen. |
| **Reuse** | `interactions/templates.ts` (`formatIdleGreeting`), `mapSessionToScreen.ts` (idle phase), `DialogueBox`, `CharacterDisplay` |
| **Assets** | None required |
| **Placeholder** | Keep `tilly-default.png`; vary copy only |
| **Complexity** | S |
| **Dependencies** | None |

**Work:** Expand beyond fixed `"Hi \n{name}!"` — see morning greeting variants. Consider first-open-of-day tone (warmer, slower) once last-visit tracking exists (Phase 5).

### Idle behaviour system

| | |
|---|---|
| **Purpose** | When nothing is happening, Tilly should feel alive — small movements, stillness, occasional ear twitches — not a frozen screenshot. |
| **Reuse** | `useTillyAnimation.ts`, `animations/stateMachine.ts`, `CharacterDisplay.tsx`; optionally extend with PNG crossfade between poses |
| **Assets** | Optional per-state PNGs (`tilly-sitting`, `tilly-tailwag`, etc.) |
| **Placeholder** | **v1:** Cycle `default` sprite with subtle CSS transforms (breathing scale, occasional opacity pulse). **v2:** Wire `useTillyAnimation` to swap between `default` and `resting` PNGs on a timer. **v3:** Drop in dedicated pose PNGs as art arrives. Do not wire procedural `TillySprite` CSS dog unless explicitly requested. |
| **Complexity** | M–L |
| **Dependencies** | Sprite placeholder system (for clean variant registration) |

**Work:** New `useIdleBehaviour` hook called from `MainScreen` during `idle` and `resting` phases only. Pause idle animation during `inviting`, `celebrating`, `settling`. Respect quiet hours — prefer stillness/sleeping states.

### Time-of-day weighting

| | |
|---|---|
| **Purpose** | Rituals should appear when they belong in an ordinary day — morning in the morning, bedtime at night — not at random. |
| **Reuse** | `reminders/engine.ts` (`pickRitual`), `rituals/catalog.ts`, `policies.ts` |
| **Assets** | None |
| **Placeholder** | N/A |
| **Complexity** | M |
| **Dependencies** | None |

**Work:** Add optional `timeWindows` to ritual config. Weight selection by current hour. Care rituals dominate; warmth rituals fill gaps.

Suggested windows:

| Ritual | Window |
|--------|--------|
| `morning` | 05:00–11:00 |
| `water` | Waking hours (higher weight midday) |
| `medicine` | Morning + evening anchors |
| `sunshine`, `walks` | 09:00–17:00 |
| `dinner` | 17:00–21:00 |
| `rest` | 14:00–20:00 |
| `bedtime` | 20:00–quiet hours |

### Dialogue variation

| | |
|---|---|
| **Purpose** | Tilly should not repeat the same line every day. Variety creates the sense of a living companion, not a notification app. |
| **Reuse** | `src/content/dialogues/*.json`, `loader.ts` (`pickInvitation`, `pickCompletion`, `pickSettlingLine`) |
| **Assets** | None |
| **Placeholder** | N/A — content-only work |
| **Complexity** | S per category |
| **Dependencies** | None |

**Work:** Expand all existing dialogue files to 15–20 lines each. Add category-specific settling lines beyond `rest`/`bedtime` (currently only those have `settling-rest.json`).

### Sprite placeholder system

| | |
|---|---|
| **Purpose** | Register ritual-specific sprite IDs now so art can drop in later without type changes or refactors. |
| **Reuse** | `CharacterDisplay.tsx`, `rituals/types.ts` (`RitualSprite`), `spriteSizes.ts`, `catalog.ts` |
| **Assets** | Future PNGs per ritual |
| **Placeholder** | Extend `SPRITE_SRC` with fallback map — unknown variants resolve to nearest existing pose (`morning → default`, `walking → default`, `dreaming → resting`, etc.) |
| **Complexity** | M |
| **Dependencies** | None |

### Morning greeting variants

| | |
|---|---|
| **Purpose** | Starting the day should feel different from a mid-afternoon hello. |
| **Reuse** | `formatIdleGreeting`, new `greetings.json` or morning dialogue subset, `loader.ts` |
| **Assets** | None |
| **Placeholder** | Reuse `default` sprite; text-only differentiation |
| **Complexity** | S |
| **Dependencies** | Time-of-day weighting (optional — can use clock hour alone) |

**Example lines:** "I heard birds outside.", "I stretched. You could too." (already in `morning.json` — repurpose for idle greeting pool).

---

## Phase 2 — Core Rituals

*The app can guide an ordinary day through shared rituals.*

These are the non-negotiable daily rhythms. Each maps to an existing or new catalog entry using the single-step flow (`RitualMoment` template) unless noted.

| Item | Catalog ID | Status |
|------|------------|--------|
| Drink water | `water` | Partial — distinct sprite, needs copy polish |
| Take medication | `medicine` | Partial — catalogue + dialogue exist |
| Go outside | `sunshine` | Partial — catalogue + dialogue exist |
| Walk around the block | `walks` | Partial — catalogue + dialogue exist |
| Dinner | `dinner` | Partial — catalogue + dialogue exist |
| Evening wind down | `rest` | Partial — `resting` sprite wired |
| Bedtime | `bedtime` | Partial — needs multi-step light-switch |

### Drink water

| | |
|---|---|
| **Purpose** | The simplest shared care act — hydration together. |
| **Reuse** | `water.json`, `tilly-drinking.png`, `catalog.ts`, `completion.json` (water section) |
| **Assets** | `tilly-drinking.png` ✅ |
| **Placeholder** | N/A — most complete ritual visually |
| **Complexity** | S |
| **Dependencies** | Phase 1 dialogue variation, settling lines |

**Work:** Align button copy with invitation tone. Expand completion/settling lines.

### Take medication

| | |
|---|---|
| **Purpose** | Gentle, ordinary self-care — taking medicine together, not clinical reminders. |
| **Reuse** | `medicine.json`, `catalog.ts`, `RitualMoment` |
| **Assets** | Optional `tilly-medicine.png` |
| **Placeholder** | `default` sprite via placeholder system |
| **Complexity** | S |
| **Dependencies** | Phase 1 time-of-day weighting (morning/evening) |

### Go outside

| | |
|---|---|
| **Purpose** | Sunshine, fresh air, leaving the house — the door invitation. |
| **Reuse** | `sunshine` ritual (`sunshine.json`), `catalog.ts` |
| **Assets** | Optional `tilly-sunshine.png` (at door/window) |
| **Placeholder** | `default` sprite |
| **Complexity** | S |
| **Dependencies** | Phase 1 time-of-day weighting |

### Walk around the block

| | |
|---|---|
| **Purpose** | Short movement together — around the block, not a fitness goal. |
| **Reuse** | `walks` ritual (`walks.json`), `catalog.ts` |
| **Assets** | Optional `tilly-walking.png` |
| **Placeholder** | `default` sprite; stub `'walking' → default'` |
| **Complexity** | S |
| **Dependencies** | Phase 1 time-of-day weighting |

### Dinner

| | |
|---|---|
| **Purpose** | Eating properly together — the ordinary evening meal. |
| **Reuse** | `dinner.json`, `catalog.ts`, `completion.json` |
| **Assets** | Optional `tilly-dinner.png` |
| **Placeholder** | `default` sprite |
| **Complexity** | S |
| **Dependencies** | Phase 1 time-of-day weighting (evening) |

### Evening wind down

| | |
|---|---|
| **Purpose** | Slowing down before bed — distinct from bedtime itself. A pause, not sleep. |
| **Reuse** | `rest` ritual (`rest.json`), `tilly-resting.png`, `settling-rest.json` |
| **Assets** | `tilly-resting.png` ✅ |
| **Placeholder** | N/A |
| **Complexity** | S |
| **Dependencies** | Phase 1 dialogue variation |

### Bedtime

| | |
|---|---|
| **Purpose** | The signature wind-down — invitation, lights out, goodnight. The richest core ritual. |
| **Reuse** | `bedtime.json`, `tilly-resting.png`, `light-switch-on/off.png`, session step model |
| **Assets** | Light switch PNGs ✅; optional screen-dim overlay |
| **Placeholder** | **v1:** Single-step bedtime with resting sprite (current). **v2:** Multi-step with light switch. **v3:** Screen dimming transition. CSS toggle rectangle if switch art unavailable. |
| **Complexity** | L (multi-step) |
| **Dependencies** | Phase 4 lights-out transition; requires `steps[]` on `Ritual` type (see [`architecture.md`](./architecture.md#extending-the-system)) |

**Structural work (enables bedtime and Phase 4 items):**

1. Extend `Ritual` with optional `steps[]` (`InteractionBeat[]`)
2. Track `currentStepIndex` in session state
3. Add `advance` handler in `useRitualSession`
4. New scene template composing `DialogueBox` + tappable light switch + `CharacterDisplay`

---

## Phase 3 — Richer Daily Life

*The app feels less scripted and more like sharing life together.*

These rituals add texture — the small joys and curiosities that made days with Tilly feel shared rather than scheduled.

| Item | Maps to | Status |
|------|---------|--------|
| Sunshine | `sunshine` | See Phase 2 — enrich with seasonal copy in Phase 5 |
| Stretch | `walks` (stretch variant) or new `stretch` | Partial — stretch copy exists in `walks.json` |
| Cuddles | `cuddles` | Partial — catalogue + dialogue; needs button labels |
| Bird watching | **New** `bird_watching` | Not started |
| Sniff adventure | **New** `sniff_adventure` | Not started |
| Random affection | `random_affection` | Partial — catalogue + dialogue exist |
| Weekend outing | **New** `weekend_outing` | Not started |
| River trip | **New** `river_trip` | Not started |
| Hill walk | **New** `hill_walk` | Not started |

*Adding a new ritual:* dialogue JSON → `loader.ts` → `catalog.ts` → optional sprite stub. No new screens. See [`architecture.md`](./architecture.md#extending-the-system).

### Sunshine (enrichment)

| | |
|---|---|
| **Purpose** | Beyond "go outside" — noticing warmth, light, the particular quality of a day. |
| **Reuse** | Existing `sunshine` ritual; expand `sunshine.json` |
| **Assets** | Optional `tilly-sunshine.png` |
| **Placeholder** | `default` sprite |
| **Complexity** | S |
| **Dependencies** | Phase 2 go outside complete |

### Stretch

| | |
|---|---|
| **Purpose** | Gentle movement without leaving home — the morning stretch, the desk break. |
| **Reuse** | Split from `walks` or add `stretch` category; reuse `walks.json` stretch lines |
| **Assets** | Optional `tilly-stretching.png` |
| **Placeholder** | `default` sprite; morning.json already has "I stretched. You could too." |
| **Complexity** | S |
| **Dependencies** | Phase 1 sprite placeholder system |

### Cuddles

| | |
|---|---|
| **Purpose** | Closeness for its own sake — not a task, not a reward. |
| **Reuse** | `cuddles.json`, `catalog.ts`, Hi Baby flow (`STARTUP_AFFECTION_BEAT`) |
| **Assets** | Optional `tilly-cuddling.png` |
| **Placeholder** | `default` sprite; per-ritual accept label ("Come here") |
| **Complexity** | S |
| **Dependencies** | Phase 1 time-of-day weighting (low priority vs care rituals) |

### Bird watching

| | |
|---|---|
| **Purpose** | One of Tilly's small joys — stopping to watch birds together. |
| **Reuse** | New `bird_watching` catalog entry, new `bird-watching.json` dialogue |
| **Assets** | Optional `tilly-birdwatching.png` (alert, looking up) |
| **Placeholder** | `default` sprite; borrow morning.json bird line ("I heard birds outside.") for early copy |
| **Complexity** | S |
| **Dependencies** | Phase 1 sprite placeholder system |

### Sniff adventure

| | |
|---|---|
| **Purpose** | Following curiosity — sniffing around, exploring smells on a walk. |
| **Reuse** | New `sniff_adventure` catalog entry, new dialogue file |
| **Assets** | Optional `tilly-sniffing.png` (nose down) |
| **Placeholder** | `default` sprite |
| **Complexity** | S |
| **Dependencies** | Phase 2 walk ritual; Phase 1 sprite placeholder system |

### Random affection

| | |
|---|---|
| **Purpose** | Unprompted warmth — "I was thinking of you" between care moments. |
| **Reuse** | `random-affection.json`, `catalog.ts`, reminder engine |
| **Assets** | None beyond `default` |
| **Placeholder** | N/A |
| **Complexity** | S |
| **Dependencies** | Phase 1 time-of-day weighting (low weight) |

### Weekend outing

| | |
|---|---|
| **Purpose** | A longer shared outing — the Saturday amble, not a daily rhythm. |
| **Reuse** | New `weekend_outing` catalog entry; `cooldownHours: 48+`; day-of-week check in `engine.ts` |
| **Assets** | Optional `tilly-outing.png` |
| **Placeholder** | `default` sprite; reuse `walks` completion lines initially |
| **Complexity** | M (needs weekend detection in engine) |
| **Dependencies** | Phase 2 walk ritual; Phase 1 time-of-day weighting |

### River trip

| | |
|---|---|
| **Purpose** | A cherished occasional adventure — the river, the water, the particular joy. |
| **Reuse** | New `river_trip` catalog entry; long cooldown (72h+); rarity weighting |
| **Assets** | Optional `tilly-river.png` |
| **Placeholder** | `default` or `drinking` sprite (water association) |
| **Complexity** | S (content) / M (rarity scheduling) |
| **Dependencies** | Phase 1 sprite placeholder system |

### Hill walk

| | |
|---|---|
| **Purpose** | A longer walk with a view — more effort, more reward, still ordinary. |
| **Reuse** | New `hill_walk` catalog entry; extends `walks` family |
| **Assets** | Optional `tilly-hillwalk.png` |
| **Placeholder** | `default` sprite; reuse `walks` completion lines |
| **Complexity** | S |
| **Dependencies** | Phase 2 walk ritual |

---

## Phase 4 — Quiet Moments

*The app feels alive even when resting.*

These are the in-between states — sleeping, dreaming, companionable silence, and the small bedtime rituals that happened every night.

| Item | Status |
|------|--------|
| Dreaming animations | Not started |
| Snoring animations | Not started |
| Restless sleep | Not started |
| TV companion mode | Not started |
| Bedtime toilet trip | Not started |
| Bedtime treat | Not started |
| Lights out transition | Not started (assets exist) |

### Dreaming animations

| | |
|---|---|
| **Purpose** | During quiet hours or rest phases, Tilly should seem to dream — small movements, peaceful unsettledness. |
| **Reuse** | Idle behaviour system (Phase 1), `resting` sprite, `animations/stateMachine.ts` |
| **Assets** | Optional `tilly-dreaming.png` sequence |
| **Placeholder** | Subtle CSS animation on `resting` sprite (slow vertical drift, opacity pulse). Stub `'dreaming' → resting'` in placeholder system. |
| **Complexity** | M |
| **Dependencies** | Phase 1 idle behaviour system |

### Snoring animations

| | |
|---|---|
| **Purpose** | The gentle comedy of a sleeping dog — warmth through imperfection. |
| **Reuse** | Idle behaviour system; quiet hours / `resting` phase |
| **Assets** | Optional `tilly-snoring.png` or tiny Zzz overlay sprite |
| **Placeholder** | CSS scale pulse on `resting` sprite; optional text "Zzz" in visually-hidden aria only (not on-screen — keep visual clean) |
| **Complexity** | S–M |
| **Dependencies** | Dreaming animations |

### Restless sleep

| | |
|---|---|
| **Purpose** | Not every rest is peaceful — sometimes Tilly shifts, sighs, resetstles. |
| **Reuse** | Idle behaviour system; extend `AnimationState` with `'restless'` stub |
| **Assets** | Optional `tilly-restless.png` |
| **Placeholder** | Alternate between `resting` and `default` sprites on a slow timer |
| **Complexity** | M |
| **Dependencies** | Phase 1 idle behaviour system |

### TV companion mode

| | |
|---|---|
| **Purpose** | Tilly sitting nearby while you watch TV — presence without interaction. |
| **Reuse** | New interaction template or idle sub-state; `sitting` animation state |
| **Assets** | Optional `tilly-sitting-tv.png` |
| **Placeholder** | `default` sprite; no dialogue; optional purple "Stay with me" button that does nothing except resettle |
| **Complexity** | M |
| **Dependencies** | Phase 1 idle behaviour system |

### Bedtime toilet trip

| | |
|---|---|
| **Purpose** | The last trip outside before bed — a familiar micro-ritual in the bedtime sequence. |
| **Reuse** | Bedtime `steps[]` (Phase 2); new dialogue beat |
| **Assets** | Optional `tilly-door.png` |
| **Placeholder** | `default` sprite; reuse `walks` dismiss/accept pattern ("Let's go out" / "She's fine") |
| **Complexity** | M |
| **Dependencies** | Phase 2 bedtime multi-step model |

### Bedtime treat

| | |
|---|---|
| **Purpose** | The small bedtime biscuit — a moment of kindness before sleep. |
| **Reuse** | Bedtime `steps[]`; new dialogue beat |
| **Assets** | Optional `tilly-treat.png` |
| **Placeholder** | `default` sprite; single advance button ("Good girl") |
| **Complexity** | S |
| **Dependencies** | Phase 2 bedtime multi-step model |

### Lights out transition

| | |
|---|---|
| **Purpose** | The signature bedtime moment — tap the switch, screen dims, Tilly settles. |
| **Reuse** | `light-switch-on/off.png`, `ScreenLayout`, `tokens.css` (`--screen-bg`), bedtime steps |
| **Assets** | Light switch PNGs ✅ |
| **Placeholder** | CSS pixel-border toggle if switch art missing; animate `--screen-bg` from `#ffffff` to `#1a1a2e` over 1s |
| **Complexity** | M |
| **Dependencies** | Phase 2 bedtime multi-step model |

---

## Phase 5 — Memories

*The app gently supports remembrance without becoming sad or heavy.*

| Item | Status |
|------|--------|
| Seasonal dialogue | Not started |
| Random memories | Not started |
| Journal integration | Not started |
| "I miss you" conversations | Partial — Hi Baby wired |
| Reflection moments | Not started |
| Anniversary behaviours | Not started |

### Seasonal dialogue

| | |
|---|---|
| **Purpose** | The year has texture — spring birds, summer warmth, autumn leaves, winter quiet. |
| **Reuse** | `loader.ts` — seasonal pool selection by month; extend existing dialogue files or add `seasonal/` subdirectory |
| **Assets** | None |
| **Placeholder** | N/A — content-only |
| **Complexity** | S–M |
| **Dependencies** | Phase 1 dialogue variation |

### Random memories

| | |
|---|---|
| **Purpose** | Occasional "remember when…" moments — gentle nostalgia, never grief tourism. |
| **Reuse** | New `memories.json` content module; idle or low-frequency reminder beat |
| **Assets** | Optional photo support (future) |
| **Placeholder** | Text-only memory lines from JSON; no photo UI in v1 |
| **Complexity** | M |
| **Dependencies** | Phase 1 startup greeting; last-visit tracking |

### Journal integration

| | |
|---|---|
| **Purpose** | A place to note ordinary moments — not a productivity journal, a shared memory book. |
| **Reuse** | New storage module; optional settings link; reflection moments |
| **Assets** | Optional journal-frame sprite |
| **Placeholder** | localStorage text entries only; no export in v1 |
| **Complexity** | L–XL |
| **Dependencies** | Random memories; north-star review for emotional safety |

### "I miss you" conversations

| | |
|---|---|
| **Purpose** | The Hi Baby flow — connection without a task attached. "I miss you." → "me too." |
| **Reuse** | `useRitualSession.ts` (`connect`), `STARTUP_AFFECTION_BEAT`, `AFFECTION` constants — **already wired** |
| **Assets** | Optional `tilly-cuddling.png` |
| **Placeholder** | `default` sprite throughout |
| **Complexity** | S (polish only) |
| **Dependencies** | None — enhance copy and expand to occasional unprompted "I miss you" idle beat |

### Reflection moments

| | |
|---|---|
| **Purpose** | Quiet pauses to notice the day — not assessment, not review. "That was a good day." |
| **Reuse** | New `reflection` dialogue category; low-frequency evening trigger |
| **Assets** | `resting` sprite |
| **Placeholder** | N/A |
| **Complexity** | M |
| **Dependencies** | Phase 1 time-of-day weighting; ritual event history |

### Anniversary behaviours

| | |
|---|---|
| **Purpose** | Recognise significant dates gently — a softer greeting, a particular memory, never a countdown. |
| **Reuse** | New `anniversaries.json` config (dates + associated dialogue/memory); startup greeting override |
| **Assets** | None |
| **Placeholder** | Text-only; no visual distinction beyond dialogue |
| **Complexity** | M |
| **Dependencies** | Random memories; seasonal dialogue; north-star review |

---

## Implementation order

Phases are sequential in emotional logic but some work can overlap.

```
Phase 1 (presence) ──→ Phase 2 (core rituals) ──→ Phase 3 (richer life)
        │                       │
        └───────────────────────┴──→ Phase 4 (quiet moments)
                                              │
                                              └──→ Phase 5 (memories)
```

| Priority | Phase | Why |
|----------|-------|-----|
| 1 | **Phase 1** | Presence before rituals — Tilly must feel alive at rest |
| 2 | **Phase 2** | Core daily rhythms are the app's reason to exist |
| 3 | **Phase 4** (bedtime subset) | Lights-out validates multi-step model for bedtime |
| 4 | **Phase 3** | Texture and joy once the ordinary day works |
| 5 | **Phase 4** (remainder) | Quiet moments deepen companionship |
| 6 | **Phase 5** | Remembrance last — requires trust built by earlier phases |

### First sprint (1–2 weeks)

A testable increment that answers the guiding question:

1. Morning greeting variants + dialogue expansion (Phase 1)
2. Sprite placeholder system (Phase 1)
3. Time-of-day weighting (Phase 1)
4. Idle behaviour v1 — CSS pulse on `default` during idle (Phase 1)
5. Core ritual copy polish for water, medicine, dinner, rest (Phase 2)

---

## Explicitly out of scope

Unless the north star changes:

- Virtual pet stats (hunger, mood, health)
- Streaks, badges, completion percentages
- Task lists or habit tracking dashboards
- Guilt copy for missed rituals or absence
- Multiple screens or routes
- Wiring procedural `TillySprite` CSS animation (extend PNG placeholders first)

---

## Asset placeholder reference

| Needed | Status | Fallback |
|--------|--------|----------|
| `tilly-default.png` | ✅ | — |
| `tilly-drinking.png` | ✅ | — |
| `tilly-party.png` | ✅ | All celebrations |
| `tilly-resting.png` | ✅ | Rest, bedtime, quiet hours, dreaming |
| `light-switch-on/off.png` | ✅ (unwired) | CSS toggle |
| Ritual-specific poses | ❌ | Map to `default` via placeholder system |
| Dreaming / snoring / restless | ❌ | CSS animation on `resting` |
| Phase transitions | ❌ | 200–300ms opacity fade |

---

## Related documentation

| Document | Relationship |
|----------|-------------|
| [`north-star.md`](./north-star.md) | Emotional guardrails for all phases |
| [`rituals-and-rhythms.md`](./rituals-and-rhythms.md) | Ritual catalog and session flow |
| [`architecture.md`](./architecture.md) | How to extend without refactoring |
| [`roadmap.md`](./roadmap.md) | Earlier technical milestone view — superseded by this backlog for prioritisation |
