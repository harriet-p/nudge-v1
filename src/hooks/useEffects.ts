import { useCallback, useEffect, useRef, useState } from 'react'
import { getEffectDefinition } from '../effects/registry'
import type { ActiveEffect, EffectId, EffectPosition } from '../effects/types'

function createInstanceId(effectId: EffectId): string {
  return `${effectId}-${crypto.randomUUID()}`
}

function getOneShotDurationMs(effectId: EffectId): number {
  const definition = getEffectDefinition(effectId)
  if (definition.playbackDurationMs) return definition.playbackDurationMs
  if (definition.loop) return 0

  const frameCount = definition.frames.length
  const isGif = definition.frames[0]?.src.endsWith('.gif')

  if (isGif) return 2000

  return frameCount * definition.frameDurationMs + (definition.motion === 'float-up' ? 1800 : 0)
}

export function useEffects() {
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([])
  const persistentRef = useRef<Set<EffectId>>(new Set())

  const removeEffect = useCallback((instanceId: string) => {
    setActiveEffects((current) =>
      current.filter((effect) => effect.instanceId !== instanceId),
    )
  }, [])

  const playEffect = useCallback(
    (
      effectId: EffectId,
      options?: { persistent?: boolean; at?: EffectPosition },
    ) => {
      const definition = getEffectDefinition(effectId)
      const persistent =
        options?.persistent ??
        (definition.loop && definition.playbackDurationMs == null)

      if (persistent) {
        if (persistentRef.current.has(effectId)) return
        persistentRef.current.add(effectId)
      }

      const instanceId = createInstanceId(effectId)
      setActiveEffects((current) => [
        ...current,
        { instanceId, effectId, at: options?.at },
      ])

      if (!persistent) {
        const durationMs = getOneShotDurationMs(effectId)
        window.setTimeout(() => removeEffect(instanceId), durationMs)
      }
    },
    [removeEffect],
  )

  const stopEffect = useCallback((effectId: EffectId) => {
    if (!persistentRef.current.has(effectId)) return

    persistentRef.current.delete(effectId)
    setActiveEffects((current) =>
      current.filter((effect) => effect.effectId !== effectId),
    )
  }, [])

  const isEffectActive = useCallback(
    (effectId: EffectId) => persistentRef.current.has(effectId),
    [],
  )

  return {
    activeEffects,
    playEffect,
    stopEffect,
    isEffectActive,
  }
}

/** Auto-manage a persistent looping effect (e.g. zzz while sleeping). */
export function usePersistentEffect(
  effectId: EffectId,
  active: boolean,
  playEffect: (id: EffectId, options?: { persistent?: boolean }) => void,
  stopEffect: (id: EffectId) => void,
) {
  useEffect(() => {
    if (active) {
      playEffect(effectId, { persistent: true })
      return
    }

    stopEffect(effectId)
  }, [active, effectId, playEffect, stopEffect])
}
