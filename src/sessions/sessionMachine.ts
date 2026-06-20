import {
  getNextMorningTogetherItem,
  MORNING_COMPLETION_DIALOGUE,
  MORNING_TOGETHER_ITEMS,
  MORNING_WAKEUP_STEPS,
  pickMorningTogetherDialogue,
} from '../interactions/morningSequence'
import {
  BEDTIME_SEQUENCE_STEPS,
  BEDTIME_SLEEPY_DIALOGUE,
  BEDTIME_STEP_LIGHT,
  BEDTIME_STEP_LYING,
  BEDTIME_STEP_LATER_ACK,
  BEDTIME_STEP_SETTLING,
  BEDTIME_STEP_SLEEPY,
} from '../interactions/bedtimeSequence'
import type { EffectId } from '../effects/types'
import type { SessionInteraction } from '../interactions/types'

export type SessionPhase =
  | 'idle'
  | 'inviting'
  | 'celebrating'
  | 'settling'
  | 'resting'

export interface SessionState {
  phase: SessionPhase
  activeRitualId?: string
  activeDialogue?: string
  completionDialogue?: string
  celebrationEffectId?: EffectId
  interaction?: SessionInteraction
  /** Room lights out — only set when the bedtime light switch is turned off. */
  roomDark?: boolean
}

export const CELEBRATION_DURATION_MS = 2500
/** Toy throw + Tilly chase across screen (random nudge 1). */
export const PLAY_CHASE_CELEBRATION_DURATION_MS = 3400
export const SETTLING_DURATION_MS = 2000
export const EATING_FRAME_MS = 500
export const DINNER_EATING_FRAME_COUNT = 4
export const DINNER_EATING_ANIMATION_MS =
  EATING_FRAME_MS * DINNER_EATING_FRAME_COUNT
export const DINNER_CELEBRATION_DURATION_MS =
  DINNER_EATING_ANIMATION_MS + 1800
export const DINNER_COMPLETION_DIALOGUE = 'yum!'

export const FOOD_RITUAL_IDS = ['dinner', 'lunch'] as const

export function isFoodRitual(
  ritualId: string | null | undefined,
): ritualId is (typeof FOOD_RITUAL_IDS)[number] {
  return (FOOD_RITUAL_IDS as readonly string[]).includes(ritualId ?? '')
}

export function createIdleSession(): SessionState {
  return { phase: 'idle' }
}

export function createRestingSession(): SessionState {
  return { phase: 'resting' }
}

export function createNightRestingSession(): SessionState {
  return {
    phase: 'resting',
    activeRitualId: 'bedtime',
    interaction: { kind: 'ritual' },
    roomDark: true,
  }
}

export function beginInvitation(
  ritualId: string,
  dialogue: string,
): SessionState {
  return {
    phase: 'inviting',
    activeRitualId: ritualId,
    activeDialogue: dialogue,
    interaction: { kind: 'ritual' },
  }
}

function goToBedtimeStep(
  state: SessionState,
  targetStep: number,
  requiredFromStep?: number,
): SessionState {
  if (
    state.interaction?.kind !== 'sequence' ||
    state.interaction.sequenceId !== 'bedtime_ritual'
  ) {
    return state
  }

  if (
    requiredFromStep !== undefined &&
    state.interaction.stepIndex !== requiredFromStep
  ) {
    return state
  }

  const step = BEDTIME_SEQUENCE_STEPS[targetStep]
  return {
    ...state,
    activeDialogue: step.dialogue,
    interaction: {
      ...state.interaction,
      kind: 'sequence',
      sequenceId: 'bedtime_ritual',
      stepIndex: targetStep,
      lightsDimming: false,
    },
  }
}

export function beginBedtimeRitual(): SessionState {
  return {
    phase: 'inviting',
    activeRitualId: 'bedtime',
    activeDialogue: BEDTIME_SLEEPY_DIALOGUE,
    interaction: {
      kind: 'sequence',
      sequenceId: 'bedtime_ritual',
      stepIndex: BEDTIME_STEP_SLEEPY,
      checklistCompleted: [],
      lightsOn: true,
    },
  }
}

export function acceptBedtimeGoodnight(state: SessionState): SessionState {
  return goToBedtimeStep(state, BEDTIME_STEP_SETTLING, BEDTIME_STEP_SLEEPY)
}

/** After circling animation — show the light switch prompt. */
export function advanceBedtimeFromCircling(state: SessionState): SessionState {
  return goToBedtimeStep(state, BEDTIME_STEP_LIGHT, BEDTIME_STEP_SETTLING)
}

/** After the room dims — Tilly lies down (skips circling). */
export function advanceBedtimeAfterLightsDim(state: SessionState): SessionState {
  return goToBedtimeStep(state, BEDTIME_STEP_LYING, BEDTIME_STEP_LIGHT)
}

/** After lying-down beat — enter night mode. */
export function advanceBedtimeFromLying(state: SessionState): SessionState {
  if (
    state.interaction?.kind !== 'sequence' ||
    state.interaction.sequenceId !== 'bedtime_ritual' ||
    state.interaction.stepIndex !== BEDTIME_STEP_LYING
  ) {
    return state
  }

  return completeBedtimeRitual()
}

export function beginBedtimeLaterAck(state: SessionState): SessionState {
  const ackStep = BEDTIME_SEQUENCE_STEPS[BEDTIME_STEP_LATER_ACK]
  return {
    ...state,
    activeDialogue: ackStep.dialogue,
    interaction: {
      kind: 'sequence',
      sequenceId: 'bedtime_ritual',
      stepIndex: BEDTIME_STEP_LATER_ACK,
      checklistCompleted: [],
    },
  }
}

