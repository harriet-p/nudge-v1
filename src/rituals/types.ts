export type DialogueCategory =
  | 'morning'
  | 'water'
  | 'medicine'
  | 'outdoors'
  | 'walks'
  | 'dinner'
  | 'lunch'
  | 'stretch'
  | 'evening'
  | 'rest'
  | 'bedtime'
  | 'random'
  | 'cuddles'
  | 'random_affection'
  | 'encouragement'
  | 'play'
  | 'random_nudge_2'

export type RitualCategory = DialogueCategory

export type RitualSprite =
  | 'default'
  | 'drinking'
  | 'party'
  | 'resting'
  | 'sleeping'
  | 'stretch'
  | 'ear_fix'
  | 'play'

export interface Ritual {
  id: string
  category: RitualCategory
  dialogueKey: DialogueCategory
  sprite: RitualSprite
  cooldownHours?: number
  /** Green accept label — falls back to global BUTTONS.accept */
  acceptLabel?: string
  /** Accept button colour — defaults to green. */
  acceptVariant?: 'green' | 'purple'
  /** Red dismiss label — falls back to global BUTTONS.dismiss */
  dismissLabel?: string
  /** When false, hide the dismiss button on the invitation. */
  showDismiss?: boolean
}
