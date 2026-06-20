import type { ScreenChecklistItem } from '../presentation/mapSessionToScreen'
import './MorningChecklist.css'

interface MorningChecklistProps {
  items: ScreenChecklistItem[]
}

export function MorningChecklist({ items }: MorningChecklistProps) {
  return (
    <ul className="morning-checklist" aria-label="Our morning together">
      {items.map((item) => (
        <li
          key={item.id}
          className={[
            'morning-checklist__item',
            item.completed ? 'morning-checklist__item--done' : '',
            item.current ? 'morning-checklist__item--current' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span className="morning-checklist__box" aria-hidden="true" />
          <span className="morning-checklist__label">{item.label}</span>
        </li>
      ))}
    </ul>
  )
}
