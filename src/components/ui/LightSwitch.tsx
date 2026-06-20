import lightSwitchOff from '../../assets/sprites/light-switch-off.png'
import lightSwitchOn from '../../assets/sprites/light-switch-on.png'
import { useState } from 'react'
import { scaledSize } from '../../constants/pixelScale'
import { LIGHT_SWITCH_SPRITE_SIZE } from '../../constants/spriteSizes'
import './LightSwitch.css'

export interface LightSwitchProps {
  on: boolean
  onToggle: () => void
  /** Play a brief click animation when toggled. */
  animateClick?: boolean
}

function lightSwitchDimensions() {
  return scaledSize(
    LIGHT_SWITCH_SPRITE_SIZE.width,
    LIGHT_SWITCH_SPRITE_SIZE.height,
  )
}

export function LightSwitch({ on, onToggle, animateClick = true }: LightSwitchProps) {
  const size = lightSwitchDimensions()
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    if (animateClick) {
      setClicked(true)
      window.setTimeout(() => setClicked(false), 150)
    }
    onToggle()
  }

  return (
    <button
      type="button"
      className={`light-switch${clicked ? ' light-switch--clicked' : ''}`}
      onClick={handleClick}
      aria-label={on ? 'Turn lights off' : 'Turn lights on'}
      aria-pressed={on}
      style={{ width: size.width, height: size.height }}
    >
      <img
        className="light-switch__sprite pixel-art"
        src={on ? lightSwitchOn : lightSwitchOff}
        alt=""
        width={size.width}
        height={size.height}
        draggable={false}
        aria-hidden="true"
      />
    </button>
  )
}
