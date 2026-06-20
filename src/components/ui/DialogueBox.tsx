import type { ReactNode } from 'react'
import { SpeechBubble } from './SpeechBubble'

export type DialogueBoxVariant = 'tall' | 'short'

export interface DialogueBoxProps {
  /** @deprecated Height is now driven by content; variant is kept for API compatibility. */
  variant?: DialogueBoxVariant
  children: ReactNode
  className?: string
}

export function DialogueBox({
  children,
  className = '',
}: DialogueBoxProps) {
  return <SpeechBubble className={className}>{children}</SpeechBubble>
}
