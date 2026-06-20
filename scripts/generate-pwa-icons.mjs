/**
 * Generate PWA / home-screen icons from the default Tilly sprite.
 *
 * Usage: node scripts/generate-pwa-icons.mjs
 */
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')
const source = path.join(publicDir, 'sprites/tilly-default.png')

const BACKGROUND = { r: 255, g: 255, b: 255, alpha: 1 }

/** Scale sprite to this fraction of the canvas edge (nearest-neighbour for pixel art). */
const ANY_SCALE = 0.72
/** Maskable safe zone is ~80% diameter; keep sprite inside that circle. */
const MASKABLE_SCALE = 0.58

async function buildIcon(size, spriteScale, outputPath) {
  const spriteSize = Math.round(size * spriteScale)
  const sprite = await sharp(source)
    .resize(spriteSize, spriteSize, { kernel: sharp.kernel.nearest })
    .toBuffer()

  const left = Math.round((size - spriteSize) / 2)
  const top = Math.round((size - spriteSize) / 2)

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BACKGROUND,
    },
  })
    .composite([{ input: sprite, left, top }])
    .png()
    .toFile(outputPath)

  console.log(`  ${path.relative(publicDir, outputPath)} (${size}×${size})`)
}

console.log(`Source: ${path.relative(publicDir, source)}`)
console.log('Writing:')

await buildIcon(32, 0.78, path.join(publicDir, 'favicon-32.png'))
await buildIcon(180, ANY_SCALE, path.join(publicDir, 'apple-touch-icon.png'))
await buildIcon(192, ANY_SCALE, path.join(publicDir, 'pwa-192.png'))
await buildIcon(512, ANY_SCALE, path.join(publicDir, 'pwa-512.png'))
await buildIcon(512, MASKABLE_SCALE, path.join(publicDir, 'pwa-512-maskable.png'))

console.log('Done.')
