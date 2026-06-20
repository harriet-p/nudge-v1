# Architecture

*Technical structure of the Tilly codebase — for developers and Cursor agents.*

Stack: **React 19 + TypeScript + Vite 8**, configured as a portrait PWA.

---

## High-level overview

```
┌─────────────────────────────────────────────────────────┐
│  App.tsx                                                │
│    └── MainScreen.tsx          (single screen shell)    │
│          ├── ScreenLayout        (layout frame)         │
│          ├── RitualMoment        (invitation template)  │
│          ├── CharacterDisplay    (Tilly sprite)         │
│          ├── DialogueBox         (speech bubble)        │
│          ├── PixelButton         (action buttons)       │
│          └── SettingsPanel       (modal overlay)        │
└─────────────────────────────────────────────────────────┘
         ↑ viewModel from mapSessionToScreen()
         ↑ session state from useRitualSession()
```

There is **no router**. Navigation is limited to:

- Session phase transitions (internal state machine)
- Settings modal (`useState` toggle in `MainScreen`)

---

## Directory structure

```
src/
├── main.tsx                 # Bootstrap, sets --pixel-scale CSS variable
├── App.tsx                  # Root — renders MainScreen only
├── components/
│   ├── MainScreen.tsx       # Primary screen; branches on session phase
│   ├── RitualMoment.tsx     # Invitation interaction template
│   ├── SettingsPanel.tsx    # Preferences modal
│   ├── TillySprite.tsx      # CSS-drawn animated dog (NOT used in live app)
│   └── ui/                  # Reusable component kit
│       ├── CharacterDisplay.tsx
│       ├── SpeechBubble.tsx
│       ├── DialogueBox.tsx
│       ├── PixelButton.tsx
│       ├── ScreenLayout.tsx
│       └── index.ts
├── presentation/
│   └── mapSessionToScreen.ts  # SessionState → ScreenViewModel
├── sessions/
│   └── sessionMachine.ts      # Phase state machine (pure functions)
├── rituals/
│   ├── catalog.ts             # Ritual definitions
│   └── types.ts               # Ritual, DialogueCategory types
├── reminders/
│   ├── engine.ts              # When/which ritual to offer
│   └── policies.ts            # Quiet hours, intervals, backoff
├── content/
│   ├── loader.ts              # Dialogue selection functions
│   ├── constants.ts           # Global button labels, greeting prefix
│   └── dialogues/             # JSON dialogue libraries
├── hooks/
│   ├── useRitualSession.ts    # Core orchestration hook
│   ├── usePreferences.ts      # User preferences from localStorage
│   └── useTillyAnimation.ts   # CSS animation hook (NOT used in live app)
├── storage/
│   ├── preferences.ts         # UserPreferences persistence
│   ├── ritualEvents.ts        # Ritual event log (cooldowns, intervals)
│   └── localStorage.ts        # Safe localStorage wrapper
├── animations/                # Procedural CSS animation (NOT wired to live app)
│   ├── stateMachine.ts
│   └── frames.ts
├── styles/
│   ├── tokens.css             # Design tokens (Figma-aligned)
│   └── global.css             # Base styles, font, pixel-art class
├── constants/
│   ├── pixelScale.ts          # PIXEL_SCALE, ASSET_PIXEL_RATIO
│   └── spriteSizes.ts         # Native sprite dimensions
├── assets/
│   ├── sprites/               # Tilly PNG sprites (imported by components)
│   └── speech-bubble/         # Bubble PNG sprites
└── types/
    └── index.ts               # UserPreferences and shared types
```

---

## UI component hierarchy

### Component kit (`src/components/ui/`)

These are the **building blocks**. Every ritual composes them — never duplicate.

| Component | File | Role |
|-----------|------|------|
| `ScreenLayout` | `ScreenLayout.tsx` | Full-screen 393×852 frame; positions dialogue, character, buttons via CSS classes |
| `CharacterDisplay` | `CharacterDisplay.tsx` | Tilly PNG sprite by variant: `default`, `drinking`, `party`, `resting` |
| `SpeechBubble` | `SpeechBubble.tsx` | Pixel-art bubble (`small` / `medium` / `large`); auto-sized via canvas text measurement |
| `DialogueBox` | `DialogueBox.tsx` | Thin wrapper around `SpeechBubble` |
| `PixelButton` | `PixelButton.tsx` | Sprite buttons: `green`, `red`, `purple`; blue sprite for pressed state |

