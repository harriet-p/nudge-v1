import { readJson, writeJson } from '../storage/localStorage'
import type { EffectId } from './types'

/** Celebration overlays keyed by ritual — extend as new effects arrive. */
const CELEBRATION_EFFECTS_BY_RITUAL: Partial<Record<string, readonly EffectId[]>> =
  {
    outdoors: ['falling-leaves', 'dove-walk', 'wagtail-jump', 'sun-shimmer'],
  }

const CELEBRATION_QUEUE_KEY = 'celebration-effect-queue'

type CelebrationQueue = Partial<Record<string, EffectId[]>>

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickUniqueFromPool(
  ritualId: string,
  pool: readonly EffectId[],
): EffectId {
  const queues = readJson<CelebrationQueue>(CELEBRATION_QUEUE_KEY, {})
  const poolSet = new Set(pool)
  let remaining = (queues[ritualId] ?? []).filter((id) => poolSet.has(id))

  if (remaining.length === 0) {
    remaining = shuffle(pool)
  }

  const [picked, ...rest] = remaining
  queues[ritualId] = rest
  writeJson(CELEBRATION_QUEUE_KEY, queues)
  return picked
}

export function pickCelebrationEffect(ritualId: string): EffectId | undefined {
  const pool = CELEBRATION_EFFECTS_BY_RITUAL[ritualId]
  if (!pool || pool.length === 0) return undefined
  return pickUniqueFromPool(ritualId, pool)
}

export function getCelebrationEffectDurationMs(effectId: EffectId): number {
  switch (effectId) {
    case 'falling-leaves':
      return 6000
    case 'dove-walk':
    case 'wagtail-jump':
    case 'sun-shimmer':
      return 6000
    default:
      return 2500
  }
}

export function getCelebrationEffectCount(ritualId: string): number {
  return CELEBRATION_EFFECTS_BY_RITUAL[ritualId]?.length ?? 0
}

export function getCelebrationEffectIds(ritualId: string): readonly EffectId[] {
  return CELEBRATION_EFFECTS_BY_RITUAL[ritualId] ?? []
}
