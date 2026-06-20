import type { EffectFrameSource } from './types'
import './LeafFall.css'

interface FallingLeaf {
  id: string
  frameIndex: number
  leftPercent: number
  delayMs: number
  durationMs: number
  driftPx: number
}

const LEAF_FALL_DURATION_MS = 3000

const LEAF_STAGGER_MS = 500

const FALLING_LEAVES: FallingLeaf[] = [
  { id: 'leaf-a', frameIndex: 0, leftPercent: 6, delayMs: LEAF_STAGGER_MS * 0, durationMs: LEAF_FALL_DURATION_MS, driftPx: 10 },
  { id: 'leaf-b', frameIndex: 1, leftPercent: 20, delayMs: LEAF_STAGGER_MS * 1, durationMs: LEAF_FALL_DURATION_MS, driftPx: -8 },
  { id: 'leaf-c', frameIndex: 2, leftPercent: 34, delayMs: LEAF_STAGGER_MS * 2, durationMs: LEAF_FALL_DURATION_MS, driftPx: 12 },
  { id: 'leaf-d', frameIndex: 0, leftPercent: 48, delayMs: LEAF_STAGGER_MS * 3, durationMs: LEAF_FALL_DURATION_MS, driftPx: -6 },
  { id: 'leaf-e', frameIndex: 1, leftPercent: 62, delayMs: LEAF_STAGGER_MS * 4, durationMs: LEAF_FALL_DURATION_MS, driftPx: 8 },
  { id: 'leaf-f', frameIndex: 2, leftPercent: 76, delayMs: LEAF_STAGGER_MS * 5, durationMs: LEAF_FALL_DURATION_MS, driftPx: -10 },
  { id: 'leaf-g', frameIndex: 1, leftPercent: 90, delayMs: LEAF_STAGGER_MS * 6, durationMs: LEAF_FALL_DURATION_MS, driftPx: 6 },
]

interface LeafFallProps {
  frames: EffectFrameSource[]
  alt?: string
}

export function LeafFall({ frames, alt = 'Falling leaves' }: LeafFallProps) {
  return (
    <div className="leaf-fall" role="img" aria-label={alt}>
      {FALLING_LEAVES.map((leaf) => {
        const frame = frames[leaf.frameIndex] ?? frames[0]
        if (!frame) return null

        return (
          <span
            key={leaf.id}
            className="leaf-fall__leaf"
            style={{
              left: `${leaf.leftPercent}%`,
              animationDelay: `${leaf.delayMs}ms`,
              animationDuration: `${leaf.durationMs}ms`,
              ['--leaf-drift' as string]: `calc(${leaf.driftPx} * var(--pixel-scale) * 1px)`,
            }}
          >
            <img
              className="leaf-fall__sprite pixel-art"
              src={frame.src}
              alt=""
              draggable={false}
            />
          </span>
        )
      })}
    </div>
  )
}
