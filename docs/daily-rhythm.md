# Daily Rhythm

*Behavioural specification for Tilly's day — timing, nudges, dialogue, and flow.*

This document is the **source of truth** for how Tilly should feel across a full day. It is not a technical document. Use it when implementing or expanding nudges, idle behaviour, rituals, and dialogue.

Related docs:

- Copy voice: [`dialogue-style.md`](./dialogue-style.md)
- Ritual interaction template: [`rituals-and-rhythms.md`](./rituals-and-rhythms.md)
- Emotional purpose: [`north-star.md`](./north-star.md)

---

## Core philosophy

Tilly spends most of the day simply **existing**.

She is resting, sleeping, lounging, wandering, or quietly keeping company. The application should spend far more time in quiet coexistence than active interaction.

**Nudges** are occasional interruptions to this resting state. Every nudge should feel like Tilly expressing her own needs and inviting the user to share the moment with her.

A reminder tells the user what they should do. A nudge expresses Tilly's own need and gently invites the user into a shared moment.

The application should never feel like productivity software. It should feel like quietly living alongside Tilly. Every interaction should preserve **companionship over compliance**.

The guiding principle for every nudge:

> *What would Tilly naturally want right now, and would she invite Harriet to join her?*

---

## Daily rhythm engine

The application should not operate on rigid schedules.

Instead, behaviour is driven by a **probability-based Daily Rhythm Engine**. Tilly should feel like a living companion with habits and preferences — not a scheduler.

The current time influences which nudges are *likely*, but nothing should feel deterministic.

### Nudge lifecycle

```
Idle
  ↓
Tilly notices something
  ↓
Tilly expresses her own need
  ↓
Tilly invites shared action
  ↓
User responds
  ↓
Shared activity
  ↓
Tilly settles
  ↓
Return to idle
```

### Idle states

At any given moment, Tilly is one of:

- **Sleeping**
- **Lounging**
- **Sitting quietly**
- **Looking around**
- **Wandering**

Occasionally she transitions into a nudge. The rhythm should feel natural and slightly unpredictable.

### Design intent

The goal is that **no two days feel identical**.

- Some days Tilly may ask for water twice.
- Some days she may simply sleep through the afternoon.
- Some days she may become particularly excited for a walk.

This slight unpredictability is intentional. Optimise for **authenticity over consistency**. The app should feel like quietly sharing life with another living being — not following a timetable.

---

## Time windows

Time windows describe what Tilly is *likely* to do — not what she *must* do. Probabilities shift through the day; exact weights are tuned during implementation.

### 7:00am–9:00am — Morning

**High probability:**

- Morning wake-up ritual

**Low probability:**

- Continue sleeping
- Lounging

The morning ritual should occur **once per day only**.

---

### 9:00am–12:00pm — Late morning

**Mostly idle.**

**Occasional probability of:**

- Water
- Outside
- Stretch

---

### 12:00pm–4:00pm — Afternoon rest

**Predominantly resting.** Very low interruption frequency.

**Mostly:**

- Sleeping
- Lounging
- Dreaming

**Rare:**

- Water

---

### 4:00pm–6:00pm — Restlessness

**Increasing restlessness.**

**Higher probability of:**

- Food
- Walk
- Outside

Random nudges become slightly more common during this window.

---

### 6:00pm–9:00pm — Evening quiet

**Mostly quiet.**

**Occasional:**

- Water
- Evening wind-down
- Sit together

---

### 9:00pm–10:00pm — Preparing for sleep

**High probability of:**

- Bedtime routine

**Constraints:**

- No walk nudges
- Minimal interruptions

---

### 10:00pm–7:00am — Night

**Sleeping state.**

**No nudges** — except the bedtime sequence at approximately 10pm if not yet completed.

---

## Night (10pm–7am)

### Default state

**Sleeping.**

### Occasional ambient behaviour

- Soft snoring
- Zzz animation
- Ear twitch
- Dreaming

No nudges should occur during this period.

---

## Bedtime ritual (~10pm)

Tilly wakes. She stretches. She asks to go outside.

**After returning:**

1. Treat
2. Water
3. Brush teeth
4. Bed

Tilly circles and settles. Returns to sleeping state.

### Dialogue examples

- "I'm ready."
- "One last outside."
- "Then bed."

---

## Morning (7am–9am)

Tilly slowly wakes.

1. Stretch
2. Look around
3. Sit patiently

### Greeting dialogue

