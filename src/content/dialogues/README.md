# Dialogue library

Canonical copy guidelines: [`docs/dialogue-style.md`](../../docs/dialogue-style.md).

Invitation lines for each nudge category. Each file is a JSON array of strings.

The loader (`src/content/loader.ts`) picks one line at random when Tilly offers a nudge.

## Categories

| File | Ritual / moment |
|------|-----------------|
| `morning.json` | Starting the day together |
| `water.json` | Drinking water |
| `dinner.json` | Food / meals |
| `outdoors.json` | Going outside — walks, sunshine, fresh air |
| `stretch.json` | Stretch |
| `evening.json` | Winding down (evening) |
| `bedtime.json` | Bedtime |
| `rest.json` | Slowing down, pausing |
| `random.json` | Spontaneous company — leads into an existing ritual |
| `medicine.json` | Medication |
| `cuddles.json` | Closeness and contact |
| `random-affection.json` | Unprompted warmth |
| `encouragement.json` | Gentle affirmation after shared moments |

## Other files

| File | Purpose |
|------|---------|
| `completion.json` | Lines after tapping **Let's go** (keyed by category) |
| `settling.json` | Lines during the settling phase before idle |

## Writing guidelines

- Understated, ordinary, gentle; occasionally funny
- Tilly's voice: a little dog who wants to do life **together**
- Tilly speaks from herself first — **I'm thirsty. Are you?** not **You should drink**
- Never instruct: no **you should**, **don't forget**, **you need to**
- No productivity language, streaks, or guilt

## Adding lines

Append to any array. No code changes needed — rebuild or hot-reload picks up new copy.
