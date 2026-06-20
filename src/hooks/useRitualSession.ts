import { useCallback, useEffect, useMemo, useState } from 'react'
import { AFFECTION } from '../content/constants'
import { pickCompletion } from '../content/loader'
import {
  getCelebrationEffectDurationMs,
  pickCelebrationEffect,
} from '../effects/celebrationEffects'
import { MORNING_WAKEUP_STEPS } from '../interactions/morningSequence'
import { BEDTIME_DIM_TRANSITION_MS, BEDTIME_SEQUENCE_STEPS, BEDTIME_SLEEPY_DIALOGUE, BEDTIME_STEP_LYING, BEDTIME_STEP_LATER_ACK, BEDTIME_STEP_SETTLING, BEDTIME_STEP_SLEEPY } from '../interactions/bedtimeSequence'
import { completionCategory, mapSessionToScreen } from '../presentation/mapSessionToScreen'
import type { DevNudgeTarget } from '../config/development'
import {
  getMillisecondsUntilNextCheck,
  isWithinQuietHours,
  nudgeForRitual,
  selectNudge,
} from '../nudges/engine'
import { isMorningWindow } from '../nudges/dailyRhythm'
import { JUST_BECAUSE_RITUAL_IDS } from '../nudges/justBecauseNudges'
import {
  advanceMorningSequence,
  advanceBedtimeAfterLightsDim,
  advanceBedtimeFromCircling,
  advanceBedtimeFromLying,
  advanceBedtimeSequence,
  acceptBedtimeGoodnight,
  beginAffectionResponse,
  beginBedtimeLaterAck,
  beginBedtimeRitual,
  beginCelebration,
  beginInvitation,
  beginMorningTogether,
  beginMorningWakeUp,
  beginSettling,
  CELEBRATION_DURATION_MS,
  completeMorningChecklistItem,
  createIdleSession,
  createNightRestingSession,
  createRestingSession,
  DINNER_CELEBRATION_DURATION_MS,
  DINNER_COMPLETION_DIALOGUE,
  DINNER_EATING_ANIMATION_MS,
  endSession,
  isBusyPhase,
  isFoodRitual,
  isSequenceInteraction,
  PLAY_CHASE_CELEBRATION_DURATION_MS,
  SETTLING_DURATION_MS,
  turnOffBedtimeLight,
  type SessionState,
} from '../sessions/sessionMachine'
import { useIdleBehaviour } from './useIdleBehaviour'
import { hasCompletedMorningToday, markMorningComplete, markMorningStarted } from '../storage/morningRitual'
import { hasEnteredNightModeToday, markNightModeEntered } from '../storage/bedtimeRitual'
import { appendRitualEvent } from '../storage/ritualEvents'
import type { UserPreferences } from '../types'

function shouldOfferMorningRitual(quietHours: boolean, now = new Date()): boolean {
  return (
    !quietHours &&
    isMorningWindow(now) &&
    !hasCompletedMorningToday(now)
  )
}

function finalizeBedtimeIfNeeded(next: SessionState): SessionState {
  if (
    next.phase === 'resting' &&
    next.activeRitualId === 'bedtime' &&
    !hasEnteredNightModeToday()
  ) {
    markNightModeEntered()
    appendRitualEvent({
      ritualId: 'bedtime',
      dialogue: '',
      type: 'completed',
    })
  }
  return next
}

function createInitialSession(quietHours: boolean): SessionState {
  if (hasEnteredNightModeToday()) {
    return createNightRestingSession()
  }
  return quietHours ? createRestingSession() : createIdleSession()
}

