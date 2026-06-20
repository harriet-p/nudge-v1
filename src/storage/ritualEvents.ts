import type { RitualEvent, RitualEventType } from '../sessions/types'
import { PERSISTENT_RITUAL_IDS } from '../nudges/policies'
import { readJson, writeJson } from './localStorage'

const EVENTS_KEY = 'ritual-events'
const MAX_EVENTS = 100

export function loadRitualEvents(): RitualEvent[] {
  return readJson<RitualEvent[]>(EVENTS_KEY, [])
}

export function saveRitualEvents(events: RitualEvent[]): void {
  writeJson(EVENTS_KEY, events.slice(0, MAX_EVENTS))
}

export function appendRitualEvent(
  event: Omit<RitualEvent, 'id' | 'at'> & { at?: string },
): RitualEvent[] {
  const record: RitualEvent = {
    id: crypto.randomUUID(),
    at: event.at ?? new Date().toISOString(),
    ritualId: event.ritualId,
    dialogue: event.dialogue,
    type: event.type,
  }
  const events = [record, ...loadRitualEvents()].slice(0, MAX_EVENTS)
  saveRitualEvents(events)
  return events
}

export function getLastEventOfType(type: RitualEventType): RitualEvent | undefined {
  return loadRitualEvents().find((event) => event.type === type)
}

export function getMostRecentEvent(): RitualEvent | undefined {
  return loadRitualEvents()[0]
}

export function getMostRecentEventForRitual(
  ritualId: string,
): RitualEvent | undefined {
  return loadRitualEvents().find((event) => event.ritualId === ritualId)
}

export function getPendingPersistentRitualIds(): string[] {
  return PERSISTENT_RITUAL_IDS.filter((ritualId) => {
    const latest = getMostRecentEventForRitual(ritualId)
    return latest?.type === 'dismissed'
  })
}

export function getMostUrgentPendingPersistentRitualId(): string | null {
  const pending = getPendingPersistentRitualIds()
  if (pending.length === 0) return null

  let mostRecent: RitualEvent | undefined
  let ritualId: string | null = null

  for (const id of pending) {
    const event = getMostRecentEventForRitual(id)
    if (!event) continue
    if (!mostRecent || new Date(event.at) > new Date(mostRecent.at)) {
      mostRecent = event
      ritualId = id
    }
  }

  return ritualId
}

export function getLastInvitedAt(): string | null {
  const event = loadRitualEvents().find((entry) => entry.type === 'invited')
  return event?.at ?? null
}

export function getRecentRitualIds(withinHours = 6): string[] {
  const cutoff = Date.now() - withinHours * 60 * 60 * 1000
  const seen = new Set<string>()

  for (const event of loadRitualEvents()) {
    if (new Date(event.at).getTime() <= cutoff) continue
    if (event.type === 'invited' || event.type === 'accepted') {
      seen.add(event.ritualId)
    }
  }

  return [...seen]
}

export function getRitualIdsOnCooldown(
  cooldownByRitual: Record<string, number | undefined>,
  now = Date.now(),
): string[] {
  const blocked: string[] = []

  for (const [ritualId, hours] of Object.entries(cooldownByRitual)) {
    if (!hours) continue
    const cutoff = now - hours * 60 * 60 * 1000
    const recent = loadRitualEvents().find(
      (event) =>
        event.ritualId === ritualId &&
        (event.type === 'invited' || event.type === 'accepted') &&
        new Date(event.at).getTime() > cutoff,
    )
    if (recent) blocked.push(ritualId)
  }

  return blocked
}
