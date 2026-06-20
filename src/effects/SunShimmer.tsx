import { useEffect, useState, type CSSProperties } from 'react'
import type { EffectFrameSource } from './types'
import './SunShimmer.css'

interface SunShimmerProps {
  frames: EffectFrameSource[]
  frameDurationMs: number
  displayWidth: number
  playbackDurationMs: number
  alt?: string
}

export function SunShimmer({
  frames,
  frameDurationMs,
  displayWidth,
  playbackDurationMs,
  alt = 'Shining sun',
}: SunShimmerProps) {
  const [frameIndex, setFrameIndex] = useState(0)
  const frame = frames[frameIndex] ?? frames[0]
  const aspectRatio = frame.nativeHeight / frame.nativeWidth
  const displayHeight = Math.round(displayWidth * aspectRatio)

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
      className="sun-shimmer"
      style={
        {
          '--sun-shimmer-duration': `${playbackDurationMs}ms`,
        } as CSSProperties
      }
    >
      <div className="sun-shimmer__body" role="img" aria-label={alt}>
        <img
          className="sun-shimmer__sprite pixel-art"
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
