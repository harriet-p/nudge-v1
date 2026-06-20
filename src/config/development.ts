/** Hide the developer nudge toolbar in production builds. */
export const showDebugToolbar = import.meta.env.DEV

export type DevNudgeTarget =
  | { type: 'ritual'; ritualId: string }
  | { type: 'morning_wakeup' }
  | { type: 'morning_together' }
