import type { DailyRhythm } from './types'

/** Morning window for wake-up sequence (local time, 24h). */
export const MORNING_WINDOW_START_HOUR = 5
export const MORNING_WINDOW_END_HOUR = 11

export function isMorningWindow(now = new Date()): boolean {
  const hour = now.getHours()
  return hour >= MORNING_WINDOW_START_HOUR && hour < MORNING_WINDOW_END_HOUR
}

/**
 * Daily rhythms — when certain shared moments feel natural.
 * Nudges outside these windows fall back to the full ritual pool.
 */
export const DAILY_RHYTHMS: DailyRhythm[] = [
  {
    id: 'morning',
    startHour: 5,
    endHour: 11,
    ritualIds: ['morning', 'stretch', 'water'],
  },
  {
    id: 'midday',
    startHour: 11,
    endHour: 14,
    ritualIds: ['water', 'lunch'],
  },
  {
    id: 'afternoon',
    startHour: 14,
    endHour: 17,
    ritualIds: ['outdoors', 'stretch', 'water'],
  },
  {
    id: 'evening',
    startHour: 17,
    endHour: 21,
    ritualIds: ['dinner', 'evening', 'outdoors'],
  },
  {
    id: 'bedtime',
    startHour: 21,
    endHour: 23,
    ritualIds: ['bedtime', 'evening'],
  },
]

export function getActiveRhythms(now = new Date()): DailyRhythm[] {
  const hour = now.getHours()
  return DAILY_RHYTHMS.filter(
    (rhythm) => hour >= rhythm.startHour && hour < rhythm.endHour,
  )
}

export function getRitualIdsForCurrentRhythm(now = new Date()): string[] {
  const rhythms = getActiveRhythms(now)
  if (rhythms.length === 0) return []
  return [...new Set(rhythms.flatMap((rhythm) => rhythm.ritualIds))]
}
