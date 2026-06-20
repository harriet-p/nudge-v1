import type { MouseEvent, ReactNode } from 'react'
import type { IdleMood } from '../interactions/idleBehaviour'
import type { ActiveEffect, EffectPosition } from '../effects/types'
import type { TillySpriteVariant } from './ui/CharacterDisplay'
import { CharacterDisplay } from './ui/CharacterDisplay'
import { EffectLayer } from './EffectLayer'
import './CharacterStack.css'

export interface CharacterStackProps {
  variant: TillySpriteVariant
  idleMood?: IdleMood
  lightsOut?: boolean
  effects: ActiveEffect[]
  className?: string
  onPet?: (at: EffectPosition) => void
  pettable?: boolean
  children?: ReactNode
}

function getClickPosition(event: MouseEvent<HTMLElement>): EffectPosition {
  const rect = event.currentTarget.getBoundingClientRect()
  return {
    xPercent: ((event.clientX - rect.left) / rect.width) * 100,
    yPercent: ((event.clientY - rect.top) / rect.height) * 100,
  }
}

export function CharacterStack({
  variant,
  idleMood,
  lightsOut = false,
  effects,
  className = '',
  onPet,
  pettable = false,
}: CharacterStackProps) {
  const stackClass = [
    'character-stack',
    className,
    pettable ? 'character-stack--pettable' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const character = (
    <>
      <CharacterDisplay variant={variant} idleMood={idleMood} lightsOut={lightsOut} />
      <EffectLayer effects={effects} />
    </>
  )

  const stack =
    pettable && onPet ? (
      <button
        type="button"
        className={stackClass}
        onClick={(event) => onPet(getClickPosition(event))}
        aria-label="Pet Tilly"
      >
        {character}
      </button>
    ) : (
      <div className={stackClass}>{character}</div>
    )

  return <div className="screen-layout__character">{stack}</div>
}
