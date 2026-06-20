import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { getEffectDefinition } from '../effects/registry'
import type { ActiveEffect } from '../effects/types'
import { LeafFall } from '../effects/LeafFall'
import { ZzzDrift } from '../effects/ZzzDrift'
import './EffectLayer.css'

interface EffectLayerProps {
  effects: ActiveEffect[]
  className?: string
}

interface EffectSpriteProps {
  instanceId: string
  effectId: ActiveEffect['effectId']
}

function EffectSprite({ instanceId, effectId }: EffectSpriteProps) {
  const definition = getEffectDefinition(effectId)
  const [frameIndex, setFrameIndex] = useState(0)
  const isGif = definition.frames[0]?.src.endsWith('.gif')
  const frame = definition.frames[frameIndex] ?? definition.frames[0]
  const aspectRatio = frame.nativeHeight / frame.nativeWidth
  const displayWidth = definition.displayWidth
  const displayHeight = Math.round(displayWidth * aspectRatio)

  useEffect(() => {
    setFrameIndex(0)
  }, [instanceId])

  useEffect(() => {
    if (isGif || definition.frames.length <= 1) return

    const intervalId = window.setInterval(() => {
      setFrameIndex((current) => {
        const next = current + 1
        if (next >= definition.frames.length) {
          return definition.loop ? 0 : current
        }
        return next
      })
    }, definition.frameDurationMs)

    return () => window.clearInterval(intervalId)
  }, [definition, isGif, instanceId])

  const style = {
    width: displayWidth,
    height: displayHeight,
  }

  return (
    <img
      className="effect-layer__sprite pixel-art"
      src={frame.src}
      alt={definition.alt}
      style={style}
      draggable={false}
    />
  )
}

function effectPositionStyle(effect: ActiveEffect): CSSProperties | undefined {
  if (!effect.at) return undefined

  return {
    left: `${effect.at.xPercent}%`,
    top: `${effect.at.yPercent}%`,
  }
}

export function EffectLayer({ effects, className = '' }: EffectLayerProps) {
  if (effects.length === 0) return null

  return (
    <div
      className={`effect-layer ${className}`.trim()}
      aria-hidden="true"
    >
      {effects.map((effect) => {
        const definition = getEffectDefinition(effect.effectId)
        const usesAtPoint = effect.at != null
        const motionStyle: CSSProperties = {
          ...(definition.motion !== 'none' && definition.playbackDurationMs
            ? { '--effect-duration': `${definition.playbackDurationMs}ms` }
            : {}),
          ...effectPositionStyle(effect),
        }

        const motionClass =
          definition.motion !== 'none' &&
          definition.motion !== 'zzz-drift' &&
          definition.motion !== 'leaf-fall'
            ? `effect-layer__motion--${definition.motion}`
            : ''

        const content =
          definition.motion === 'zzz-drift' ? (
            <ZzzDrift
              frames={
                definition.frames.length > 0 ? definition.frames : undefined
              }
              alt={definition.alt}
            />
          ) : definition.motion === 'leaf-fall' ? (
            <LeafFall frames={definition.frames} alt={definition.alt} />
          ) : (
            <EffectSprite
              instanceId={effect.instanceId}
              effectId={effect.effectId}
            />
          )

        const sizeStyle: CSSProperties =
          definition.motion === 'leaf-fall'
            ? { width: '100%', height: '100%' }
            : {}

        const leafFallClass =
          definition.motion === 'leaf-fall' ? 'effect-layer__effect--leaf-fall' : ''
        return (
          <div
            key={effect.instanceId}
            className={[
              'effect-layer__effect',
              usesAtPoint
                ? 'effect-layer__effect--at-point'
                : `effect-layer__effect--${definition.anchor}`,
              leafFallClass,
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ ...motionStyle, ...sizeStyle }}
          >
            <div className={['effect-layer__motion', motionClass].filter(Boolean).join(' ')}>
              {content}
            </div>
          </div>
        )
      })}
    </div>
  )
}
