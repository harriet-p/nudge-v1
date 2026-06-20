import { formatScreenTime, useCurrentTime } from '../../hooks/useCurrentTime'
import './ScreenClock.css'

export interface ScreenClockProps {
  /** Use in headers and panels instead of the screen overlay position. */
  inline?: boolean
  className?: string
}

export function ScreenClock({ inline = false, className = '' }: ScreenClockProps) {
  const now = useCurrentTime()
  const classes = [
    'screen-clock',
    inline ? 'screen-clock--inline' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <time className={classes} dateTime={now.toISOString()} aria-live="polite">
      {formatScreenTime(now)}
    </time>
  )
}
