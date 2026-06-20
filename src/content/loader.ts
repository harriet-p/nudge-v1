import type { DialogueCategory } from '../rituals/types'
import { formatIdleGreeting } from '../interactions/templates'
import bedtime from './dialogues/bedtime.json'
import completion from './dialogues/completion.json'
import cuddles from './dialogues/cuddles.json'
import dinner from './dialogues/dinner.json'
import encouragement from './dialogues/encouragement.json'
import evening from './dialogues/evening.json'
import greetings from './dialogues/greetings.json'
import lunch from './dialogues/lunch.json'
import medicine from './dialogues/medicine.json'
import morning from './dialogues/morning.json'
import play from './dialogues/play.json'
import randomNudge2 from './dialogues/random_nudge_2.json'
import randomNudge from './dialogues/random.json'
import randomAffection from './dialogues/random-affection.json'
import rest from './dialogues/rest.json'
import settling from './dialogues/settling.json'
import restSettling from './dialogues/settling-rest.json'
import stretch from './dialogues/stretch.json'
import outdoors from './dialogues/outdoors.json'
import walks from './dialogues/walks.json'
import water from './dialogues/water.json'

const INVITATIONS: Record<DialogueCategory, string[]> = {
  morning: morning,
  water: water,
  medicine: medicine,
  outdoors: outdoors,
  walks: walks,
  dinner: dinner,
  lunch: lunch,
  stretch: stretch,
  evening: evening,
  rest: rest,
  bedtime: bedtime,
  random: randomNudge,
  cuddles: cuddles,
  random_affection: randomAffection,
  encouragement: encouragement,
  play: play,
  random_nudge_2: randomNudge2,
}

const COMPLETION_LINES: Record<string, string[]> = completion as Record<
  string,
  string[]
>

const SETTLING_LINES: Record<string, string[]> = {
  default: settling,
  rest: restSettling,
  bedtime: restSettling,
}

function pickRandom(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)]
}

/** Idle-phase greetings — personalised lines mixed with quiet hellos. */
export function pickIdleGreeting(userName: string): string {
  const pool = [
    `hi ${userName.toLowerCase()}`,
    formatIdleGreeting(userName),
    ...greetings,
  ]
  return pickRandom(pool)
}

export function pickInvitation(category: DialogueCategory): string {
  const pool = INVITATIONS[category]
  return pickRandom(pool)
}

/** @deprecated Use pickInvitation — kept for engine compatibility */
export function pickDialogue(poolKey: string): string {
  const category = poolKey as DialogueCategory
  if (category in INVITATIONS) {
    return pickInvitation(category)
  }
  return pickInvitation('random_affection')
}

export function pickCompletion(category: string): string {
  const pool =
    COMPLETION_LINES[category] ?? COMPLETION_LINES.default ?? ['Good job!']
  return pickRandom(pool)
}

export function pickSettlingLine(category = 'default'): string {
  const pool = SETTLING_LINES[category] ?? SETTLING_LINES.default
  return pickRandom(pool)
}

export function getDialogueVariant(text: string): 'tall' | 'short' {
  return text.includes('\n') || text.length > 22 ? 'tall' : 'short'
}

export function getInvitationCount(category: DialogueCategory): number {
  return INVITATIONS[category].length
}

export function getAllCategories(): DialogueCategory[] {
  return Object.keys(INVITATIONS) as DialogueCategory[]
}
