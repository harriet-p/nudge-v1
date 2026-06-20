import type { AnimationState } from '../types'

export interface AnimationTransition {
  next: AnimationState
  durationMs: number
}

const IDLE_POOL: AnimationState[] = ['idle', 'sitting', 'tailWag', 'earTwitch']

const TRANSITIONS: Record<AnimationState, AnimationTransition[]> = {
  idle: [
    { next: 'idle', durationMs: 4000 },
    { next: 'sitting', durationMs: 5000 },
    { next: 'tailWag', durationMs: 2500 },
    { next: 'earTwitch', durationMs: 1800 },
    { next: 'walking', durationMs: 3500 },
  ],
  sitting: [
    { next: 'sitting', durationMs: 6000 },
    { next: 'idle', durationMs: 4000 },
    { next: 'sleeping', durationMs: 8000 },
    { next: 'tailWag', durationMs: 2500 },
  ],
  sleeping: [
    { next: 'sleeping', durationMs: 10000 },
    { next: 'sitting', durationMs: 5000 },
    { next: 'idle', durationMs: 4000 },
  ],
  walking: [
    { next: 'idle', durationMs: 4000 },
    { next: 'sitting', durationMs: 5000 },
    { next: 'walking', durationMs: 3500 },
  ],
  tailWag: [
    { next: 'idle', durationMs: 4000 },
    { next: 'sitting', durationMs: 5000 },
    { next: 'tailWag', durationMs: 2500 },
  ],
  earTwitch: [
    { next: 'idle', durationMs: 4000 },
    { next: 'earTwitch', durationMs: 1800 },
    { next: 'sitting', durationMs: 5000 },
  ],
}

function pickTransition(current: AnimationState): AnimationTransition {
  const options = TRANSITIONS[current]
  return options[Math.floor(Math.random() * options.length)]
}

export function getInitialAnimationState(isQuietHours: boolean): AnimationState {
  return isQuietHours ? 'sleeping' : 'idle'
}

export function advanceAnimationState(
  current: AnimationState,
  isQuietHours: boolean,
): { state: AnimationState; durationMs: number } {
  if (isQuietHours && current !== 'sleeping' && Math.random() < 0.6) {
    return { state: 'sleeping', durationMs: 10000 }
  }

  if (!isQuietHours && current === 'sleeping') {
    return { state: 'idle', durationMs: 4000 }
  }

  const transition = pickTransition(current)
  return { state: transition.next, durationMs: transition.durationMs }
}

export function getAnimationLabel(state: AnimationState): string {
  switch (state) {
    case 'idle':
      return 'Tilly is here with you'
    case 'sitting':
      return 'Tilly is sitting nearby'
    case 'sleeping':
      return 'Tilly is resting softly'
    case 'walking':
      return 'Tilly is wandering gently'
    case 'tailWag':
      return 'Tilly wags her tail'
    case 'earTwitch':
      return 'Tilly perks an ear'
    default:
      return 'Tilly'
  }
}

export function isActiveState(state: AnimationState): boolean {
  return IDLE_POOL.includes(state) || state === 'walking'
}
