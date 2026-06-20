import type { TillySpriteVariant } from '../components/ui/CharacterDisplay'
import { BUTTONS } from '../content/constants'
import { getDialogueVariant, pickSettlingLine } from '../content/loader'
import type { IdleMood, IdleMoodConfig } from '../interactions/idleBehaviour'
import {
  getNextMorningTogetherItem,
  MORNING_TOGETHER_ITEMS,
  MORNING_WAKEUP_STEPS,
} from '../interactions/morningSequence'
import {
  BEDTIME_LIGHT_DIALOGUE,
  BEDTIME_SEQUENCE_STEPS,
  BEDTIME_STEP_LATER_ACK,
  BEDTIME_STEP_LIGHT,
  BEDTIME_STEP_LYING,
  BEDTIME_STEP_SLEEPY,
} from '../interactions/bedtimeSequence'
import { STARTUP_AFFECTION_BEAT } from '../interactions/templates'
import { getRitualById } from '../rituals/catalog'
import type { SessionState } from '../sessions/sessionMachine'
import type { UserPreferences } from '../types'

export type ScreenButtonAction = 'accept' | 'dismiss' | 'advance'

export interface ScreenButton {
  label: string
  action: ScreenButtonAction
  variant: 'green' | 'red' | 'purple'
}

export interface ScreenDialogue {
  text: string
  variant: 'tall' | 'short'
}

export interface ScreenChecklistItem {
  id: string
  label: string
  completed: boolean
  current: boolean
}

export interface ScreenViewModel {
  phase: SessionState['phase']
  dialogue?: ScreenDialogue
  sprite: TillySpriteVariant
  buttons?: ScreenButton[]
  greetingName?: string
  showHiBaby: boolean
  idleMood?: IdleMood
  checklist?: ScreenChecklistItem[]
  showLightSwitch?: boolean
  showLightSwitchOnly?: boolean
  lightsOn?: boolean
  lightsDimming?: boolean
  darkMode?: boolean
  /** Remount key for animated sprite transitions (e.g. bedtime circling). */
  spriteKey?: string
  /** Skip room theme cross-fade (e.g. bedtime invite after night mode). */
  instantTheme?: boolean
  /** Click Tilly to play the pat effect (random nudge 2 invitation). */
  pettable?: boolean
  /** Hide Tilly sprite — play-chase celebration renders instead. */
  hideCharacter?: boolean
}

function withRoomDark(
  viewModel: ScreenViewModel,
  session: SessionState,
): ScreenViewModel {
  if (isMorningRitualSession(session) || !session.roomDark) return viewModel
  return { ...viewModel, darkMode: true }
}

function isMorningRitualSession(session: SessionState): boolean {
  if (session.activeRitualId === 'morning') return true
  if (session.interaction?.kind !== 'sequence') return false
  return (
    session.interaction.sequenceId === 'morning_wakeup' ||
    session.interaction.sequenceId === 'morning_together'
  )
}

function isBedtimeBeforeLightsOut(session: SessionState): boolean {
  return (
    session.phase === 'inviting' &&
    session.activeRitualId === 'bedtime' &&
    session.interaction?.kind === 'sequence' &&
    session.interaction.sequenceId === 'bedtime_ritual' &&
    !session.roomDark
  )
}

function spriteForBedtimeStep(
  session: SessionState,
  stepIndex: number,
  stepSprite: TillySpriteVariant,
): TillySpriteVariant {
  if (stepIndex === BEDTIME_STEP_SLEEPY) return 'sleeping'
  if (stepIndex === BEDTIME_STEP_LIGHT) return 'bedtime_light'
  if (stepIndex === BEDTIME_STEP_LYING || session.roomDark) return 'sleeping'
  return stepSprite
}

function applyLightsOutSprite(
  viewModel: ScreenViewModel,
  session: SessionState,
  nightMode: boolean,
  lightsOutActive: boolean,
): ScreenViewModel {
  if (isMorningRitualSession(session)) {
    return { ...viewModel, darkMode: false }
  }

  if (isBedtimeBeforeLightsOut(session)) {
    return {
      ...viewModel,
      darkMode: false,
      instantTheme: true,
      sprite:
        viewModel.sprite === 'resting' ? 'sleeping' : viewModel.sprite,
    }
  }

  const lightsOut = !!(lightsOutActive || session.roomDark || nightMode)
  if (!lightsOut) return viewModel
  if (viewModel.sprite === 'bedtime_circle' || viewModel.sprite === 'bedtime_light') {
    return viewModel
  }

  return {
    ...viewModel,
    sprite: 'sleeping',
    darkMode: true,
    spriteKey: viewModel.spriteKey ?? 'lights-out-sleeping',
  }
}

