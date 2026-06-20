import pat1 from '../assets/effects/pat-1.png'
import pat2 from '../assets/effects/pat-2.png'
import pat3 from '../assets/effects/pat-3.png'
import love1 from '../assets/effects/love-1.png'
import love2 from '../assets/effects/love-2.png'
import leaf1 from '../assets/effects/leaf-1.png'
import leaf2 from '../assets/effects/leaf-2.png'
import leaf3 from '../assets/effects/leaf-3.png'
import dove1 from '../assets/effects/dove-1.png'
import dove2 from '../assets/effects/dove-2.png'
import wagtail1 from '../assets/effects/wagtail-1.png'
import wagtail2 from '../assets/effects/wagtail-2.png'
import sun1 from '../assets/effects/sun-1.png'
import sun2 from '../assets/effects/sun-2.png'
import { TILLY_DISPLAY_WIDTH } from '../constants/spriteSizes'
import type { EffectDefinition, EffectId } from './types'

/** Pat PNGs include generous canvas padding — scale up so the hand reads at Tilly's size. */
const PAT_DISPLAY_WIDTH = Math.round(TILLY_DISPLAY_WIDTH * 1.5)

/** Screen-crossing birds — large enough to read, path sits below Tilly's feet. */
const SCREEN_BIRD_DISPLAY_WIDTH = Math.round(TILLY_DISPLAY_WIDTH * 0.72)

/**
 * Effect catalogue — add new entries here to register overlay animations.
 * Tilly sprites are unchanged; effects render in EffectLayer only.
 */
export const EFFECT_REGISTRY: Record<EffectId, EffectDefinition> = {
  pat: {
    id: 'pat',
    frames: [
      { src: pat1, nativeWidth: 394, nativeHeight: 410 },
      { src: pat2, nativeWidth: 394, nativeHeight: 410 },
      { src: pat3, nativeWidth: 394, nativeHeight: 410 },
    ],
    frameDurationMs: 450,
    loop: false,
    anchor: 'over',
    motion: 'pat-bob',
    displayWidth: PAT_DISPLAY_WIDTH,
    playbackDurationMs: 2400,
    alt: 'Gentle pat',
  },
  love: {
    id: 'love',
    frames: [
      { src: love1, nativeWidth: 292, nativeHeight: 330 },
      { src: love2, nativeWidth: 292, nativeHeight: 330 },
    ],
    frameDurationMs: 400,
    loop: false,
    anchor: 'above',
    motion: 'float-up',
    displayWidth: TILLY_DISPLAY_WIDTH,
    alt: 'Floating hearts',
  },
  zzz: {
    id: 'zzz',
    // TODO: add zzz-1/2/3.png frames — ZzzDrift will use them instead of text
    frames: [],
    frameDurationMs: 600,
    loop: true,
    anchor: 'above-right',
    motion: 'zzz-drift',
    displayWidth: 56,
    alt: 'Sleeping',
  },
  'dove-walk': {
    id: 'dove-walk',
    frames: [
      { src: dove1, nativeWidth: 100, nativeHeight: 100 },
      { src: dove2, nativeWidth: 100, nativeHeight: 100 },
    ],
    frameDurationMs: 220,
    loop: true,
    anchor: 'screen',
    motion: 'dove-walk',
    displayWidth: SCREEN_BIRD_DISPLAY_WIDTH,
    playbackDurationMs: 6000,
    alt: 'Dove walking',
  },
  'wagtail-jump': {
    id: 'wagtail-jump',
    frames: [
      { src: wagtail1, nativeWidth: 100, nativeHeight: 100 },
      { src: wagtail2, nativeWidth: 100, nativeHeight: 100 },
    ],
    frameDurationMs: 180,
    loop: true,
    anchor: 'screen',
    motion: 'wagtail-jump',
    displayWidth: SCREEN_BIRD_DISPLAY_WIDTH,
    playbackDurationMs: 6000,
    alt: 'Willy wagtail jumping',
  },
  'sun-shimmer': {
    id: 'sun-shimmer',
    frames: [
      { src: sun1, nativeWidth: 200, nativeHeight: 200 },
      { src: sun2, nativeWidth: 200, nativeHeight: 200 },
    ],
    frameDurationMs: 400,
    loop: true,
    anchor: 'screen',
    motion: 'sun-shimmer',
    displayWidth: 64,
    playbackDurationMs: 6000,
    alt: 'Shining sun',
  },
  'falling-leaves': {
    id: 'falling-leaves',
    frames: [
      { src: leaf1, nativeWidth: 100, nativeHeight: 100 },
      { src: leaf2, nativeWidth: 100, nativeHeight: 100 },
      { src: leaf3, nativeWidth: 100, nativeHeight: 100 },
    ],
    frameDurationMs: 400,
    loop: false,
    anchor: 'around',
    motion: 'leaf-fall',
    displayWidth: 120,
    playbackDurationMs: 6000,
    alt: 'Falling leaves',
  },
}

export function getEffectDefinition(id: EffectId): EffectDefinition {
  return EFFECT_REGISTRY[id]
}

export function getAllEffectIds(): EffectId[] {
  return Object.keys(EFFECT_REGISTRY) as EffectId[]
}
