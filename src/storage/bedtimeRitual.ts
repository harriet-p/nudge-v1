import { readJson, writeJson } from './localStorage'

const NIGHT_MODE_KEY = 'night-mode-date'

function todayDateKey(now = new Date()): string {
  return now.toISOString().slice(0, 10)
}

/** True after the bedtime ritual completes until the next morning wake-up. */
export function hasEnteredNightModeToday(now = new Date()): boolean {
  const stored = readJson<string | null>(NIGHT_MODE_KEY, null)
  return stored === todayDateKey(now)
}

export function markNightModeEntered(now = new Date()): void {
  writeJson(NIGHT_MODE_KEY, todayDateKey(now))
}

export function clearNightMode(): void {
  writeJson(NIGHT_MODE_KEY, null)
}
