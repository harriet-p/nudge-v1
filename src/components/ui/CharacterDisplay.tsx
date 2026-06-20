import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { IdleMood } from '../../interactions/idleBehaviour'
import { usePageVisible } from '../../hooks/usePageVisible'
import tillyPlay from '../../assets/sprites/tilly-play.png'
import tillyEarFix from '../../assets/sprites/tilly-ear-fix.png'
import tillyDefault from '../../assets/sprites/tilly-default.png'
import tillyBreakfast from '../../assets/sprites/tilly-breakfast.png'
import tillyDrinking from '../../assets/sprites/tilly-drinking.png'
import tillyEating1 from '../../assets/sprites/tilly-eating-1.png'
import tillyEating2 from '../../assets/sprites/tilly-eating-2.png'
import tillyEating3 from '../../assets/sprites/tilly-eating-3.png'
import tillyEating4 from '../../assets/sprites/tilly-eating-4.png'
import tillyParty from '../../assets/sprites/tilly-party.png'
import tillyResting from '../../assets/sprites/tilly-resting.png'
import tillySleeping from '../../assets/sprites/tilly-sleeping.png'
import tillyStretch1 from '../../assets/sprites/tilly-stretch-1.png'
import tillyStretch2 from '../../assets/sprites/tilly-stretch-2.png'
import tillyStretch3 from '../../assets/sprites/tilly-stretch-3.png'
import tillyStretch4 from '../../assets/sprites/tilly-stretch-4.png'
import tillyHarness1 from '../../assets/sprites/tilly-harness-1.png'
import tillyHarness2 from '../../assets/sprites/tilly-harness-2.png'
import tillyBedtimeCircle1 from '../../assets/sprites/tilly-bedtime-circle-1.png'
import tillyBedtimeCircle2 from '../../assets/sprites/tilly-bedtime-circle-2.png'
import tillyBedtimeCircle3 from '../../assets/sprites/tilly-bedtime-circle-3.png'
import tillyBedtimeCircle4 from '../../assets/sprites/tilly-bedtime-circle-4.png'
import tillyBedtimeCircle5 from '../../assets/sprites/tilly-bedtime-circle-5.png'
import { scaledSize } from '../../constants/pixelScale'
import { TILLY_SPRITE_SIZE } from '../../constants/spriteSizes'
import { EATING_FRAME_MS } from '../../sessions/sessionMachine'
import { getRitualById } from '../../rituals/catalog'
import './CharacterDisplay.css'

export type TillySpriteVariant =
  | 'default'
  | 'breakfast'
  | 'drinking'
  | 'eating'
  | 'party'
  | 'resting'
  | 'sleeping'
  | 'stretch'
  | 'harness'
  | 'bedtime_circle'
  | 'bedtime_light'
  | 'bedtime_lying'
  | 'ear_fix'
  | 'play'

type StaticSpriteVariant = Exclude<
  TillySpriteVariant,
  'eating' | 'stretch' | 'harness' | 'bedtime_circle'
>

const SPRITE_SRC: Record<StaticSpriteVariant, string> = {
  default: tillyDefault,
  breakfast: tillyBreakfast,
  drinking: tillyDrinking,
  party: tillyParty,
  resting: tillyResting,
  sleeping: tillySleeping,
  bedtime_light: tillyBedtimeCircle5,
  bedtime_lying: tillyBedtimeCircle5,
  ear_fix: tillyEarFix,
  play: tillyPlay,
}

const ANIMATED_SPRITES = {
  stretch: {
    frames: [tillyStretch1, tillyStretch2, tillyStretch3, tillyStretch4] as const,
    frameMs: 600,
    loop: true,
  },
  eating: {
    frames: [tillyEating1, tillyEating2, tillyEating3, tillyEating4] as const,
    frameMs: EATING_FRAME_MS,
    loop: false,
  },
  harness: {
    frames: [tillyHarness1, tillyHarness2] as const,
    frameMs: 350,
    loop: true,
  },
  bedtime_circle: {
    frames: [
      tillyBedtimeCircle1,
      tillyBedtimeCircle2,
      tillyBedtimeCircle3,
      tillyBedtimeCircle4,
      tillyBedtimeCircle5,
    ] as const,
    frameMs: 700,
    loop: false,
  },
} as const