function mapBedtimeSequence(
  session: SessionState,
  stepIndex: number,
): ScreenViewModel {
  const step = BEDTIME_SEQUENCE_STEPS[stepIndex]
  const lightsOn =
    session.interaction?.kind === 'sequence'
      ? session.interaction.lightsOn ?? true
      : true
  const lightsDimming =
    session.interaction?.kind === 'sequence'
      ? session.interaction.lightsDimming ?? false
      : false
  const showLightSwitch =
    step.showLightSwitch && session.phase === 'inviting'
  const darkMode =
    stepIndex !== BEDTIME_STEP_LATER_ACK && !!session.roomDark
  const sprite = spriteForBedtimeStep(session, stepIndex, step.sprite)

  return {
    phase: session.phase,
    dialogue: step.dialogue ? toDialogue(step.dialogue) : undefined,
    sprite,
    buttons: step.buttons?.map((button) => ({
      label: button.label,
      action: button.action,
      variant: button.variant,
    })),
    idleMood: step.idleMood,
    showHiBaby: false,
    showLightSwitchOnly: showLightSwitch,
    lightsOn,
    lightsDimming,
    darkMode,
    spriteKey: `bedtime-${stepIndex}-${sprite}`,
  }
}

function mapBedtimeLightPrompt(session: SessionState): ScreenViewModel {
  const lightsOn =
    session.interaction?.kind === 'sequence'
      ? session.interaction.lightsOn ?? true
      : true
  const lightsDimming =
    session.interaction?.kind === 'sequence'
      ? session.interaction.lightsDimming ?? false
      : false

  return withRoomDark(
    {
      phase: session.phase,
      dialogue: toDialogue(BEDTIME_LIGHT_DIALOGUE),
      sprite: 'bedtime_light',
      showHiBaby: false,
      showLightSwitchOnly: true,
      lightsOn,
      lightsDimming,
      spriteKey: 'bedtime-light-prompt',
    },
    session,
  )
}

function toDialogue(text: string): ScreenDialogue {
  return { text, variant: getDialogueVariant(text) }
}

function spriteForRitual(ritualId?: string): TillySpriteVariant {
  if (!ritualId) return 'default'
  const ritual = getRitualById(ritualId)
  return ritual?.sprite ?? 'default'
}

function isRandomNudge2Pettable(session: SessionState): boolean {
  return (
    session.phase === 'inviting' &&
    session.activeRitualId === 'random_nudge_2'
  )
}

function ritualButtons(ritualId: string): ScreenButton[] {
  const ritual = getRitualById(ritualId)
  const buttons: ScreenButton[] = [
    {
      label: ritual?.acceptLabel ?? BUTTONS.accept,
      action: 'accept',
      variant: ritual?.acceptVariant ?? 'green',
    },
  ]

  if (ritual?.showDismiss !== false) {
    buttons.push({
      label: ritual?.dismissLabel ?? BUTTONS.dismiss,
      action: 'dismiss',
      variant: 'red',
    })
  }

  return buttons
}

function affectionButtons(): ScreenButton[] {
  const beat = STARTUP_AFFECTION_BEAT
  return (
    beat.buttons?.map((button) => ({
      label: button.label,
      action: button.action,
      variant: button.variant,
    })) ?? []
  )
}

function completionCategory(session: SessionState): string {
  if (session.interaction?.kind === 'affection') return 'cuddles'
  const ritual = getRitualById(session.activeRitualId ?? '')
  return ritual?.category ?? 'default'
}

function mapMorningWakeUp(
  session: SessionState,
  stepIndex: number,
): ScreenViewModel {
  const step = MORNING_WAKEUP_STEPS[stepIndex]
  return {
    phase: session.phase,
    dialogue: step.dialogue ? toDialogue(step.dialogue) : undefined,
    sprite: step.sprite,
    buttons: step.buttons?.map((button) => ({
      label: button.label,
      action: button.action,
      variant: button.variant,
    })),
    idleMood: step.idleMood,
    showHiBaby: false,
  }
}

function mapMorningTogether(session: SessionState): ScreenViewModel {
  const completed =
    session.interaction?.kind === 'sequence'
      ? session.interaction.checklistCompleted
      : []
  const currentItem = getNextMorningTogetherItem(completed)
  const checklist: ScreenChecklistItem[] = MORNING_TOGETHER_ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    completed: completed.includes(item.id),
    current: currentItem?.id === item.id,
  }))

  return {
    phase: session.phase,
    dialogue: session.activeDialogue
      ? toDialogue(session.activeDialogue)
      : undefined,
    sprite: currentItem?.sprite ?? 'default',
    buttons: currentItem
      ? [{ label: 'done', action: 'accept', variant: 'green' as const }]
      : undefined,
    checklist,
    showHiBaby: false,
  }
}

