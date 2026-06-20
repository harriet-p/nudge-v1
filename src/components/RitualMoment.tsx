import type { ReactNode } from 'react'
import type { ScreenButton } from '../presentation/mapSessionToScreen'
import { DialogueBox } from './ui/DialogueBox'
import { PixelButton } from './ui/PixelButton'

interface RitualMomentProps {
  dialogue: string
  dialogueVariant: 'tall' | 'short'
  buttons: ScreenButton[]
  onAccept: () => void
  onDismiss: () => void
  aboveDialogue?: ReactNode
}

function handleButtonAction(
  button: ScreenButton,
  onAccept: () => void,
  onDismiss: () => void,
) {
  if (button.action === 'dismiss') {
    onDismiss()
    return
  }

  onAccept()
}

export function RitualMoment({
  dialogue,
  dialogueVariant,
  buttons,
  onAccept,
  onDismiss,
  aboveDialogue,
}: RitualMomentProps) {
  return (
    <>
      <div className="screen-layout__dialogue-stack">
        {aboveDialogue}
        <DialogueBox
          variant={dialogueVariant}
          className="screen-layout__dialogue screen-layout__dialogue--in-stack"
        >
          {dialogue}
        </DialogueBox>
      </div>

      <div className="screen-layout__actions">
        {buttons.map((button) => (
          <PixelButton
            key={`${button.action}-${button.label}`}
            variant={button.variant}
            onClick={() => handleButtonAction(button, onAccept, onDismiss)}
          >
            {button.label}
          </PixelButton>
        ))}
      </div>
    </>
  )
}
