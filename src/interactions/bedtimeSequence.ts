import type { TillySpriteVariant } from '../components/ui/CharacterDisplay'
import type { InteractionButton } from './types'
import type { IdleMood } from './idleBehaviour'

export const BEDTIME_SLEEPY_DIALOGUE = "I'm getting sleepy."

export const BEDTIME_LIGHT_DIALOGUE = 'Can you turn out the light?'

export const BEDTIME_LATER_ACK_DIALOGUE = 'Okay.'

/** Smooth dim after the light switch — calm, not abrupt. */
export const BEDTIME_DIM_TRANSITION_MS = 1500

export const BEDTIME_STEP_SLEEPY = 0
export const BEDTIME_STEP_SETTLING = 1
export const BEDTIME_STEP_LIGHT = 2
export const BEDTIME_STEP_LYING = 3
export const BEDTIME_STEP_LATER_ACK = 4

export interface BedtimeSequenceStep {
  dialogue?: string
  sprite: TillySpriteVariant
  buttons?: InteractionButton[]
  showLightSwitch?: boolean
  autoAdvanceMs?: number
  idleMood?: IdleMood
}

export const BEDTIME_SEQUENCE_STEPS: BedtimeSequenceStep[] = [
  {
    dialogue: BEDTIME_SLEEPY_DIALOGUE,
    sprite: 'sleeping',
    buttons: [
      { label: 'Goodnight', action: 'accept', variant: 'green' },
      { label: 'Later', action: 'dismiss', variant: 'red' },
    ],
  },
  {
    sprite: 'bedtime_circle',
    autoAdvanceMs: 3500,
  },
  {
    dialogue: BEDTIME_LIGHT_DIALOGUE,
    sprite: 'bedtime_light',
    showLightSwitch: true,
  },
  {
    sprite: 'sleeping',
    autoAdvanceMs: 2000,
    idleMood: 'sleeping',
  },
  {
    dialogue: BEDTIME_LATER_ACK_DIALOGUE,
    sprite: 'resting',
    autoAdvanceMs: 1500,
  },
]

export function isBedtimeSequenceStep(index: number): boolean {
  return index >= BEDTIME_STEP_SLEEPY && index <= BEDTIME_STEP_LYING
}
