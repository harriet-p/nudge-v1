import { useEffect, useState } from 'react'
import { usePageVisible } from './usePageVisible'

export function formatScreenTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function useCurrentTime(updateIntervalMs = 1000): Date {
  const visible = usePageVisible()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    if (!visible) return

    setNow(new Date())
    const intervalId = window.setInterval(() => {
      setNow(new Date())
    }, updateIntervalMs)

    return () => window.clearInterval(intervalId)
  }, [updateIntervalMs, visible])

  return now
}
