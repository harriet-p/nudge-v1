# Dialogue Style

*How Tilly speaks — and how to write new lines.*

For the file layout and category table, see also `src/content/dialogues/README.md`.

---

## Voice

Tilly is a small dog who wants to do life **together**. She does not lecture, guilt, or keep score. She appears, rests her chin on a knee, or waits until you notice it is time.

Every line should feel like:

> **"Come with me."**

not:

> **"You should do this."**

---

## Tone qualities

| Quality | Example direction |
|---------|------------------|
| Understated | "Shall we get some water?" not "Stay hydrated!" |
| Ordinary | References to dinner, walks, sunshine — the sacred mundane |
| Gentle | No urgency, no exclamation marks unless genuinely warm |
| Togetherness | **We**, **let's**, **shall we** — shared acts, not assignments |
| Occasionally funny | Light, never sarcastic or performative |

---

## Grammar and structure

- Prefer **invitations** over **instructions**
- Use the user's name sparingly — the idle greeting uses it; ritual invitations usually do not
- Short lines fit the small speech bubble; longer lines wrap inside the large bubble
- Newlines (`\n`) in strings create deliberate line breaks and select the tall bubble variant
- Avoid productivity language: no "complete", "task", "goal", "streak", "reminder" (in user-facing copy)

---

## Dialogue categories

Each ritual category has a JSON file in `src/content/dialogues/`:

| Category | Ritual | File |
|----------|--------|------|
| `morning` | Starting the day | `morning.json` |
| `water` | Drinking water | `water.json` |
| `medicine` | Medication | `medicine.json` |
| `sunshine` | Getting outside | `sunshine.json` |
| `walks` | Walks and stretching | `walks.json` |
| `dinner` | Meals | `dinner.json` |
| `rest` | Slowing down | `rest.json` |
| `bedtime` | Winding down | `bedtime.json` |
| `cuddles` | Closeness | `cuddles.json` |
| `random_affection` | Unprompted warmth | `random-affection.json` |
| `encouragement` | Gentle nudges | `encouragement.json` |

### Shared dialogue files

| File | When used |
|------|-----------|
| `completion.json` | After the user taps accept — keyed by category |
| `settling.json` | During the settling phase before returning to idle |

---

## Adding new lines

1. Append strings to the relevant JSON array
2. No code changes needed — Vite hot-reload picks up new copy
3. Read lines aloud: do they sound like Tilly, or like a wellness app?

To add a **new category**, you must also update `DialogueCategory` in `src/rituals/types.ts`, register the import in `src/content/loader.ts`, and add a ritual entry in `src/rituals/catalog.ts`.

---

## Button labels

Accept and dismiss button copy should match the ritual where possible. The design system specifies per-ritual labels like "Let's Walk" and "Let's Get Water" — see [`design-system.md`](./design-system.md).

Currently all rituals share global labels (`"Let's go"` / `"Later"`) from `src/content/constants.ts`. Per-ritual labels are a planned extension via ritual configuration, not a reason to create new screens.

---

## Examples

**Good**

- "I think it's walkies time. Shall we?"
- "My bowl is looking a bit empty."
- "It's getting late. I'm getting sleepy."

**Avoid**

- "Time to complete your water goal!"
- "You haven't walked today."
- "Don't forget your medication — it's important!"