Background is not a separate component — it is CSS on `ScreenLayout` (`--screen-bg: #ffffff`).

### Interaction templates (`src/components/`)

| Component | Phase | Role |
|-----------|-------|------|
| `MainScreen` | All | Shell; switches between idle layout and `RitualMoment` |
| `RitualMoment` | `inviting` | Dialogue + button stack mapped from `ScreenButton[]` |
| `SettingsPanel` | Overlay | User preferences (names, interval, quiet hours, notifications) |

### Rendering flow

```
useRitualSession(preferences)
  → SessionState (sessionMachine)
  → mapSessionToScreen(session, preferences, quietHours)
  → ScreenViewModel
  → MainScreen renders components conditionally
```

`ScreenViewModel` (`src/presentation/mapSessionToScreen.ts`):

```typescript
interface ScreenViewModel {
  phase: SessionPhase
  dialogue?: { text: string; variant: 'tall' | 'short' }
  sprite: TillySpriteVariant
  buttons?: ScreenButton[]
  showHiBaby: boolean
}
```

---

## Session state machine

Pure functions in `src/sessions/sessionMachine.ts` — no side effects.

| Function | Transition |
|----------|-----------|
| `beginInvitation(ritualId, dialogue)` | → `inviting` |
| `beginCelebration(...)` | → `celebrating` |
| `beginSettling(state)` | → `settling` |
| `endSession()` | → `idle` |
| `createRestingSession()` | → `resting` |

Timing constants: `CELEBRATION_DURATION_MS = 2500`, `SETTLING_DURATION_MS = 2000`.

Side effects (event logging, timers) live in `useRitualSession`, not the state machine.

---

## Reminder system

### Engine (`src/reminders/engine.ts`)

| Function | Purpose |
|----------|---------|
| `shouldOfferRitual(preferences)` | Checks notifications, quiet hours, elapsed interval |
| `selectRitualInvitation(preferences)` | Picks ritual (respecting cooldowns) + random dialogue line |
| `getMillisecondsUntilNextCheck(preferences)` | Poll interval for the session hook |

### Policies (`src/reminders/policies.ts`)

| Policy | Value |
|--------|-------|
| Dismiss backoff | 1.5× base interval |
| Post-completion cooldown | 30 minutes minimum |
| Check interval bounds | 30s – 60s |
| Quiet hours | User-configurable (default 22:00–08:00) |

### Event persistence (`src/storage/ritualEvents.ts`)

Events: `invited`, `accepted`, `dismissed`, `completed`. Stored in localStorage (max 100 entries). Used for cooldown tracking and interval calculation.

---

## Sprite system

### Active: PNG sprites via CharacterDisplay

Four variants mapped in `CharacterDisplay.tsx`:

| Variant | PNG | Used when |
|---------|-----|-----------|
| `default` | `tilly-default.png` | Idle, most invitations |
| `drinking` | `tilly-drinking.png` | Water ritual |
| `party` | `tilly-party.png` | Celebrating after accept |
| `resting` | `tilly-resting.png` | Settling, quiet hours, rest/bedtime |

Ritual → sprite mapping is declared in `src/rituals/catalog.ts` (`sprite` field).

Display size: 100×100 px (scaled via `src/constants/pixelScale.ts` and `spriteSizes.ts`).

Reference copies for design handoff: `public/sprites/README.md`.

### Planned but not implemented

- `light-switch-on.png` / `light-switch-off.png` — bedtime interaction (assets exist, no code)
- Additional ritual-specific poses as new variants

### Inactive: CSS animation system

`src/components/TillySprite.tsx` + `src/hooks/useTillyAnimation.ts` + `src/animations/` implement a procedural CSS-drawn dog with states (`idle`, `sitting`, `sleeping`, `walking`, `tailWag`, `earTwitch`).

**Not imported anywhere in the live app.** Do not wire this in unless explicitly requested. Extend PNG variants first.

