export const BUTTON_SPRITE_SIZE = {
  width: 294,
  height: 76,
} as const

export const LIGHT_SWITCH_SPRITE_SIZE = {
  width: 200,
  height: 200,
} as const

import { scaledPx } from './pixelScale'

export const TILLY_SPRITE_SIZE = {
  default: { width: 200, height: 200 },
  breakfast: { width: 252, height: 260 },
  drinking: { width: 252, height: 264 },
  eating: { width: 252, height: 260 },
  party: { width: 200, height: 250 },
  resting: { width: 200, height: 200 },
  sleeping: { width: 200, height: 200 },
  stretch: { width: 200, height: 200 },
  harness: { width: 200, height: 200 },
  bedtime_circle: { width: 200, height: 200 },
  bedtime_light: { width: 200, height: 200 },
  bedtime_lying: { width: 200, height: 200 },
  ear_fix: { width: 200, height: 200 },
  play: { width: 200, height: 200 },
} as const

/** On-screen character size — effects should match this width. */
export const TILLY_DISPLAY_WIDTH = scaledPx(TILLY_SPRITE_SIZE.default.width)
