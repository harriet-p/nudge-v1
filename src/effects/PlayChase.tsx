import { useEffect, useState, type CSSProperties } from 'react'
import tillyToy from '../assets/sprites/tilly-toy.png'
import tillyWalkChase1 from '../assets/sprites/tilly-walk-chase-1.png'
import tillyWalkChase2 from '../assets/sprites/tilly-walk-chase-2.png'
import tillyWalkChase3 from '../assets/sprites/tilly-walk-chase-3.png'
import tillyWalkChase4 from '../assets/sprites/tilly-walk-chase-4.png'
import { scaledPx } from '../constants/pixelScale'
import './PlayChase.css'

const WALK_FRAMES = [
  tillyWalkChase1,
  tillyWalkChase2,
  tillyWalkChase3,
  tillyWalkChase4,
] as const

const WALK_FRAME_MS = 140
/** Slightly smaller than Tilly, but still easy to read in flight. */
const TOY_DISPLAY = scaledPx(120)
const TILLY_DISPLAY = scaledPx(200)
const TOY_ARC_PEAK = scaledPx(96)

/** Toy enters shortly after celebration begins. */
export const PLAY_CHASE_TOY_DELAY_MS = 180
/** Tilly gives chase after the toy is already in flight. */
export const PLAY_CHASE_TILLY_AFTER_TOY_MS = 470
export const PLAY_CHASE_TILLY_DELAY_MS =
  PLAY_CHASE_TOY_DELAY_MS + PLAY_CHASE_TILLY_AFTER_TOY_MS
export const PLAY_CHASE_TOY_TRAVEL_MS = 1900
export const PLAY_CHASE_TILLY_TRAVEL_MS = 2700

export function PlayChase() {
  const [frameIndex, setFrameIndex] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % WALK_FRAMES.length)
    }, WALK_FRAME_MS)

    return () => window.clearInterval(intervalId)
  }, [])

  const toyTrackStyle = {
    '--play-chase-toy-width': `${TOY_DISPLAY}px`,
    '--play-chase-arc-peak': `${TOY_ARC_PEAK}px`,
    '--play-chase-delay': `${PLAY_CHASE_TOY_DELAY_MS}ms`,
    '--play-chase-duration': `${PLAY_CHASE_TOY_TRAVEL_MS}ms`,
  } as CSSProperties

  const tillyTrackStyle = {
    '--play-chase-display-width': `${TILLY_DISPLAY}px`,
    '--play-chase-delay': `${PLAY_CHASE_TILLY_DELAY_MS}ms`,
    '--play-chase-duration': `${PLAY_CHASE_TILLY_TRAVEL_MS}ms`,
  } as CSSProperties

  return (
    <div className="play-chase" role="img" aria-label="Tilly chasing her toy">
      <div className="play-chase__toy-track" style={toyTrackStyle}>
        <div className="play-chase__toy-arc">
          <img
            className="play-chase__toy pixel-art"
            src={tillyToy}
            alt=""
            width={TOY_DISPLAY}
            height={TOY_DISPLAY}
            draggable={false}
          />
        </div>
      </div>
      <div className="play-chase__tilly-track" style={tillyTrackStyle}>
        <img
          className="play-chase__tilly pixel-art"
          src={WALK_FRAMES[frameIndex]}
          alt=""
          width={TILLY_DISPLAY}
          height={TILLY_DISPLAY}
          draggable={false}
        />
      </div>
    </div>
  )
}
