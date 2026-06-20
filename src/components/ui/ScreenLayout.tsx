import type { ReactNode } from 'react'
import { ScreenClock } from './ScreenClock'
import './ScreenLayout.css'

export interface ScreenLayoutProps {
  children: ReactNode
  className?: string
  dark?: boolean
  /** Gentle fade while the room dims during bedtime. */
  dimming?: boolean
  /** Skip background cross-fade when switching room theme. */
  instantTheme?: boolean
}

export function ScreenLayout({
  children,
  className = '',
  dark = false,
  dimming = false,
  instantTheme = false,
}: ScreenLayoutProps) {
  const layoutClass = [
    'screen-layout',
    dark ? 'screen-layout--dark' : '',
    dimming ? 'screen-layout--dimming' : '',
    instantTheme ? 'screen-layout--instant-theme' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={layoutClass}>
      <div className="screen-layout__frame">
        <ScreenClock />
        {children}
      </div>
    </div>
  )
}
