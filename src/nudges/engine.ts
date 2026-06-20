import { pickInvitation } from '../content/loader'
import { getRitualById, RITUALS } from '../rituals/catalog'
import type { Ritual } from '../rituals/types'
import {
  getLastInvitedAt,
  getMostRecentEvent,
  getMostRecentEventForRitual,
  getMostUrgentPendingPersistentRitualId,
  getPendingPersistentRitualIds,
  getRecentRitualIds,
  getRitualIdsOnCooldown,
} from '../storage/ritualEvents'
import type { UserPreferences } from '../types'
import { getRitualIdsForCurrentRhythm } from './dailyRhythm'
import {
  filterRandomDestinations,
  pickRandomDestination,
  RANDOM_NUDGE_CHANCE,
} from './randomNudges'
import {
  filterJustBecauseRituals,
  JUST_BECAUSE_NUDGE_CHANCE,
  pickJustBecauseRitual,
} from './justBecauseNudges'
import {
  getEffectiveIntervalMs,
  isWithinQuietHours,
  MAX_CHECK_INTERVAL_MS,
  MIN_CHECK_INTERVAL_MS,
  PERSISTENT_DISMISS_RETRY_MINUTES,
} from './policies'
import type { Nudge } from './types'

function buildExcludeIds(now: number, allowIds: string[] = []): string[] {
  const cooldownMap = Object.fromEntries(
    RITUALS.map((ritual) => [ritual.id, ritual.cooldownHours]),
  )
  const onCooldown = getRitualIdsOnCooldown(cooldownMap, now)
  const recentlyShown = getRecentRitualIds(6)
  const allow = new Set(allowIds)
  return [...new Set([...onCooldown, ...recentlyShown])].filter(
    (id) => !allow.has(id),
  )
}

function pickRitual(candidates: Ritual[]): Ritual | undefined {
  if (candidates.length === 0) return undefined
  return candidates[Math.floor(Math.random() * candidates.length)]
}

function selectRhythmNudge(excludeIds: string[], now: Date): Nudge | null {
  const rhythmIds = getRitualIdsForCurrentRhythm(now)
  const rhythmPool = RITUALS.filter(
    (ritual) =>
      rhythmIds.includes(ritual.id) && !excludeIds.includes(ritual.id),
  )

  const fallbackPool = RITUALS.filter((ritual) => !excludeIds.includes(ritual.id))
  const ritual = pickRitual(rhythmPool.length > 0 ? rhythmPool : fallbackPool)
  if (!ritual) return null

  return {
    dialogue: pickInvitation(ritual.dialogueKey),
    ritual,
    kind: 'daily_rhythm',
    dialogueKey: ritual.dialogueKey,
  }
}

function selectJustBecauseNudge(excludeIds: string[]): Nudge | null {
  const available = filterJustBecauseRituals(RITUALS, excludeIds)
  const ritual = pickJustBecauseRitual(available)
  if (!ritual) return null

  return {
    dialogue: pickInvitation(ritual.dialogueKey),
    ritual,
    kind: 'just_because',
    dialogueKey: ritual.dialogueKey,
  }
}

function selectRandomNudge(excludeIds: string[]): Nudge | null {
  const available = filterRandomDestinations(RITUALS, excludeIds)
  const ritual = pickRandomDestination(available)
  if (!ritual) return null

  return {
    dialogue: pickInvitation('random'),
    ritual,
    kind: 'random',
    dialogueKey: 'random',
  }
}

export function shouldOfferNudge(
  preferences: UserPreferences,
  now = new Date(),
): boolean {
  if (!preferences.nudgesEnabled) return false
  if (isWithinQuietHours(preferences, now)) return false

  const pendingId = getMostUrgentPendingPersistentRitualId()
  if (pendingId) {
    const dismissEvent = getMostRecentEventForRitual(pendingId)
    if (dismissEvent?.type === 'dismissed') {
      const retryMs = PERSISTENT_DISMISS_RETRY_MINUTES * 60 * 1000
      const elapsedMs = now.getTime() - new Date(dismissEvent.at).getTime()
      return elapsedMs >= retryMs
    }
  }

  const lastInvitedAt = getLastInvitedAt()
  if (!lastInvitedAt) return true

  const lastEvent = getMostRecentEvent()
  const intervalMs = getEffectiveIntervalMs(preferences, lastEvent)
  const elapsedMs = now.getTime() - new Date(lastInvitedAt).getTime()
  return elapsedMs >= intervalMs
}

export function selectNudge(
  preferences: UserPreferences,
  now = new Date(),
): Nudge | null {
  if (!shouldOfferNudge(preferences, now)) return null

  const pendingPersistent = getPendingPersistentRitualIds()
  const excludeIds = buildExcludeIds(now.getTime(), pendingPersistent)

  const urgentPersistentId = getMostUrgentPendingPersistentRitualId()
  if (urgentPersistentId) {
    const persistentNudge = nudgeForRitual(urgentPersistentId, 'daily_rhythm')
    if (persistentNudge) return persistentNudge
  }

  if (Math.random() < JUST_BECAUSE_NUDGE_CHANCE) {
    const justBecauseNudge = selectJustBecauseNudge(excludeIds)
    if (justBecauseNudge) return justBecauseNudge
  }

  if (Math.random() < RANDOM_NUDGE_CHANCE) {
    const randomNudge = selectRandomNudge(excludeIds)
    if (randomNudge) return randomNudge
  }

  return selectRhythmNudge(excludeIds, now)
}

export function getMillisecondsUntilNextCheck(
  preferences: UserPreferences,
): number {
  const pendingId = getMostUrgentPendingPersistentRitualId()
  if (pendingId) {
    const dismissEvent = getMostRecentEventForRitual(pendingId)
    if (dismissEvent?.type === 'dismissed') {
      const retryMs = PERSISTENT_DISMISS_RETRY_MINUTES * 60 * 1000
      const elapsed = Date.now() - new Date(dismissEvent.at).getTime()
      return Math.max(retryMs - elapsed, MIN_CHECK_INTERVAL_MS)
    }
  }

  const lastInvitedAt = getLastInvitedAt()
  const lastEvent = getMostRecentEvent()
  const intervalMs = getEffectiveIntervalMs(preferences, lastEvent)

  if (!lastInvitedAt) {
    return Math.min(intervalMs, MAX_CHECK_INTERVAL_MS)
  }

  const elapsed = Date.now() - new Date(lastInvitedAt).getTime()
  const remaining = Math.max(intervalMs - elapsed, MIN_CHECK_INTERVAL_MS)
  return Math.min(remaining, MAX_CHECK_INTERVAL_MS)
}

export { isWithinQuietHours } from './policies'

/** @deprecated Use selectNudge */
export const selectRitualInvitation = selectNudge

/** @deprecated Use shouldOfferNudge */
export const shouldOfferRitual = shouldOfferNudge

/** Resolve a ritual by id — used when extending nudges from configuration. */
export function nudgeForRitual(ritualId: string, kind: Nudge['kind'] = 'daily_rhythm'): Nudge | null {
  const ritual = getRitualById(ritualId)
  if (!ritual) return null

  return {
    dialogue: pickInvitation(ritual.dialogueKey),
    ritual,
    kind,
    dialogueKey: ritual.dialogueKey,
  }
}
