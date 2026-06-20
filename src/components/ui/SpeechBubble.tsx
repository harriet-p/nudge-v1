import { useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { scaledPx } from '../../constants/pixelScale'
import bubbleLarge from '../../assets/speech-bubble/bubble-large.png'
import bubbleMedium from '../../assets/speech-bubble/bubble-medium.png'
import bubbleSmall from '../../assets/speech-bubble/bubble-small.png'
import bubbleXlarge from '../../assets/speech-bubble/bubble-xlarge.png'
import {
  pickSpeechBubbleSize,
  SPEECH_BUBBLE_LAYOUT,
  type SpeechBubbleSize,
} from './speechBubbleSize'
import './SpeechBubble.css'

export interface SpeechBubbleProps {
  children?: ReactNode
  text?: string
  className?: string
}

const BUBBLE_SRC: Record<SpeechBubbleSize, string> = {
  small: bubbleSmall,
  medium: bubbleMedium,
  large: bubbleLarge,
  xlarge: bubbleXlarge,
}

function textContent(children: ReactNode | undefined, text?: string): string {
  if (typeof text === 'string') return text
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children)
  }
  return ''
}

export function SpeechBubble({
  children,
  text,
  className = '',
}: SpeechBubbleProps) {
  const content = children ?? text
  const dialogue = useMemo(() => textContent(children, text), [children, text])
  const [size, setSize] = useState<SpeechBubbleSize>(() =>
    pickSpeechBubbleSize(dialogue),
  )

  useLayoutEffect(() => {
    setSize(pickSpeechBubbleSize(dialogue))
  }, [dialogue])

  const layout = SPEECH_BUBBLE_LAYOUT[size]
  const width = scaledPx(layout.width)
  const height = scaledPx(layout.height)

  return (
    <div
      className={`speech-bubble speech-bubble--${size} ${className}`.trim()}
      style={{ width, height }}
      role="status"
    >
      <img
        className="speech-bubble__art pixel-art"
        src={BUBBLE_SRC[size]}
        alt=""
        width={width}
        height={height}
        style={{ width, height }}
        draggable={false}
        aria-hidden="true"
      />
      <p
        className="speech-bubble__text"
        style={{
          paddingLeft: scaledPx(layout.paddingX),
          paddingRight: scaledPx(layout.paddingX),
          paddingTop: scaledPx(layout.paddingTop),
          paddingBottom: scaledPx(layout.paddingBottom),
        }}
      >
        {content}
      </p>
    </div>
  )
}
