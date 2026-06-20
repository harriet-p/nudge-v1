import { useEffect, useState, type CSSProperties } from 'react'
import type { EffectFrameSource } from './types'
import './WillyWagtailJump.css'

interface WillyWagtailJumpProps {
  frames: EffectFrameSource[]
  frameDurationMs: number
  displayWidth: number
  playbackDurationMs: number
  alt?: string
}

export function WillyWagtailJump({
  frames,
  frameDurationMs,
  displayWidth,
  playbackDurationMs,
  alt = 'Willy wagtail jumping',
}: WillyWagtailJumpProps) {
  const [frameIndex, setFrameIndex] = useState(0)
  const frame = frames[frameIndex] ?? frames[0]
  const aspectRatio = frame.nativeHeight / frame.nativeWidth
  const displayHeight = Math.round(displayWidth * aspectRatio)
  const hopDurationMs = frameDurationMs * 2

  useEffect(() => {
    setFrameIndex(0)
  }, [frames, frameDurationMs])

  useEffect(() => {
    if (frames.length <= 1) return

    const intervalId = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % frames.length)
    }, frameDurationMs)

    return () => window.clearInterval(intervalId)
  }, [frameDurationMs, frames.length])

  return (
    <div
      className="wagtail-jump"
      role="img"
      aria-label={alt}
      style={
        {
          '--wagtail-jump-duration': `${playbackDurationMs}ms`,
          '--wagtail-hop-duration': `${hopDurationMs}ms`,
        } as CSSProperties
      }
    >
      <div className="wagtail-jump__hop">
        <img
          className="wagtail-jump__sprite pixel-art"
          src={frame.src}
          alt=""
          width={displayWidth}
          height={displayHeight}
          style={{ width: displayWidth, height: displayHeight }}
          draggable={false}
        />
      </div>
    </div>
  )
}
