import { readJson, writeJson } from './localStorage'
import { clearNightMode } from './bedtimeRitual'

const MORNING_COMPLETE_KEY = 'morning-complete-date'

function todayDateKey(now = new Date()): string {
  return now.toISOString().slice(0, 10)
}

export function hasCompletedMorningToday(now = new Date()): boolean {
  const stored = readJson<string | null>(MORNING_COMPLETE_KEY, null)
  return stored === todayDateKey(now)
}

/** Lights come back on when the morning ritual begins. */
export function markMorningStarted(): void {
  clearNightMode()
}

export function markMorningComplete(now = new Date()): void {
  writeJson(MORNING_COMPLETE_KEY, todayDateKey(now))
  clearNightMode()
}
