import type { CSSProperties, ReactNode } from 'react'
import { getEffectDefinition } from '../effects/registry'
import { DoveWalk } from '../effects/DoveWalk'
import { SunShimmer } from '../effects/SunShimmer'
import { WillyWagtailJump } from '../effects/WillyWagtailJump'
import type { ActiveEffect, EffectDefinition } from '../effects/types'
import './ScreenEffectLayer.css'

interface ScreenEffectLayerProps {
  effects: ActiveEffect[]
}

function renderScreenEffect(
  effect: ActiveEffect,
  definition: EffectDefinition,
): ReactNode {
  const playbackDurationMs = definition.playbackDurationMs ?? 6000
  const commonProps = {
    frames: definition.frames,
    frameDurationMs: definition.frameDurationMs,
    displayWidth: definition.displayWidth,
    playbackDurationMs,
    alt: definition.alt,
  }

  switch (definition.motion) {
    case 'dove-walk':
      return (
        <div
          key={effect.instanceId}
          className="screen-effect-layer__effect"
          style={
            {
              '--dove-display-width': `${definition.displayWidth}px`,
            } as CSSProperties
          }
        >
          <DoveWalk {...commonProps} />
        </div>
      )
    case 'wagtail-jump':
      return (
        <div
          key={effect.instanceId}
          className="screen-effect-layer__effect"
          style={
            {
              '--wagtail-display-width': `${definition.displayWidth}px`,
            } as CSSProperties
          }
        >
          <WillyWagtailJump {...commonProps} />
        </div>
      )
    case 'sun-shimmer':
      return (
        <div key={effect.instanceId} className="screen-effect-layer__effect">
          <SunShimmer {...commonProps} />
        </div>
      )
    default:
      return null
  }
}

export function ScreenEffectLayer({ effects }: ScreenEffectLayerProps) {
  if (effects.length === 0) return null

  return (
    <div className="screen-effect-layer" aria-hidden="true">
      {effects.map((effect) => {
        const definition = getEffectDefinition(effect.effectId)
        if (definition.anchor !== 'screen') return null
        return renderScreenEffect(effect, definition)
      })}
    </div>
  )
}
