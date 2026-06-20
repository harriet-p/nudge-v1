# Design Principles

*Visual and interaction philosophy — so every design decision serves the emotional goal.*

For button colour semantics and label examples, see [`design-system.md`](./design-system.md).  
For the project's emotional purpose, see [`north-star.md`](./north-star.md).

---

## Core visual qualities

Every visual choice should reinforce these qualities (from the North Star):

| Quality | What it means here |
|---------|-------------------|
| **Calm** | Nothing urgent, flashing, or demanding attention |
| **Gentleness** | Soft edges, patient pacing, room to breathe |
| **Cosiness** | A familiar, safe place |
| **Playfulness** | Lightness and small delights — never performative cuteness |
| **Nostalgia** | Warm memory without sentimentality |
| **Simplicity** | Only what serves the moment |
| **Ordinary moments** | Dinner, water, a walk — the sacred mundane |

---

## One screen, many rituals

The Figma prototype is **not a sitemap of new screens**. It is a **library of interaction rituals** that share one canvas.

```
┌─────────────────────────────────┐
│         ScreenLayout            │  ← one permanent shell (393×852)
│  ┌───────────────────────────┐  │
│  │ SpeechBubble / DialogueBox│  │  ← reusable
│  └───────────────────────────┘  │
│         CharacterDisplay        │  ← reusable (sprite variant)
│      [ PixelButton stack ]      │  ← reusable (labels vary)
└─────────────────────────────────┘
```

When you add a frame in Figma, you are adding a **ritual configuration** — different dialogue, sprite, button labels, and timing — not a new route or page.

See [`rituals-and-rhythms.md`](./rituals-and-rhythms.md) for the full ritual model.

---

## Layout and tokens

Layout positions derive from the Figma frame (393×852 design units) and live in `src/styles/tokens.css`:

- Dialogue area: `--dialogue-top`
- Character position: `--character-top`
- Button stack: `--button-stack-bottom`, `--button-stack-gap`
- Screen background: `--screen-bg`

Do not hardcode pixel positions in components. Extend tokens when layout needs to change globally.

Typography uses **Dogica Pixel Bold** at 12px design units (`--font-size-body`).

---

## Pixel art rendering

The app uses handcrafted PNG sprites displayed at native resolution with `image-rendering: pixelated`. Do not replace sprites with CSS shapes, SVG approximations, or smooth scaling unless explicitly requested.

Asset pipeline details: [`architecture.md`](./architecture.md#asset-pipeline).

---

## Animation philosophy

Animations should feel **unhurried and organic** — like a dog settling, looking up, or wagging — not like a game UI celebrating a quest completion.

Current implementation uses **static PNG sprite variants** per session phase. A procedural CSS animation system exists (`src/animations/`, `TillySprite.tsx`) but is not wired to the live app. Extend the PNG variant approach first; reconnect procedural animation only when it serves a specific ritual.

---

## Interaction language

Prefer invitations over instructions:

| Use | Avoid |
|-----|-------|
| Let's go | Complete |
| Come with me | Confirm |
| Let's eat | Submit |
| Later | Skip / Dismiss task |
| Hi Baby | Log in / Start |

Buttons carry **emotional intent**, not UI state. See [`design-system.md`](./design-system.md) for the four button colours.

---

## Anti-patterns

Stop and reconsider if you find yourself:

- Adding a new screen or route for each reminder type
- Using streak counters, badges, completion percentages, or "you missed X days"
- Framing rituals as tasks, chores, or habits to optimise
- Making dismissals feel like failure
- Adding urgency (countdown timers, red alerts, pushy copy)
- Duplicating layout components instead of configuring existing ones
- Treating Figma frames as pages to implement one-to-one

---

## The design test

Every visual or interaction choice should answer:

> **Does this feel like Tilly gently inviting us to live well together?**

If no — soften, rephrase, or slow down. Nothing ships that fails this test.
