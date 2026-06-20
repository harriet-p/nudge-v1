import type { CSSProperties } from 'react'
import type { AnimationState } from '../types'
import { getAnimationClass, getPoseForState } from '../animations/frames'
import { getAnimationLabel } from '../animations/stateMachine'
import './TillySprite.css'

interface TillySpriteProps {
  state: AnimationState
  name?: string
}

export function TillySprite({ state, name = 'Tilly' }: TillySpriteProps) {
  const pose = getPoseForState(state)
  const animationClass = getAnimationClass(state)

  return (
    <div className="tilly-sprite-wrap" aria-live="polite">
      <div
        className={`tilly-sprite ${animationClass}`}
        role="img"
        aria-label={getAnimationLabel(state)}
        style={
          {
            '--body-offset-y': `${pose.bodyOffsetY}px`,
            '--tail-angle': `${pose.tailAngle}deg`,
            '--ear-offset': `${pose.earOffset}px`,
          } as CSSProperties
        }
      >
        {pose.showZzz && (
          <div className="tilly-sprite__zzz" aria-hidden="true">
            <span>z</span>
            <span>z</span>
            <span>z</span>
          </div>
        )}

        <div className="tilly-sprite__ears">
          <span className="tilly-sprite__ear tilly-sprite__ear--left" />
          <span className="tilly-sprite__ear tilly-sprite__ear--right" />
        </div>

        <div className="tilly-sprite__head">
          <span className="tilly-sprite__snout" />
          <span
            className={`tilly-sprite__eyes tilly-sprite__eyes--${pose.eyeState}`}
          >
            <span />
            <span />
          </span>
        </div>

        <div className="tilly-sprite__body" />
        <div className="tilly-sprite__tail" />
        <div className={`tilly-sprite__legs tilly-sprite__legs--phase-${pose.walkPhase}`}>
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <p className="tilly-sprite__name">{name}</p>
      <p className="tilly-sprite__status">{getAnimationLabel(state)}</p>
    </div>
  )
}
