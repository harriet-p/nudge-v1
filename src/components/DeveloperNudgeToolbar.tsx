import { useState, type ChangeEvent } from 'react'
import { showDebugToolbar, type DevNudgeTarget } from '../config/development'
import './DeveloperNudgeToolbar.css'

interface DevNudgeOption {
  label: string
  target: DevNudgeTarget
}

const JUST_BECAUSE_OPTIONS: DevNudgeOption[] = [
  {
    label: 'Random Nudge 1',
    target: { type: 'ritual', ritualId: 'random_nudge_1' },
  },
  {
    label: 'Random Nudge 2',
    target: { type: 'ritual', ritualId: 'random_nudge_2' },
  },
]

const DAILY_RHYTHM_OPTIONS: DevNudgeOption[] = [
  { label: 'Morning', target: { type: 'morning_wakeup' } },
  { label: 'Water', target: { type: 'ritual', ritualId: 'water' } },
  { label: 'Morning Together', target: { type: 'morning_together' } },
  { label: 'Lunch', target: { type: 'ritual', ritualId: 'lunch' } },
  { label: 'Food', target: { type: 'ritual', ritualId: 'dinner' } },
  { label: 'Outdoors', target: { type: 'ritual', ritualId: 'outdoors' } },
  { label: 'Walk', target: { type: 'ritual', ritualId: 'walks' } },
  { label: 'Stretch', target: { type: 'ritual', ritualId: 'stretch' } },
  { label: 'Wind Down', target: { type: 'ritual', ritualId: 'evening' } },
  { label: 'Bedtime', target: { type: 'ritual', ritualId: 'bedtime' } },
]

function optionKey(option: DevNudgeOption): string {
  if (option.target.type !== 'ritual') return option.target.type
  return `${option.label.toLowerCase().replace(/\s+/g, '-')}-${option.target.ritualId}`
}

export interface DeveloperNudgeToolbarProps {
  onTrigger: (target: DevNudgeTarget) => void
}

export function DeveloperNudgeToolbar({ onTrigger }: DeveloperNudgeToolbarProps) {
  const [selection, setSelection] = useState('')

  if (!showDebugToolbar) return null

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    if (!value) return

    const option = [...JUST_BECAUSE_OPTIONS, ...DAILY_RHYTHM_OPTIONS].find(
      (item) => optionKey(item) === value,
    )
    if (option) {
      onTrigger(option.target)
    }

    setSelection('')
  }

  return (
    <div className="dev-nudge-toolbar" role="toolbar" aria-label="Developer nudge triggers">
      <span className="dev-nudge-toolbar__badge">DEV</span>

      <label className="dev-nudge-toolbar__field">
        <span className="dev-nudge-toolbar__label">Trigger nudge</span>
        <select
          className="dev-nudge-toolbar__select"
          value={selection}
          onChange={handleChange}
          aria-label="Select a nudge to trigger"
        >
          <option value="">Choose…</option>
          <optgroup label="Just because">
            {JUST_BECAUSE_OPTIONS.map((option) => (
              <option key={optionKey(option)} value={optionKey(option)}>
                {option.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="Daily rhythm">
            {DAILY_RHYTHM_OPTIONS.map((option) => (
              <option key={optionKey(option)} value={optionKey(option)}>
                {option.label}
              </option>
            ))}
          </optgroup>
        </select>
      </label>
    </div>
  )
}
