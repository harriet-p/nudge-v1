import { useCallback, useEffect, useState } from 'react'
import type { AnimationState } from '../types'
import {
  advanceAnimationState,
  getInitialAnimationState,
} from '../animations/stateMachine'

export function useTillyAnimation(isQuietHours: boolean) {
  const [state, setState] = useState<AnimationState>(() =>
    getInitialAnimationState(isQuietHours),
  )

  useEffect(() => {
    let timeoutId: number | undefined

    const scheduleNext = (current: AnimationState) => {
      const { state: nextState, durationMs } = advanceAnimationState(
        current,
        isQuietHours,
      )
      setState(nextState)
      timeoutId = window.setTimeout(() => scheduleNext(nextState), durationMs)
    }

    scheduleNext(state)

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuietHours])

  const nudge = useCallback((next: AnimationState) => {
    setState(next)
  }, [])

  return { state, nudge }
}
