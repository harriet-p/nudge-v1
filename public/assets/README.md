# Tilly assets

Sprite PNGs live in `public/sprites/` (not `public/assets/`) so Vite dev does not treat them as bundled module paths.

See `public/sprites/README.md` for the file list.

## Dialogue library

Invitation copy lives in `src/content/dialogues/*.json` — one file per daily ritual category. Add new lines to any JSON array; the app picks randomly at runtime.
