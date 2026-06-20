/** @deprecated Import from `src/nudges/engine` instead. */
export {
  getMillisecondsUntilNextCheck,
  isWithinQuietHours,
  nudgeForRitual,
  selectNudge,
  selectNudge as selectRitualInvitation,
  shouldOfferNudge,
  shouldOfferNudge as shouldOfferRitual,
} from '../nudges/engine'

export type { Nudge as RitualInvitation } from '../nudges/types'
