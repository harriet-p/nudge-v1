import type { AnimationState } from '../types'

export interface SpritePose {
  bodyOffsetY: number
  eyeState: 'open' | 'closed' | 'blink'
  tailAngle: number
  earOffset: number
  walkPhase: number
  showZzz: boolean
}

const BASE_POSES: Record<AnimationState, SpritePose> = {
  idle: {
    bodyOffsetY: 0,
    eyeState: 'open',
    tailAngle: 0,
    earOffset: 0,
    walkPhase: 0,
    showZzz: false,
  },
  sitting: {
    bodyOffsetY: 6,
    eyeState: 'open',
    tailAngle: -8,
    earOffset: 0,
    walkPhase: 0,
    showZzz: false,
  },
  sleeping: {
    bodyOffsetY: 10,
    eyeState: 'closed',
    tailAngle: -12,
    earOffset: 0,
    walkPhase: 0,
    showZzz: true,
  },
  walking: {
    bodyOffsetY: -2,
    eyeState: 'open',
    tailAngle: 12,
    earOffset: 0,
    walkPhase: 1,
    showZzz: false,
  },
  tailWag: {
    bodyOffsetY: 0,
    eyeState: 'open',
    tailAngle: 24,
    earOffset: 0,
    walkPhase: 0,
    showZzz: false,
  },
  earTwitch: {
    bodyOffsetY: 0,
    eyeState: 'blink',
    tailAngle: 0,
    earOffset: -4,
    walkPhase: 0,
    showZzz: false,
  },
}

export function getPoseForState(state: AnimationState): SpritePose {
  return BASE_POSES[state]
}

export function getAnimationClass(state: AnimationState): string {
  return `tilly-sprite--${state}`
}
