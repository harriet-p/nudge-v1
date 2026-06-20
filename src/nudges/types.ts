import type { DialogueCategory, Ritual } from '../rituals/types'

/** How a nudge was triggered. */
export type NudgeKind = 'daily_rhythm' | 'random' | 'just_because'

/**
 * A moment where Tilly expresses her own need and invites shared action.
 *
 * Idle → notice → express need → invite → respond → shared activity → settle → idle
 */
export interface Nudge {
  dialogue: string
  /** Ritual the nudge leads into when accepted. */
  ritual: Ritual
  kind: NudgeKind
  /** Dialogue pool used (may differ from ritual.dialogueKey for random nudges). */
  dialogueKey: DialogueCategory
}

/** A time-of-day window when certain rituals are natural companions. */
export interface DailyRhythm {
  id: string
  startHour: number
  endHour: number
  ritualIds: string[]
}