export function useRitualSession(preferences: UserPreferences) {
  const quietHours = isWithinQuietHours(preferences)
  const nightMode = hasEnteredNightModeToday()
  const [session, setSession] = useState<SessionState>(() =>
    createInitialSession(quietHours),
  )
  const [showDinnerYum, setShowDinnerYum] = useState(false)

  const idleBehaviourActive =
    (session.phase === 'idle' || session.phase === 'resting') && !quietHours
  const idleMood = useIdleBehaviour(
    idleBehaviourActive,
    preferences.userName,
  )

  useEffect(() => {
    if (shouldOfferMorningRitual(quietHours)) return

    if (nightMode || quietHours) {
      setSession((current) => {
        if (isBusyPhase(current.phase)) return current
        if (nightMode || current.roomDark) {
          return createNightRestingSession()
        }
        return createRestingSession()
      })
      return
    }

    setSession((current) => {
      if (current.phase !== 'resting') return current
      if (current.roomDark || hasEnteredNightModeToday()) {
        return createNightRestingSession()
      }
      return createIdleSession()
    })
  }, [quietHours, nightMode])

  useEffect(() => {
    if (!shouldOfferMorningRitual(quietHours)) return

    setSession((current) => {
      if (current.phase !== 'idle' && current.phase !== 'resting') return current
      markMorningStarted()
      return beginMorningWakeUp()
    })
  }, [quietHours])

  const tryOfferNudge = useCallback(() => {
    if (quietHours || nightMode) return
    if (shouldOfferMorningRitual(quietHours)) return

    setSession((current) => {
      if (isBusyPhase(current.phase)) return current
      if (isSequenceInteraction(current.interaction)) return current

      const nudge = selectNudge(preferences)
      if (!nudge) return current

      if (nudge.ritual.id === 'bedtime') {
        appendRitualEvent({
          ritualId: 'bedtime',
          dialogue: BEDTIME_SLEEPY_DIALOGUE,
          type: 'invited',
        })
        return beginBedtimeRitual()
      }

      appendRitualEvent({
        ritualId: nudge.ritual.id,
        dialogue: nudge.dialogue,
        type: 'invited',
      })

      return beginInvitation(nudge.ritual.id, nudge.dialogue)
    })
  }, [preferences, quietHours, nightMode])

  useEffect(() => {
    if (quietHours || nightMode || isBusyPhase(session.phase)) return
    if (isSequenceInteraction(session.interaction)) return

    tryOfferNudge()

    const intervalMs = getMillisecondsUntilNextCheck(preferences)
    const intervalId = window.setInterval(tryOfferNudge, intervalMs)

    const onVisible = () => {
      if (document.visibilityState === 'visible') tryOfferNudge()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [tryOfferNudge, preferences, quietHours, nightMode, session.phase, session.interaction])

  useEffect(() => {
    if (session.phase !== 'inviting') return
    if (session.interaction?.kind !== 'sequence') return

    const { sequenceId, stepIndex } = session.interaction
    let step: { autoAdvanceMs?: number } | undefined

    if (sequenceId === 'morning_wakeup') {
      step = MORNING_WAKEUP_STEPS[stepIndex]
    } else if (sequenceId === 'bedtime_ritual') {
      step = BEDTIME_SEQUENCE_STEPS[stepIndex]
    }

    if (!step?.autoAdvanceMs) return

    const timeoutId = window.setTimeout(() => {
      setSession((current) => {
        if (sequenceId === 'morning_wakeup') {
          return advanceMorningSequence(current)
        }

        if (stepIndex === BEDTIME_STEP_SETTLING) {
          return advanceBedtimeFromCircling(current)
        }
        if (stepIndex === BEDTIME_STEP_LYING) {
          return finalizeBedtimeIfNeeded(advanceBedtimeFromLying(current))
        }
        if (stepIndex === BEDTIME_STEP_LATER_ACK) {
          return endSession()
        }

        return finalizeBedtimeIfNeeded(advanceBedtimeSequence(current))
      })
    }, step.autoAdvanceMs)

    return () => window.clearTimeout(timeoutId)
  }, [session.phase, session.interaction])

  useEffect(() => {
    if (session.interaction?.kind !== 'sequence') return
    if (session.interaction.sequenceId !== 'bedtime_ritual') return
    if (!session.interaction.lightsDimming) return

    const timeoutId = window.setTimeout(() => {
      setSession((current) =>
        finalizeBedtimeIfNeeded(advanceBedtimeAfterLightsDim(current)),
      )
    }, BEDTIME_DIM_TRANSITION_MS)

    return () => window.clearTimeout(timeoutId)
  }, [session.interaction])

  useEffect(() => {
    if (session.phase !== 'celebrating' || !isFoodRitual(session.activeRitualId)) {
      setShowDinnerYum(false)
      return
    }

    setShowDinnerYum(false)
    const yumTimeoutId = window.setTimeout(() => {
      setShowDinnerYum(true)
    }, DINNER_EATING_ANIMATION_MS)

    return () => window.clearTimeout(yumTimeoutId)
  }, [session.phase, session.activeRitualId])

  useEffect(() => {
    if (session.phase !== 'celebrating') return

    let durationMs = CELEBRATION_DURATION_MS
    if (isFoodRitual(session.activeRitualId)) {
      durationMs = DINNER_CELEBRATION_DURATION_MS
    } else if (session.activeRitualId === 'random_nudge_1') {
      durationMs = PLAY_CHASE_CELEBRATION_DURATION_MS
    } else if (session.celebrationEffectId) {
      durationMs = Math.max(
        CELEBRATION_DURATION_MS,
        getCelebrationEffectDurationMs(session.celebrationEffectId),
      )
    }

    const timeoutId = window.setTimeout(() => {
      setSession((current) => beginSettling(current))
    }, durationMs)

    return () => window.clearTimeout(timeoutId)
  }, [session.phase, session.activeRitualId, session.celebrationEffectId])

  useEffect(() => {
    if (session.phase !== 'settling') return

    const ritualId = session.activeRitualId ?? 'affection'
    const isMorningSequence =
      session.interaction?.kind === 'sequence' &&
      session.interaction.sequenceId === 'morning_together'

    const timeoutId = window.setTimeout(() => {
      if (session.interaction?.kind !== 'affection') {
        appendRitualEvent({
          ritualId,
          dialogue: '',
          type: 'completed',
        })
      }

      if (isMorningSequence) {
        markMorningComplete()
      }

      setSession(endSession())
    }, SETTLING_DURATION_MS)

    return () => window.clearTimeout(timeoutId)
  }, [session.phase, session.activeRitualId, session.interaction])

  const completeInteraction = useCallback((current: SessionState) => {
    if (current.interaction?.kind === 'sequence') {
      if (current.interaction.sequenceId === 'morning_wakeup') {
        return advanceMorningSequence(current)
      }
      if (current.interaction.sequenceId === 'morning_together') {
        const next = completeMorningChecklistItem(current)
        if (next.phase === 'inviting') {
          appendRitualEvent({
            ritualId: 'morning',
            dialogue: next.activeDialogue ?? '',
            type: 'accepted',
          })
        }
        return next
      }
      if (
        current.interaction.sequenceId === 'bedtime_ritual' &&
        current.interaction.stepIndex === BEDTIME_STEP_SLEEPY
      ) {
        appendRitualEvent({
          ritualId: 'bedtime',
          dialogue: current.activeDialogue ?? '',
          type: 'accepted',
        })
        return acceptBedtimeGoodnight(current)
      }
    }

    const category = completionCategory(current)
    const completionDialogue = isFoodRitual(current.activeRitualId)
        ? DINNER_COMPLETION_DIALOGUE
        : pickCompletion(category)

    if (current.interaction?.kind === 'affection') {
      return beginCelebration(
        'affection',
        current.activeDialogue ?? AFFECTION.responseDialogue,
        completionDialogue,
        current.interaction,
      )
    }

    if (!current.activeRitualId) return current

    appendRitualEvent({
      ritualId: current.activeRitualId,
      dialogue: current.activeDialogue ?? '',
      type: 'accepted',
    })

    const celebrationEffectId = pickCelebrationEffect(current.activeRitualId)

    return beginCelebration(
      current.activeRitualId,
      current.activeDialogue ?? '',
      completionDialogue,
      current.interaction ?? { kind: 'ritual' },
      celebrationEffectId,
    )
  }, [])

  const accept = useCallback(() => {
    setSession((current) => {
      if (current.phase !== 'inviting') return current
      return completeInteraction(current)
    })
  }, [completeInteraction])

  const connect = useCallback(() => {
    setSession((current) => {
      if (current.phase !== 'idle' || quietHours) return current
      return beginAffectionResponse(AFFECTION.responseDialogue)
    })
  }, [quietHours])

  const toggleLights = useCallback(() => {
    setSession((current) => {
      if (
        current.interaction?.kind === 'sequence' &&
        current.interaction.sequenceId === 'bedtime_ritual'
      ) {
        return turnOffBedtimeLight(current)
      }
      return current
    })
  }, [])

  const dismiss = useCallback(() => {
    setSession((current) => {
      if (current.phase !== 'inviting' || !current.activeRitualId) return current
      if (current.interaction?.kind === 'affection') return current
      if (
        current.interaction?.kind === 'sequence' &&
        current.interaction.sequenceId === 'bedtime_ritual' &&
        current.interaction.stepIndex === BEDTIME_STEP_SLEEPY
      ) {
        appendRitualEvent({
          ritualId: current.activeRitualId,
          dialogue: current.activeDialogue ?? '',
          type: 'dismissed',
        })
        return beginBedtimeLaterAck(current)
      }
      if (isSequenceInteraction(current.interaction)) return current

      appendRitualEvent({
        ritualId: current.activeRitualId,
        dialogue: current.activeDialogue ?? '',
        type: 'dismissed',
      })

      return endSession()
    })
  }, [])

  const triggerDevNudge = useCallback((target: DevNudgeTarget) => {
    setSession(() => {
      if (target.type === 'morning_wakeup') {
        markMorningStarted()
        return beginMorningWakeUp()
      }

      if (target.type === 'morning_together') {
        markMorningStarted()
        return beginMorningTogether(createIdleSession())
      }

      const kind = (JUST_BECAUSE_RITUAL_IDS as readonly string[]).includes(
        target.ritualId,
      )
        ? 'just_because'
        : 'daily_rhythm'
      const nudge = nudgeForRitual(target.ritualId, kind)
      if (!nudge) return createIdleSession()

      if (nudge.ritual.id === 'bedtime') {
        appendRitualEvent({
          ritualId: 'bedtime',
          dialogue: BEDTIME_SLEEPY_DIALOGUE,
          type: 'invited',
        })
        return beginBedtimeRitual()
      }

      appendRitualEvent({
        ritualId: nudge.ritual.id,
        dialogue: nudge.dialogue,
        type: 'invited',
      })

      return beginInvitation(nudge.ritual.id, nudge.dialogue)
    })
  }, [])

  const fixRandomNudge2Ear = useCallback(() => {
    setSession((current) => {
      if (
        current.phase !== 'inviting' ||
        current.activeRitualId !== 'random_nudge_2'
      ) {
        return current
      }
      return completeInteraction(current)
    })
  }, [completeInteraction])

  const lightsOutActive = !!session.roomDark

  const viewModel = useMemo(() => {
    const base = mapSessionToScreen(
      session,
      preferences,
      quietHours,
      idleMood,
      nightMode,
      lightsOutActive,
    )

    if (base.phase !== 'celebrating') {
      return base
    }

    if (isFoodRitual(session.activeRitualId)) {
      return {
        ...base,
        sprite: 'eating' as const,
        dialogue: showDinnerYum ? base.dialogue : undefined,
      }
    }

    if (session.activeRitualId === 'walks') {
      return {
        ...base,
        sprite: 'harness' as const,
      }
    }

    if (session.activeRitualId === 'outdoors') {
      return {
        ...base,
        sprite: 'default' as const,
      }
    }

    return base
  }, [session, preferences, quietHours, idleMood, showDinnerYum, nightMode, lightsOutActive])

  return {
    viewModel,
    session,
    quietHours,
    nightMode,
    accept,
    connect,
    dismiss,
    toggleLights,
    triggerDevNudge,
    fixRandomNudge2Ear,
  }
}
