import type { UserPreferences } from '../types'
import { PixelButton, ScreenClock } from './ui'
import './SettingsPanel.css'

interface SettingsPanelProps {
  open: boolean
  preferences: UserPreferences
  onClose: () => void
  onChange: (patch: Partial<UserPreferences>) => void
}

export function SettingsPanel({
  open,
  preferences,
  onClose,
  onChange,
}: SettingsPanelProps) {
  if (!open) return null

  return (
    <div className="settings-panel" role="dialog" aria-labelledby="settings-title">
      <div className="settings-panel__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="settings-panel__sheet">
        <header className="settings-panel__header">
          <ScreenClock inline />
          <h2 id="settings-title">Settings</h2>
          <PixelButton
            variant="red"
            className="settings-panel__close"
            onClick={onClose}
            aria-label="Close settings"
          >
            X
          </PixelButton>
        </header>

        <div className="settings-panel__content">
          <label className="settings-field">
            <span>Companion name</span>
            <input
              type="text"
              value={preferences.tillyName}
              maxLength={12}
              onChange={(event) => onChange({ tillyName: event.target.value || 'Tilly' })}
            />
          </label>

          <label className="settings-field">
            <span>Your name</span>
            <input
              type="text"
              value={preferences.userName}
              maxLength={12}
              onChange={(event) => onChange({ userName: event.target.value || 'Harriet' })}
            />
          </label>

          <label className="settings-field settings-field--toggle">
            <span>Tilly's nudges</span>
            <input
              type="checkbox"
              checked={preferences.nudgesEnabled}
              onChange={(event) =>
                onChange({ nudgesEnabled: event.target.checked })
              }
            />
          </label>

          <label className="settings-field">
            <span>Nudge interval (minutes)</span>
            <input
              type="number"
              min={30}
              max={480}
              step={30}
              value={preferences.nudgeIntervalMinutes}
              onChange={(event) =>
                onChange({
                  nudgeIntervalMinutes: Number(event.target.value) || 60,
                })
              }
            />
          </label>

          <div className="settings-field-group">
            <span>Quiet hours</span>
            <div className="settings-field-row">
              <label className="settings-field">
                <span>Start</span>
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={preferences.quietHoursStart}
                  onChange={(event) =>
                    onChange({ quietHoursStart: Number(event.target.value) })
                  }
                />
              </label>
              <label className="settings-field">
                <span>End</span>
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={preferences.quietHoursEnd}
                  onChange={(event) =>
                    onChange({ quietHoursEnd: Number(event.target.value) })
                  }
                />
              </label>
            </div>
          </div>

          <p className="settings-panel__note">
            Nudges are quiet invitations — never instructions. {preferences.tillyName}{' '}
            rests during quiet hours.
          </p>
        </div>
      </div>
    </div>
  )
}
