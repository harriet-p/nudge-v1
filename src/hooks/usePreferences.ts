import { useCallback, useState } from 'react'
import type { UserPreferences } from '../types'
import { loadPreferences, savePreferences } from '../storage/preferences'

export function usePreferences() {
  const [preferences, setPreferencesState] = useState<UserPreferences>(() =>
    loadPreferences(),
  )

  const updatePreferences = useCallback((patch: Partial<UserPreferences>) => {
    setPreferencesState((current) => {
      const next = { ...current, ...patch }
      savePreferences(next)
      return next
    })
  }, [])

  return { preferences, updatePreferences }
}