type AnimatedSpriteVariant = keyof typeof ANIMATED_SPRITES

const SPRITE_LABEL: Record<TillySpriteVariant, string> = {
  default: 'Tilly',
  breakfast: 'Tilly with food bowl',
  drinking: 'Tilly with water bowl',
  eating: 'Tilly eating',
  party: 'Tilly wearing a party hat',
  resting: 'Tilly resting',
  sleeping: 'Tilly sleeping',
  stretch: 'Tilly stretching',
  harness: 'Tilly wagging her tail in her harness',
  bedtime_circle: 'Tilly circling before bed',
  bedtime_light: 'Tilly ready for bed',
  bedtime_lying: 'Tilly lying down to sleep',
  ear_fix: 'Tilly with one ear folded down',
  play: 'Tilly wearing a colourful collar',
}

function isAnimatedVariant(
  variant: TillySpriteVariant,
): variant is AnimatedSpriteVariant {
  return variant in ANIMATED_SPRITES
}

const LIGHTS_ON_SPRITES: ReadonlySet<TillySpriteVariant> = new Set([
  'bedtime_circle',
  'bedtime_light',
])

function resolveDisplayVariant(
  variant: TillySpriteVariant,
  lightsOut?: boolean,
): TillySpriteVariant {
  if (!lightsOut) return variant
  if (LIGHTS_ON_SPRITES.has(variant)) return variant
  return 'sleeping'
}

export interface CharacterDisplayProps {
  variant?: TillySpriteVariant
  className?: string
  /** When true, show the sleeping sprite (lights out / night mode). */
  lightsOut?: boolean
  /** Placeholder animation hook — maps to CSS until sprite sheets arrive. */
  idleMood?: IdleMood
}

export function CharacterDisplay({
  variant = 'default',
  className = '',
  lightsOut = false,
  idleMood,
}: CharacterDisplayProps) {
  const displayVariant = resolveDisplayVariant(variant, lightsOut)
  const visible = usePageVisible()
  const [animFrame, setAnimFrame] = useState(0)
  const native = TILLY_SPRITE_SIZE[displayVariant]
  const size = scaledSize(native.width, native.height)
  const spriteStyle: CSSProperties = {
    width: size.width,
    height: size.height,
  }
  const animated = isAnimatedVariant(displayVariant)
    ? ANIMATED_SPRITES[displayVariant]
    : null

  useEffect(() => {
    if (!animated || !visible) return

    const intervalId = window.setInterval(() => {
      setAnimFrame((frame) => {
        const lastFrame = animated.frames.length - 1
        if (animated.loop) {
          return (frame + 1) % animated.frames.length
        }
        return frame < lastFrame ? frame + 1 : frame
      })
    }, animated.frameMs)

    return () => window.clearInterval(intervalId)
  }, [animated, displayVariant, visible])

  useEffect(() => {
    if (animated) {
      setAnimFrame(0)
    }
  }, [animated, displayVariant])

  const src = animated
    ? animated.frames[animFrame]
    : SPRITE_SRC[displayVariant as StaticSpriteVariant]

  const moodClass = idleMood
    ? `character-display--idle-${idleMood.replace(/_/g, '-')}`
    : ''
  const animatedClass = animated ? `character-display--${displayVariant}` : ''

  return (
    <div
      className={`character-display ${moodClass} ${animatedClass} ${className}`.trim()}
      style={spriteStyle}
    >
      <img
        key={displayVariant}
        className="character-display__sprite pixel-art"
        src={src}
        alt={SPRITE_LABEL[displayVariant]}
        width={size.width}
        height={size.height}
        style={spriteStyle}
        draggable={false}
      />
    </div>
  )
}

export function getSpriteVariantForRitual(ritualId: string): TillySpriteVariant {
  const ritual = getRitualById(ritualId)
  return ritual?.sprite ?? 'default'
}
