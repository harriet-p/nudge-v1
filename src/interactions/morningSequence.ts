import type { TillySpriteVariant } from '../components/ui/CharacterDisplay'
import type { InteractionButton } from './types'
import type { IdleMood } from './idleBehaviour'

export interface MorningWakeUpStep {
  dialogue?: string
  sprite: TillySpriteVariant
  buttons?: InteractionButton[]
  autoAdvanceMs?: number
  /** Placeholder mood until wake animation sprites exist. */
  idleMood?: IdleMood
}

export interface MorningTogetherItem {
  id: string
  label: string
  dialogues: readonly string[]
  sprite: TillySpriteVariant
}

function pickRandomDialogue(dialogues: readonly string[]): string {
  return dialogues[Math.floor(Math.random() * dialogues.length)]
}

export function pickMorningTogetherDialogue(item: MorningTogetherItem): string {
  return pickRandomDialogue(item.dialogues)
}

export const MORNING_COMPLETION_DIALOGUE = "That's better."

/** Slow wake → stretch → look → greet → invite to get up. */
export const MORNING_WAKEUP_STEPS: MorningWakeUpStep[] = [
  {
    sprite: 'resting',
    autoAdvanceMs: 2500,
    idleMood: 'sleeping', // TODO: tilly-waking.png
  },
  {
    sprite: 'stretch',
    autoAdvanceMs: 2800,
  },
  {
    sprite: 'default',
    autoAdvanceMs: 2000,
    idleMood: 'looking_around',
  },
  {
    dialogue: "It's morning.",
    sprite: 'default',
    idleMood: 'sitting_quietly',
    buttons: [
      { label: 'Morning Baby', action: 'advance', variant: 'purple' },
    ],
  },
  {
    dialogue: 'I think we should get up.',
    sprite: 'default',
    buttons: [{ label: 'Okay', action: 'advance', variant: 'green' }],
  },
]

export const MORNING_TOGETHER_ITEMS: MorningTogetherItem[] = [
  {
    id: 'medicine',
    label: 'medicine',
    dialogues: ["You cared for me. Look after us."],
    sprite: 'default', // TODO: tilly-medicine.png
  },
  {
    id: 'water',
    label: 'water',
    dialogues: ["I'm thirsty. Are you?"],
    sprite: 'drinking',
  },
  {
    id: 'breakfast',
    label: 'breakfast',
    dialogues: ["I'm hungry. Maybe you are too."],
    sprite: 'breakfast',
  },
  {
    id: 'sunshine',
    label: 'brush teeth',
    dialogues: [
      'Better take care of that morning breath.',
      'Time to brush your teeth.',
      "I'll have a dental stick treat!",
      'Fresh breath for a fresh morning.',
    ],
    sprite: 'default', // TODO: tilly-sunshine.png
  },
  {
    id: 'stretch',
    label: 'stretch',
    dialogues: ['I think we should stretch.'],
    sprite: 'stretch',
  },
]

export function getMorningTogetherItem(
  itemId: string,
): MorningTogetherItem | undefined {
  return MORNING_TOGETHER_ITEMS.find((item) => item.id === itemId)
}

export function getNextMorningTogetherItem(
  completedIds: string[],
): MorningTogetherItem | undefined {
  return MORNING_TOGETHER_ITEMS.find((item) => !completedIds.includes(item.id))
}
