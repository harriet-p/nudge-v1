import { DEFAULT_PREFERENCES, type UserPreferences } from '../types'
import { readJson, writeJson } from './localStorage'

const PREFERENCES_KEY = 'preferences'

type StoredPreferences = Partial<UserPreferences> & {
  notificationsEnabled?: boolean
  reminderIntervalMinutes?: number
}

export function loadPreferences(): UserPreferences {
  const stored = readJson<StoredPreferences>(PREFERENCES_KEY, {})
  return {
    ...DEFAULT_PREFERENCES,
    ...stored,
    nudgesEnabled:
      stored.nudgesEnabled ??
      stored.notificationsEnabled ??
      DEFAULT_PREFERENCES.nudgesEnabled,
    nudgeIntervalMinutes:
      stored.nudgeIntervalMinutes ??
      stored.reminderIntervalMinutes ??
      DEFAULT_PREFERENCES.nudgeIntervalMinutes,
  }
}

export function savePreferences(preferences: UserPreferences): void {
  writeJson(PREFERENCES_KEY, preferences)
}

export function updatePreferences(
  patch: Partial<UserPreferences>,
): UserPreferences {
  const next = { ...loadPreferences(), ...patch }
  savePreferences(next)
  return next
}
