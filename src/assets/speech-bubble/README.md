# Speech bubble sprites

Canonical documentation: [`docs/architecture.md`](../../docs/architecture.md#dialogue-system).

Handcrafted pixel-art dialogue bubbles used directly by `SpeechBubble` — no CSS, SVG, or 9-slice scaling.

| File | Native size | Used when |
|------|-------------|-----------|
| `bubble-small.png` | 182×132 | Short dialogue |
| `bubble-medium.png` | 294×113 | Medium dialogue |
| `bubble-large.png` | 294×170 | Long dialogue (text wraps inside) |
| `bubble-xlarge.png` | 400×400 | Extra-long dialogue (tall wrap, tail bottom-right) |

Sprites are displayed at **native 1:1 resolution** with `image-rendering: pixelated`. Interior is transparent; only the outline is drawn.

Source canvases (for re-cropping):

- Small: 200×200 → crop 182×132 at offset top 50, left 6
- Medium: 400×200 → crop 294×113 at offset top 50, left 50
- Large: 400×200 → crop 294×170 at offset top 12, left 56
- Xlarge: 400×400 full canvas — ~293×213px interior, tail bottom-right
