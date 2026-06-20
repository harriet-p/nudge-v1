import { useEffect, useState, type CSSProperties } from 'react'
import type { EffectFrameSource } from './types'
import './DoveWalk.css'

interface DoveWalkProps {
  frames: EffectFrameSource[]
  frameDurationMs: number
  displayWidth: number
  playbackDurationMs: number
  alt?: string
}

export function DoveWalk({
  frames,
  frameDurationMs,
  displayWidth,
  playbackDurationMs,
  alt = 'Dove walking',
}: DoveWalkProps) {
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
      className="dove-walk"
      role="img"
      aria-label={alt}
      style={
        { '--dove-walk-duration': `${playbackDurationMs}ms` } as CSSProperties
      }
    >
      <img
        className="dove-walk__sprite pixel-art"
        src={frame.src}
        alt=""
        width={displayWidth}
        height={displayHeight}
        style={{ width: displayWidth, height: displayHeight }}
        draggable={false}
      />
    </div>
  )
}