export function turnOffBedtimeLight(state: SessionState): SessionState {
  if (
    state.interaction?.kind !== 'sequence' ||
    state.interaction.sequenceId !== 'bedtime_ritual' ||
    state.interaction.stepIndex !== BEDTIME_STEP_LIGHT ||
    state.interaction.lightsOn === false
  ) {
    return state
  }

  return {
    ...state,
    roomDark: true,
    interaction: {
      ...state.interaction,
      lightsOn: false,
      lightsDimming: true,
    },
  }
}

export function advanceBedtimeSequence(state: SessionState): SessionState {
  if (
    state.interaction?.kind !== 'sequence' ||
    state.interaction.sequenceId !== 'bedtime_ritual'
  ) {
    return state
  }

  const { stepIndex } = state.interaction

  switch (stepIndex) {
    case BEDTIME_STEP_SETTLING:
      return advanceBedtimeFromCircling(state)
    case BEDTIME_STEP_LYING:
      return advanceBedtimeFromLying(state)
    case BEDTIME_STEP_LATER_ACK:
      return endSession()
    default:
      return state
  }
}

export function completeBedtimeRitual(): SessionState {
  return {
    phase: 'resting',
    activeRitualId: 'bedtime',
    interaction: { kind: 'ritual' },
    roomDark: true,
  }
}

export function beginAffectionResponse(dialogue: string): SessionState {
  return {
    phase: 'inviting',
    activeDialogue: dialogue,
    interaction: { kind: 'affection', templateId: 'startup_affection' },
  }
}

export function acceptInvitation(
  state: SessionState,
  completionDialogue: string,
  celebrationEffectId?: EffectId,
): SessionState {
  if (state.phase !== 'inviting' || !state.activeRitualId) {
    return state
  }

  return {
    phase: 'celebrating',
    activeRitualId: state.activeRitualId,
    activeDialogue: state.activeDialogue,
    completionDialogue,
    celebrationEffectId,
  }
}

export function beginCelebration(
  ritualId: string,
  invitationDialogue: string,
  completionDialogue: string,
  interaction?: SessionInteraction,
  celebrationEffectId?: EffectId,
): SessionState {
  return {
    phase: 'celebrating',
    activeRitualId: ritualId,
    activeDialogue: invitationDialogue,
    completionDialogue,
    celebrationEffectId,
    interaction,
  }
}

export function beginSettling(state: SessionState): SessionState {
  return {
    phase: 'settling',
    activeRitualId: state.activeRitualId,
    interaction: state.interaction,
  }
}

export function endSession(): SessionState {
  return createIdleSession()
}

export function beginMorningWakeUp(): SessionState {
  return {
    phase: 'inviting',
    activeRitualId: 'morning',
    roomDark: false,
    interaction: {
      kind: 'sequence',
      sequenceId: 'morning_wakeup',
      stepIndex: 0,
      checklistCompleted: [],
    },
  }
}

export function advanceMorningSequence(state: SessionState): SessionState {
  if (state.interaction?.kind !== 'sequence') return state

  if (state.interaction.sequenceId === 'morning_wakeup') {
    const nextIndex = state.interaction.stepIndex + 1
    if (nextIndex < MORNING_WAKEUP_STEPS.length) {
      return {
        ...state,
        interaction: {
          ...state.interaction,
          stepIndex: nextIndex,
        },
      }
    }

    return beginMorningTogether(state)
  }

  return state
}

export function beginMorningTogether(state: SessionState): SessionState {
  const firstItem = MORNING_TOGETHER_ITEMS[0]
  return {
    ...state,
    phase: 'inviting',
    activeRitualId: 'morning',
    activeDialogue: pickMorningTogetherDialogue(firstItem),
    interaction: {
      kind: 'sequence',
      sequenceId: 'morning_together',
      stepIndex: 0,
      checklistCompleted: [],
    },
  }
}

export function completeMorningChecklistItem(state: SessionState): SessionState {
  if (
    state.interaction?.kind !== 'sequence' ||
    state.interaction.sequenceId !== 'morning_together'
  ) {
    return state
  }

  const nextItem = getNextMorningTogetherItem(
    state.interaction.checklistCompleted,
  )
  if (!nextItem) return state

  const checklistCompleted = [
    ...state.interaction.checklistCompleted,
    nextItem.id,
  ]

  const remaining = getNextMorningTogetherItem(checklistCompleted)
  if (!remaining) {
    return beginMorningSettling(state, checklistCompleted)
  }

  return {
    ...state,
    activeDialogue: pickMorningTogetherDialogue(remaining),
    interaction: {
      ...state.interaction,
      checklistCompleted,
    },
  }
}

export function beginMorningSettling(
  _state: SessionState,
  checklistCompleted: string[],
): SessionState {
  return {
    phase: 'settling',
    activeRitualId: 'morning',
    interaction: {
      kind: 'sequence',
      sequenceId: 'morning_together',
      stepIndex: MORNING_TOGETHER_ITEMS.length,
      checklistCompleted,
      settlingDialogue: MORNING_COMPLETION_DIALOGUE,
    },
  }
}

export function isSequenceInteraction(
  interaction?: SessionInteraction,
): interaction is Extract<SessionInteraction, { kind: 'sequence' }> {
  return interaction?.kind === 'sequence'
}

export function isInteractivePhase(phase: SessionPhase): boolean {
  return phase === 'inviting'
}

export function isBusyPhase(phase: SessionPhase): boolean {
  return phase === 'celebrating' || phase === 'settling' || phase === 'inviting'
}
