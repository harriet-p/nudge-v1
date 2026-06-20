import { useEffect, useState } from 'react'
import { pickIdleGreeting } from '../content/loader'
import { usePageVisible } from './usePageVisible'
import {
  type IdleMood,
  type IdleMoodConfig,
  pickRandomIdleMood,
} from '../interactions/idleBehaviour'

const IDLE_GREETING_CHANCE = 0.35

function withOptionalGreeting(
  config: IdleMoodConfig,
  userName: string,
): IdleMoodConfig {
  if (config.mood === 'sleeping' || config.dialogue) return config
  if (Math.random() >= IDLE_GREETING_CHANCE) return config
  return { ...config, dialogue: pickIdleGreeting(userName) }
}

export function useIdleBehaviour(active: boolean, userName: string) {
  const visible = usePageVisible()
  const [mood, setMood] = useState<IdleMoodConfig>(() =>
    withOptionalGreeting(pickRandomIdleMood(), userName),
  )

  useEffect(() => {
    if (!active || !visible) return

    let timeoutId: number | undefined

    const scheduleNext = (current: IdleMood) => {
      const next = withOptionalGreeting(pickRandomIdleMood(current), userName)
      setMood(next)
      timeoutId = window.setTimeout(() => scheduleNext(next.mood), next.durationMs)
    }

    timeoutId = window.setTimeout(() => scheduleNext(mood.mood), mood.durationMs)

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, userName, visible])

  return mood
}
