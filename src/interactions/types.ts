import type { RitualSprite } from '../rituals/types'

export type InteractionButtonAction = 'accept' | 'dismiss' | 'advance'

export interface InteractionButton {
  label: string
  action: InteractionButtonAction
  variant: 'green' | 'red' | 'purple'
}

/** One beat in a reusable interaction sequence (dialogue → response → …). */
export interface InteractionBeat {
  dialogue: string
  sprite?: RitualSprite
  buttons?: InteractionButton[]
}

export type AffectionTemplateId = 'startup_affection'

export type MorningSequenceId = 'morning_wakeup' | 'morning_together'

export type SequenceId = MorningSequenceId | 'bedtime_ritual'

export type SessionInteraction =
  | { kind: 'ritual' }
  | { kind: 'affection'; templateId: AffectionTemplateId }
  | {
      kind: 'sequence'
      sequenceId: SequenceId
      stepIndex: number
      checklistCompleted: string[]
      settlingDialogue?: string
      lightsOn?: boolean
      lightsDimming?: boolean
    }
