export type RitualEventType = 'invited' | 'accepted' | 'dismissed' | 'completed'

export interface RitualEvent {
  id: string
  ritualId: string
  dialogue: string
  type: RitualEventType
  at: string
}
