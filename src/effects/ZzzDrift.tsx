import type { EffectFrameSource } from './types'
import './ZzzDrift.css'

interface ZzzLetter {
  id: string
  /** Placeholder text until zzz frame PNGs replace this entry. */
  char: string
  delayMs: number
  scale: number
  frame?: EffectFrameSource
}

const ZZZ_LETTERS: ZzzLetter[] = [
  { id: 'z-small', char: 'z', delayMs: 0, scale: 0.8 },
  { id: 'z-mid', char: 'Z', delayMs: 900, scale: 1 },
  { id: 'z-large', char: 'Z', delayMs: 1800, scale: 1.2 },
]

const ZZZ_CYCLE_MS = 2800

interface ZzzDriftProps {
  frames?: EffectFrameSource[]
  alt?: string
}

export function ZzzDrift({ frames, alt = 'Sleeping' }: ZzzDriftProps) {
  const letters = ZZZ_LETTERS.map((letter, index) => ({
    ...letter,
    frame: frames?.[index],
  }))

  return (
    <div className="zzz-drift" role="img" aria-label={alt}>
      {letters.map((letter) => (
        <span
          key={letter.id}
          className="zzz-drift__letter"
          style={{
            animationDelay: `${letter.delayMs}ms`,
            animationDuration: `${ZZZ_CYCLE_MS}ms`,
            fontSize: `calc(${letter.scale} * var(--font-size-body))`,
          }}
        >
          {letter.frame ? (
            <img
              className="zzz-drift__sprite pixel-art"
              src={letter.frame.src}
              alt=""
              draggable={false}
            />
          ) : (
            letter.char
          )}
        </span>
      ))}
    </div>
  )
}