---

## Dialogue system

### Content files

JSON string arrays in `src/content/dialogues/`. See `src/content/dialogues/README.md` for the category table.

### Loader (`src/content/loader.ts`)

| Function | Purpose |
|----------|---------|
| `pickInvitation(category)` | Random invitation line for a ritual category |
| `pickCompletion(category)` | Random post-accept line |
| `pickSettlingLine()` | Random settling phase line |
| `getDialogueVariant(text)` | `'tall'` or `'short'` based on length/newlines |

### Speech bubble sizing

`SpeechBubble.tsx` uses `pickSpeechBubbleSize()` from `speechBubbleSize.ts` — canvas text measurement selects `small`, `medium`, or `large` bubble PNG.

Bubble specs: `src/assets/speech-bubble/README.md`.

### Button copy

Global labels in `src/content/constants.ts`:

```typescript
BUTTONS = { accept: "Let's go", dismiss: "Later" }
```

Per-ritual button labels are a planned extension — see [`roadmap.md`](./roadmap.md).

---

## Animation system

Two parallel systems exist; only one is active:

| System | Status | Location |
|--------|--------|----------|
| PNG sprite variants + timed phase transitions | **Active** | `CharacterDisplay`, `sessionMachine` timers |
| Procedural CSS animation | **Inactive** | `TillySprite`, `useTillyAnimation`, `animations/` |

The active system selects a sprite variant per phase and uses `setTimeout` for celebration (2.5s) and settling (2s) durations. No CSS transitions between phases.

---

## Asset pipeline

| Asset type | Source | Imported by |
|------------|--------|-------------|
| Tilly sprites | `src/assets/sprites/*.png` | `CharacterDisplay.tsx` |
| Speech bubbles | `src/assets/speech-bubble/*.png` | `SpeechBubble.tsx` |
| Button sprites | `src/assets/sprites/button-*.png` | `PixelButton.tsx` |
| Font | `/fonts/dogicapixelbold.ttf` | `global.css` |

Sprites display at native resolution with the `.pixel-art` CSS class (`image-rendering: pixelated`).

Scaling: `PIXEL_SCALE = 1`, `ASSET_PIXEL_RATIO = 2` in `src/constants/pixelScale.ts`. `--pixel-scale` CSS variable is set on startup in `main.tsx`.

Reference copies (not imported by the app): `public/sprites/`.

---

## Preferences and storage

`UserPreferences` (in `src/types/index.ts`):

- `tillyName`, `userName`
- `notificationsEnabled`
- `reminderIntervalMinutes`
- `quietHoursStart`, `quietHoursEnd`

Persisted in localStorage via `src/storage/preferences.ts`.

---

## Extending the system

To add a new ritual:

1. Add dialogue JSON in `src/content/dialogues/`
2. Add `DialogueCategory` to `src/rituals/types.ts` (if new category)
3. Register import in `src/content/loader.ts`
4. Add entry to `src/rituals/catalog.ts`
5. Add sprite variant to `CharacterDisplay` if needed

Do **not** create a new screen or route. The reminder engine and session machine handle the rest automatically.

To add a multi-step ritual (e.g. bedtime light switch):

1. Extend the `Ritual` type with optional `steps[]`
2. Add a scene template that composes existing UI kit components
3. Extend `mapSessionToScreen` to map steps to view model
4. Extend `useRitualSession` to advance through steps

See [`roadmap.md`](./roadmap.md) for planned milestones.

---

## Key files (quick reference)

| File | Why it matters |
|------|---------------|
| `src/components/MainScreen.tsx` | Primary screen, phase-based rendering |
| `src/hooks/useRitualSession.ts` | Core orchestration |
| `src/presentation/mapSessionToScreen.ts` | State → UI mapping |
| `src/sessions/sessionMachine.ts` | Session phase transitions |
| `src/rituals/catalog.ts` | Ritual definitions |
| `src/reminders/engine.ts` | When/which ritual to offer |
| `src/content/loader.ts` | Dialogue selection |
| `src/components/ui/index.ts` | UI kit exports |
| `src/styles/tokens.css` | Figma-aligned design tokens |
