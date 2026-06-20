import { AFFECTION, GREETING } from '../content/constants'
import type { InteractionBeat } from './types'

/** Startup sequence — beat after the user taps Hi Baby on idle. */
export const STARTUP_AFFECTION_BEAT: InteractionBeat = {
  dialogue: AFFECTION.responseDialogue,
  sprite: 'default',
  buttons: [
    {
      label: AFFECTION.responseLabel,
      action: 'advance',
      variant: 'purple',
    },
  ],
}

export function formatIdleGreeting(userName: string): string {
  return `${GREETING.prefix} \n${userName}!`
}

/**
 * Standard ritual arc shared by reminder flows (water, rest, walks, …):
 * inviting → celebrating → settling → idle
 */
export const RITUAL_FLOW_PHASES = [
  'inviting',
  'celebrating',
  'settling',
  'idle',
] as const
