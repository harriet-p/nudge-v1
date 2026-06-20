export type AnimationState =
  | 'idle'
  | 'sitting'
  | 'sleeping'
  | 'walking'
  | 'tailWag'
  | 'earTwitch'

export interface UserPreferences {
  /** Whether Tilly may offer gentle nudges during the day. */
  nudgesEnabled: boolean
  /** Minutes between nudge offers while idle. */
  nudgeIntervalMinutes: number
  quietHoursStart: number
  quietHoursEnd: number
  /** The companion character's name (e.g. Tilly). */
  tillyName: string
  /** The user's name — used in greetings from the companion. */
  userName: string
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  nudgesEnabled: true,
  nudgeIntervalMinutes: 60,
  quietHoursStart: 23,
  quietHoursEnd: 7,
  tillyName: 'Tilly',
  userName: 'Harriet',
}
