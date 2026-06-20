# Contributing for Cursor Agents

*Instructions for AI-assisted development on this project.*

You are working on **Tilly** — a gentle companion app that preserves shared daily rhythms through pixel-art ritual invitations. This is not a productivity app, virtual pet, or habit tracker.

---

## Before you write any code

1. **Read the `/docs` folder.** Start with this file, then read the documents relevant to your task:
   - Emotional intent → [`north-star.md`](./north-star.md), [`design-principles.md`](./design-principles.md)
   - Daily behaviour and nudges → [`daily-rhythm.md`](./daily-rhythm.md)
   - User experience → [`rituals-and-rhythms.md`](./rituals-and-rhythms.md), [`dialogue-style.md`](./dialogue-style.md), [`design-system.md`](./design-system.md)
   - Technical structure → [`architecture.md`](./architecture.md)
   - What to build next → [`roadmap.md`](./roadmap.md)

2. **Treat documentation as the source of truth.** If documentation and code disagree, the documentation reflects intended behaviour — flag the discrepancy rather than silently following outdated code.

3. **Do not rely on previous chat history.** Everything you need should be in `/docs` and the codebase.

---

## Core architectural rules

### One screen, many rituals

The app has **one screen** (`MainScreen`). The Figma prototype is a **library of interaction rituals**, not a collection of pages to implement.

When adding a new ritual:
- Add configuration to `src/rituals/catalog.ts`
- Add dialogue to `src/content/dialogues/`
- Reuse `RitualMoment` and the UI kit — do not create a new screen

See [`rituals-and-rhythms.md`](./rituals-and-rhythms.md) and [`architecture.md`](./architecture.md#extending-the-system).

### Extend, do not replace

The existing codebase is valuable. Preserve and extend it incrementally:

| System | Extend via | Do not |
|--------|-----------|--------|
| Rituals | `catalog.ts`, dialogue JSON | Create per-ritual screen components |
| UI | `src/components/ui/` kit | Duplicate layout or sprite components |
| Session flow | `sessionMachine.ts` phases | Replace with a different state library |
| Nudges / daily rhythm | `src/nudges/`, dialogue JSON | Rewrite scheduling from scratch; see [`daily-rhythm.md`](./daily-rhythm.md) |
| Dialogue | JSON files in `content/dialogues/` | Hardcode strings in components |
| Sprites | New variants in `CharacterDisplay` | Switch to CSS-drawn sprites without request |

### Prioritise emotional intent over technical optimisation

Before optimising, refactoring, or introducing abstractions, ask:

> Does this feel like Tilly gently inviting us to live well together?

If an optimisation would make the code cleaner but the experience colder, slower, or more transactional — do not do it.

See [`north-star.md`](./north-star.md) for the full emotional standard.

---

## What to build

- Reusable **interaction rituals** composed from existing components
- New **dialogue lines** (JSON only — no code changes needed)
- New **ritual configurations** (catalog entries with sprite, dialogue, button labels)
- New **scene templates** that compose the UI kit (e.g. multi-step bedtime)
- **Incremental extensions** to the session machine, reminder engine, and view model

## What not to build

- New screens or routes for individual reminders
- Streak counters, badges, completion percentages, or gamification
- Productivity language ("complete", "task", "goal", "streak")
- Guilt-inducing copy for dismissed or missed rituals
- Duplicate components that already exist in `src/components/ui/`
- Large refactors that replace working systems

See [`roadmap.md`](./roadmap.md) for planned milestones and explicit out-of-scope items.

---

## Code conventions

- **Match existing patterns.** Read surrounding code before writing. Match naming, types, import style, and documentation level.
- **Minimise scope.** The simplest correct diff is strictly better than a large refactor.
- **No unnecessary comments.** Code should be self-explanatory; comment only non-obvious business logic.
- **No unnecessary tests.** Add tests only when requested or when they cover meaningful behaviour.
- **Do not create commits** unless the user explicitly asks.

---

## Key files to know

| When you need to… | Look at… |
|-------------------|----------|
| Understand the screen layout | `src/components/MainScreen.tsx` |
| Add a ritual | `src/rituals/catalog.ts` |
| Add dialogue | `src/content/dialogues/*.json` |
| Change what the user sees | `src/presentation/mapSessionToScreen.ts` |
| Change session flow | `src/sessions/sessionMachine.ts` |
| Change when nudges appear | `src/nudges/engine.ts` — behaviour spec in [`daily-rhythm.md`](./daily-rhythm.md) |
| Add a UI component | `src/components/ui/` |
| Change layout positions | `src/styles/tokens.css` |
| Add a sprite variant | `src/components/ui/CharacterDisplay.tsx` |

---

## Interpreting Figma updates

When the user updates the Figma prototype:

| Figma change | Your action |
|--------------|-------------|
| New ritual frame | New catalog entry + dialogue JSON |
| Different copy | Update dialogue JSON |
| Different button label | Extend ritual config |
| New sprite pose | Add variant to CharacterDisplay |
| Multi-step interaction | Add ritual steps + scene template |
| Layout change | Update tokens.css (once, all rituals inherit) |

Do not treat Figma frames as pages. See [`design-principles.md`](./design-principles.md#one-screen-many-rituals).

---

## Documentation maintenance

If your code change alters intended behaviour (new ritual type, new session phase, new component in the kit), update the relevant `/docs` file in the same change. Keep documentation current so the next agent does not need chat history.

Scattered READMEs next to code (`src/content/dialogues/README.md`, `public/sprites/README.md`) should remain as quick references; canonical descriptions live in `/docs`.

---

## The test

Every change — code, copy, animation, or design — must pass:

> **Does this feel like Tilly gently inviting us to live well together?**

If no, reconsider before shipping.
