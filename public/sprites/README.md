# Tilly sprite assets (reference copies)

Canonical sprite system documentation: [`docs/architecture.md`](../../docs/architecture.md#sprite-system).

Canonical sprites are imported from `src/assets/sprites/` in the app. These `public/sprites/` copies are kept for easy inspection and design handoff.

| File | Description | Used when |
|------|-------------|-----------|
| `tilly-default.png` | Default Tilly — sitting, waiting, looking ahead | Idle greeting, most ritual invitations |
| `tilly-breakfast.png` | Tilly with food bowl | Morning together breakfast |
| `tilly-eating-1.png` … `tilly-eating-4.png` | Tilly eating — frames 1–4 | Food ritual after "Let's Eat" (500ms per frame) |
| `tilly-drinking.png` | Tilly with green water bowl | Water reminder |
| `tilly-party.png` | Tilly with pink polka-dot party hat | Celebrating after a ritual is accepted |
| `tilly-resting.png` | Tilly curled up sleeping | Settling, quiet hours, rest & bedtime rituals |
| `tilly-stretch-1.png` | Tilly stretching — frame 1 | Morning wake-up, morning together stretch (animated) |
| `tilly-stretch-2.png` | Tilly stretching — frame 2 | Cycles with stretch-1, stretch-3, and stretch-4 at 600ms |
| `tilly-stretch-3.png` | Tilly stretching — frame 3 (play-bow, hindquarters raised) | Third frame in stretch cycle at 600ms |
| `tilly-stretch-4.png` | Tilly stretching — frame 4 (play-bow, head up) | Fourth frame in stretch cycle at 600ms |
| `light-switch-on.png` | Light switch — ON | Bedtime: screen lit, lights on |
| `light-switch-off.png` | Light switch — OFF | Bedtime: user taps to dim the screen |
| `button-green.png` | Green button — accepting an invitation | Let's go, ritual accept actions |
| `button-red.png` | Red button — postponing without guilt | Later, dismiss actions |
| `button-purple.png` | Purple button — connection | Hi Baby, affection actions |
| `button-blue.png` | Grey-blue button — pressed/active state | All buttons on press |

Tilly sprites display at **100×100 px**. Buttons display at **147×38 px** (from 294×76 PNG ÷ 2). Source art may differ in native size; use a transparent background.
