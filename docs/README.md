# Tilly — Project Documentation

This folder is the **source of truth** for the project. Read it before making changes — especially if you are a Cursor agent with no prior chat history.

Start with [`contributing-for-agents.md`](./contributing-for-agents.md), then read the layer that matches your task.

---

## Documentation layers

### WHY — Emotional purpose

Why this project exists and what it must never become.

| Document | Contents |
|----------|----------|
| [`north-star.md`](./north-star.md) | Manifesto: co-regulation, invitation-not-instruction, anti-patterns |
| [`design-principles.md`](./design-principles.md) | Visual and interaction philosophy; how to interpret Figma |

### WHAT — User experience

What the app feels like and how rituals work.

| Document | Contents |
|----------|----------|
| [`daily-rhythm.md`](./daily-rhythm.md) | **Behavioural spec** — timing, nudges, idle states, dialogue pools, daily flow |
| [`rituals-and-rhythms.md`](./rituals-and-rhythms.md) | Daily rituals, session flow, Figma-as-ritual-library model |
| [`dialogue-style.md`](./dialogue-style.md) | Tilly's voice, copy guidelines, dialogue file structure |
| [`design-system.md`](./design-system.md) | Button colour semantics and interaction language |

### HOW — Technical implementation

How the codebase is organised and extended.

| Document | Contents |
|----------|----------|
| [`architecture.md`](./architecture.md) | Components, state, reminders, sprites, dialogue, assets |
| [`backlog.md`](./backlog.md) | **Development backlog** — phased rhythms, priorities, implementation mapping |
| [`roadmap.md`](./roadmap.md) | Earlier technical milestone view (see backlog for current prioritisation) |
| [`contributing-for-agents.md`](./contributing-for-agents.md) | Rules for AI-assisted development |

---

## Scattered references (not duplicated here)

These READMEs live next to the code they describe. [`architecture.md`](./architecture.md) links to them.

| Path | Topic |
|------|-------|
| `src/content/dialogues/README.md` | Per-file dialogue category table |
| `public/sprites/README.md` | Sprite asset inventory and usage |
| `src/assets/speech-bubble/README.md` | Speech bubble crop specifications |
