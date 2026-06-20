import type { UserPreferences } from '../types'
import type { RitualEvent } from '../sessions/types'

export const DISMISS_BACKOFF_MULTIPLIER = 1.5
export const COMPLETION_COOLDOWN_MINUTES = 30
export const MIN_CHECK_INTERVAL_MS = 30_000
export const MAX_CHECK_INTERVAL_MS = 60_000

/** Rituals Tilly re-offers every 30 min after dismiss until accepted. */
export const PERSISTENT_RITUAL_IDS = ['dinner', 'walks'] as const
export const PERSISTENT_DISMISS_RETRY_MINUTES = 30

export type PersistentRitualId = (typeof PERSISTENT_RITUAL_IDS)[number]

export function isPersistentRitual(ritualId: string): ritualId is PersistentRitualId {
  return (PERSISTENT_RITUAL_IDS as readonly string[]).includes(ritualId)
}

export function isWithinQuietHours(
  preferences: UserPreferences,
  now = new Date(),
): boolean {
  const hour = now.getHours()
  const { quietHoursStart, quietHoursEnd } = preferences

  if (quietHoursStart === quietHoursEnd) return false
  if (quietHoursStart < quietHoursEnd) {
    return hour >= quietHoursStart && hour < quietHoursEnd
  }
  return hour >= quietHoursStart || hour < quietHoursEnd
}

export function getEffectiveIntervalMs(
  preferences: UserPreferences,
  lastEvent?: RitualEvent,
): number {
  const baseMs = preferences.nudgeIntervalMinutes * 60 * 1000

  if (
    lastEvent?.type === 'dismissed' &&
    isPersistentRitual(lastEvent.ritualId)
  ) {
    return PERSISTENT_DISMISS_RETRY_MINUTES * 60 * 1000
  }

  if (lastEvent?.type === 'dismissed') {
    return baseMs * DISMISS_BACKOFF_MULTIPLIER
  }

  if (lastEvent?.type === 'accepted' || lastEvent?.type === 'completed') {
    return Math.max(baseMs, COMPLETION_COOLDOWN_MINUTES * 60 * 1000)
  }

  return baseMs
}
