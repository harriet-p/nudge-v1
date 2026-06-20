export type EffectId =
  | 'pat'
  | 'love'
  | 'zzz'
  | 'falling-leaves'
  | 'dove-walk'
  | 'wagtail-jump'
  | 'sun-shimmer'

/** Where the effect sits relative to Tilly's sprite bounds. */
export type EffectAnchor =
  | 'over'
  | 'around'
  | 'above'
  | 'above-close'
  | 'above-right'
  | 'screen'

export type EffectMotion =
  | 'none'
  | 'pat-bob'
  | 'float-up'
  | 'gentle-bob'
  | 'zzz-drift'
  | 'leaf-fall'
  | 'dove-walk'
  | 'wagtail-jump'
  | 'sun-shimmer'

export interface EffectFrameSource {
  /** Static PNG frame or animated GIF (loops when loop=true). */
  src: string
  nativeWidth: number
  nativeHeight: number
}

export interface EffectDefinition {
  id: EffectId
  frames: EffectFrameSource[]
  frameDurationMs: number
  loop: boolean
  anchor: EffectAnchor
  motion: EffectMotion
  /** Display width in screen pixels (height follows aspect ratio). */
  displayWidth: number
  /** Total on-screen time for one-shot effects. */
  playbackDurationMs?: number
  alt: string
}

export interface EffectPosition {
  /** 0–100, relative to the character stack bounds. */
  xPercent: number
  yPercent: number
}

export interface ActiveEffect {
  instanceId: string
  effectId: EffectId
  /** Click-relative placement for pat and future positional effects. */
  at?: EffectPosition
}
