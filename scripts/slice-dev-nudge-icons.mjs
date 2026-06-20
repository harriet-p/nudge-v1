/**
 * Slices the dev nudge icon strip (10×1 horizontal) into individual PNGs.
 *
 * Usage: node scripts/slice-dev-nudge-icons.mjs [source.jpg|png]
 */
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const defaultSource = path.resolve(
  __dirname,
  '../src/assets/dev/nudge-toolbar-source.jpg',
)
const source = process.argv[2] ? path.resolve(process.argv[2]) : defaultSource
const outDir = path.resolve(__dirname, '../src/assets/dev/icons')

const NAMES = [
  'morning',
  'water',
  'morning-together',
  'food',
  'walk',
  'outside',
  'sunshine',
  'stretch',
  'wind-down',
  'bedtime',
]
const COLS = 10
const ROWS = 1
const DISPLAY_HEIGHT = 48

fs.mkdirSync(outDir, { recursive: true })

const meta = await sharp(source).metadata()
const displayWidth = Math.round(
  (DISPLAY_HEIGHT * meta.width) / COLS / meta.height,
)

for (let i = 0; i < NAMES.length; i++) {
  const col = i % COLS
  const row = Math.floor(i / COLS)
  const left = Math.floor((col * meta.width) / COLS)
  const top = Math.floor((row * meta.height) / ROWS)
  const right = Math.floor(((col + 1) * meta.width) / COLS)
  const bottom = Math.floor(((row + 1) * meta.height) / ROWS)
  const width = right - left
  const height = bottom - top

  const extracted = await sharp(source)
    .extract({ left, top, width, height })
    .png()
    .toBuffer()

  await sharp(extracted)
    .resize(displayWidth, DISPLAY_HEIGHT, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: 'nearest',
    })
    .png()
    .toFile(path.join(outDir, `${NAMES[i]}.png`))
}

console.log(
  `Wrote ${NAMES.length} icons (${displayWidth}×${DISPLAY_HEIGHT}) to ${outDir}`,
)
