import type { ButtonHTMLAttributes, CSSProperties } from 'react'
import { scaledPx, scaledSize } from '../../constants/pixelScale'
import { BUTTON_SPRITE_SIZE } from '../../constants/spriteSizes'
import buttonBlue from '../../assets/sprites/button-blue.png'
import buttonGreen from '../../assets/sprites/button-green.png'
import buttonPurple from '../../assets/sprites/button-purple.png'
import buttonRed from '../../assets/sprites/button-red.png'
import './PixelButton.css'

export type PixelButtonVariant = 'green' | 'red' | 'purple'

const BUTTON_SRC: Record<PixelButtonVariant, string> = {
  green: buttonGreen,
  red: buttonRed,
  purple: buttonPurple,
}

function buttonDimensions() {
  return scaledSize(BUTTON_SPRITE_SIZE.width, BUTTON_SPRITE_SIZE.height)
}

function spriteStyle(size: { width: number; height: number }): CSSProperties {
  return {
    width: size.width,
    height: size.height,
    minWidth: size.width,
    minHeight: size.height,
  }
}

export interface PixelButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PixelButtonVariant
  pressed?: boolean
}

export function PixelButton({
  variant = 'green',
  pressed = false,
  className = '',
  children,
  type = 'button',
  style,
  ...props
}: PixelButtonProps) {
  const size = buttonDimensions()
  const imgStyle = spriteStyle(size)
  const classes = [
    'pixel-button',
    `pixel-button--${variant}`,
    pressed ? 'pixel-button--pressed' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classes}
      style={{ ...imgStyle, ...style }}
      {...props}
    >
      <img
        className="pixel-button__sprite pixel-button__sprite--rest pixel-art"
        src={BUTTON_SRC[variant]}
        alt=""
        width={size.width}
        height={size.height}
        style={imgStyle}
        draggable={false}
        aria-hidden="true"
      />
      <img
        className="pixel-button__sprite pixel-button__sprite--active pixel-art"
        src={buttonBlue}
        alt=""
        width={size.width}
        height={size.height}
        style={imgStyle}
        draggable={false}
        aria-hidden="true"
      />
      <span
        className="pixel-button__label"
        style={{
          paddingLeft: scaledPx(24),
          paddingRight: scaledPx(24),
        }}
      >
        {children}
      </span>
    </button>
  )
}