- "Good morning!"
- "I'm awake."
- "You're awake!"

### Invitation to rise

- "It's time to get up."
- "Let's start the day."

### Morning Together checklist

Presented as a **shared morning ritual** — not individual reminders.

- Medicine
- Brush teeth
- Get dressed

### Completion

- "That's better."

Return to idle.

---

## Daytime idle

**Default behaviour** for most of the day.

Randomly rotate between:

- Sleeping
- Lounging
- Sitting quietly
- Looking around
- Wandering

No dialogue required. Occasional subtle idle animations.

---

## Nudge rules

Tilly **never instructs**.

She expresses her own need first. Then asks whether the user shares it.

### Speak like this

- "I'm thirsty. Are you?"
- "I'm hungry. Maybe you are too."
- "I found sunshine."
- "I want to go outside."

### Never speak like this

- "You should…"
- "Don't forget…"
- "You need to…"

The app should avoid directive language entirely.

### Interaction pattern

Every ritual nudge follows the same flow:

1. Tilly appears with invitation dialogue
2. User accepts (**Let's go**) or postpones (**Later**)
3. On accept: brief celebration → settling line → return to idle
4. On dismiss: Tilly accepts quietly → return to idle

---

## Water nudge

### Dialogue pool

- I'm thirsty. Are you?
- I think we need water.
- I could have a drink.

### Buttons

- **Let's Go**
- **Later**

### Completion

- "Better."

Return to idle.

---

## Food nudge

### Dialogue pool

- I'm hungry. Maybe you are too.
- I could eat.
- I think it's dinner time.

### Buttons

- **Let's Go**
- **Later**

Return to idle after completion.

---

## Walk nudge

### Dialogue pool

- Shall we wander around the block?
- I have energy. Do you?
- Trees won't sniff themselves.
- I want to smell everything.

### Buttons

- **Let's Walk**
- **Later**

Return to idle after completion.

---

## Outside nudge

### Dialogue pool

- Can we go outside?
- I found sunshine.
- The birds are busy.
- The air smells nice.

### Buttons

- **Let's Go Outside**
- **Later**

Return to idle after completion.

---

## Stretch nudge

### Dialogue pool

- I stretched.
- Stretch with me?
- Big stretch.

### Buttons

- **Let's stretch**
- **Later**

Return to idle after completion.

---

## Evening nudge

### Dialogue pool

- Let's slow down.
- I'm getting sleepy.
- It's cozy now.
- Come sit with me.

### Buttons

- **Let's wind down**
- **Later**

Return to idle after completion.

---

## Random nudges

Random nudges occur **infrequently**. They should never feel scheduled.

### Purpose

Interrupt work and reconnect. Tilly wants company.

### Dialogue examples

- "What are you doing?"
- "Are you busy?"
- "Come here."

### Destination rituals

Random nudges do **not** create new activities. They provide spontaneous entry points into existing rituals:

- Water
- Food
- Outside
- Walk

### Context rules

Random nudges should only occur when **contextually appropriate** for the time of day. They become slightly more common during the late-afternoon restlessness window (4pm–6pm). They should not occur during night hours or the pre-bedtime window.

---

## Writing style

| Quality | Direction |
|---------|-----------|
| Short | One thought per line; fits the speech bubble |
| Simple | Ordinary words, no jargon |
| Ordinary | Dinner, walks, sunshine — the sacred mundane |
| Warm | Gentle, never urgent |
| Playful | Light humour when it fits; never sarcastic |

**Never** preachy. **Never** productivity-focused.

Tilly always speaks from herself first.

When adding new dialogue, append to the relevant file in `src/content/dialogues/`. See [`dialogue-style.md`](./dialogue-style.md) for voice guidelines and [`src/content/dialogues/README.md`](../src/content/dialogues/README.md) for the file map.

---

## Quick reference — ritual map

| User-facing moment | Ritual ID | Dialogue file |
|--------------------|-----------|---------------|
| Morning wake-up | `morning` | `morning.json` |
| Water | `water` | `water.json` |
| Food | `dinner` | `dinner.json` |
| Walk | `walks` | `walks.json` |
| Outside | `sunshine` | `sunshine.json` |
| Stretch | `stretch` | `stretch.json` |
| Evening wind-down | `evening` | `evening.json` |
| Bedtime | `bedtime` | `bedtime.json` |
| Random company | — | `random.json` → existing ritual |

This table is for orientation only. Behavioural intent lives in the sections above.