function mapIdlePhase(
  forceResting: boolean,
  idleMood?: IdleMoodConfig,
  roomDark = false,
  nightMode = false,
  lightsOutActive = false,
): ScreenViewModel {
  const lightsOut = roomDark || nightMode || lightsOutActive

  if (forceResting) {
    return {
      phase: 'resting',
      sprite: lightsOut ? 'sleeping' : 'resting',
      idleMood: 'sleeping',
      showHiBaby: false,
      darkMode: lightsOut,
      spriteKey: lightsOut ? 'night-sleeping' : 'quiet-resting',
    }
  }

  return {
    phase: 'idle',
    dialogue: idleMood?.dialogue ? toDialogue(idleMood.dialogue) : undefined,
    sprite: idleMood?.sprite ?? 'default',
    idleMood: idleMood?.mood,
    showHiBaby: true,
  }
}

export function mapSessionToScreen(
  session: SessionState,
  _preferences: UserPreferences,
  quietHours: boolean,
  idleMood?: IdleMoodConfig,
  nightMode = false,
  lightsOutActive = false,
): ScreenViewModel {
  let viewModel: ScreenViewModel

  switch (session.phase) {
    case 'inviting':
      if (session.interaction?.kind === 'sequence') {
        if (session.interaction.sequenceId === 'morning_wakeup') {
          viewModel = mapMorningWakeUp(session, session.interaction.stepIndex)
          break
        }
        if (session.interaction.sequenceId === 'morning_together') {
          viewModel = mapMorningTogether(session)
          break
        }
        if (session.interaction.sequenceId === 'bedtime_ritual') {
          viewModel = mapBedtimeSequence(session, session.interaction.stepIndex)
          break
        }
      }

      if (session.interaction?.kind === 'affection') {
        const beat = STARTUP_AFFECTION_BEAT
        viewModel = withRoomDark(
          {
            phase: session.phase,
            dialogue: toDialogue(session.activeDialogue ?? beat.dialogue),
            sprite: beat.sprite ?? 'default',
            buttons: affectionButtons(),
            showHiBaby: false,
          },
          session,
        )
        break
      }

      if (
        session.activeRitualId === 'bedtime' &&
        session.activeDialogue === BEDTIME_LIGHT_DIALOGUE
      ) {
        viewModel = mapBedtimeLightPrompt(session)
        break
      }

      viewModel = withRoomDark(
        {
          phase: session.phase,
          dialogue: session.activeDialogue
            ? toDialogue(session.activeDialogue)
            : undefined,
          sprite: spriteForRitual(session.activeRitualId),
          buttons: session.activeRitualId
            ? ritualButtons(session.activeRitualId)
            : undefined,
          showHiBaby: false,
          pettable: isRandomNudge2Pettable(session),
        },
        session,
      )
      break

    case 'celebrating': {
      const isPlayChase = session.activeRitualId === 'random_nudge_1'
      const category = completionCategory(session)
      const sprite =
        session.activeRitualId === 'random_nudge_2'
          ? 'default'
          : isPlayChase
            ? 'default'
            : category === 'evening'
              ? 'resting'
              : 'party'
      viewModel = withRoomDark(
        {
          phase: session.phase,
          dialogue: isPlayChase
            ? undefined
            : toDialogue(session.completionDialogue ?? 'Good job!'),
          sprite,
          showHiBaby: false,
          hideCharacter: isPlayChase,
        },
        session,
      )
      break
    }

    case 'settling': {
      const customDialogue =
        session.interaction?.kind === 'sequence'
          ? session.interaction.settlingDialogue
          : undefined
      const category = completionCategory(session)
      viewModel = withRoomDark(
        {
          phase: session.phase,
          dialogue: toDialogue(
            customDialogue ?? pickSettlingLine(category),
          ),
          sprite: 'resting',
          showHiBaby: false,
        },
        session,
      )
      break
    }

    case 'resting':
      viewModel = mapIdlePhase(
        true,
        idleMood,
        session.roomDark ?? false,
        nightMode,
        lightsOutActive,
      )
      break

    case 'idle':
    default:
      viewModel = mapIdlePhase(
        quietHours,
        idleMood,
        session.roomDark ?? false,
        nightMode,
        lightsOutActive,
      )
  }

  return applyLightsOutSprite(viewModel, session, nightMode, lightsOutActive)
}

export { completionCategory }
