import type { TillySpriteVariant } from '../components/ui/CharacterDisplay'

/** Placeholder idle moods — swap sprite per mood when dedicated assets arrive. */
export type IdleMood =
  | 'sleeping'
  | 'lounging'
  | 'sitting_quietly'
  | 'looking_around'
  | 'wandering_slowly'

export interface IdleMoodConfig {
  mood: IdleMood
  /** PNG variant until per-mood sprite sheets exist. */
  sprite: TillySpriteVariant
  durationMs: number
  /** Optional soft line; most rotations stay silent for quiet coexistence. */
  dialogue?: string
}

const IDLE_MOOD_POOL: IdleMoodConfig[] = [
  {
    mood: 'sleeping',
    sprite: 'sleeping',
    durationMs: 12000,
  },
  {
    mood: 'lounging',
    sprite: 'default', // TODO: replace with tilly-lounging.png
    durationMs: 10000,
  },
  {
    mood: 'sitting_quietly',
    sprite: 'default', // TODO: replace with tilly-sitting.png
    durationMs: 9000,
  },
  {
    mood: 'looking_around',
    sprite: 'default', // TODO: replace with tilly-looking.png
    durationMs: 8000,
  },
  {
    mood: 'wandering_slowly',
    sprite: 'default', // TODO: replace with tilly-wandering.png
    durationMs: 11000,
  },
]

export function pickRandomIdleMood(exclude?: IdleMood): IdleMoodConfig {
  const pool = exclude
    ? IDLE_MOOD_POOL.filter((entry) => entry.mood !== exclude)
    : IDLE_MOOD_POOL
  return pool[Math.floor(Math.random() * pool.length)]
}

export function getIdleMoodLabel(mood: IdleMood): string {
  switch (mood) {
    case 'sleeping':
      return 'Tilly is sleeping softly'
    case 'lounging':
      return 'Tilly is lounging nearby'
    case 'sitting_quietly':
      return 'Tilly is sitting quietly'
    case 'looking_around':
      return 'Tilly is looking around'
    case 'wandering_slowly':
      return 'Tilly is wandering slowly'
    default:
      return 'Tilly is here with you'
  }
}
