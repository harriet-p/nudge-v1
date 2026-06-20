import type { Ritual } from '../rituals/types'

/** Rituals a spontaneous company-seeking nudge may lead into. */
export const RANDOM_NUDGE_DESTINATIONS = [
  'outdoors',
  'water',
  'dinner',
  'stretch',
] as const

export type RandomNudgeDestination = (typeof RANDOM_NUDGE_DESTINATIONS)[number]

/** Chance that an offered nudge is spontaneous company rather than daily rhythm. */
export const RANDOM_NUDGE_CHANCE = 0.25

export function pickRandomDestination(
  available: Ritual[],
): Ritual | undefined {
  if (available.length === 0) return undefined
  return available[Math.floor(Math.random() * available.length)]
}

export function filterRandomDestinations(
  rituals: Ritual[],
  excludeIds: string[],
): Ritual[] {
  return rituals.filter(
    (ritual) =>
      (RANDOM_NUDGE_DESTINATIONS as readonly string[]).includes(ritual.id) &&
      !excludeIds.includes(ritual.id),
  )
}
