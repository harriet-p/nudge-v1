import type { Ritual } from '../rituals/types'

/** Spontaneous just-because invitations — not tied to daily rhythm needs. */
export const JUST_BECAUSE_RITUAL_IDS = ['random_nudge_1', 'random_nudge_2'] as const

export type JustBecauseRitualId = (typeof JUST_BECAUSE_RITUAL_IDS)[number]

/** Chance a nudge offer is a just-because moment rather than daily rhythm. */
export const JUST_BECAUSE_NUDGE_CHANCE = 0.15

export function filterJustBecauseRituals(
  rituals: Ritual[],
  excludeIds: string[],
): Ritual[] {
  return rituals.filter(
    (ritual) =>
      (JUST_BECAUSE_RITUAL_IDS as readonly string[]).includes(ritual.id) &&
      !excludeIds.includes(ritual.id),
  )
}

export function pickJustBecauseRitual(
  available: Ritual[],
): Ritual | undefined {
  if (available.length === 0) return undefined
  return available[Math.floor(Math.random() * available.length)]
}
