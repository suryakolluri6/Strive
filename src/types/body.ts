export type BodyPartName = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Biceps' | 'Triceps' | 'Core'

export type LevelName = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'

export interface BodyPartLevel {
  part: BodyPartName
  weight: number
  level: LevelName
}

export type BodyGraphData = Partial<Record<BodyPartName, number>>

export const LEVEL_THRESHOLDS: Record<LevelName, number> = {
  Bronze: 0,
  Silver: 5000,
  Gold: 15000,
  Platinum: 30000,
  Diamond: 50000
}

export const LEVEL_COLORS: Record<LevelName, string> = {
  Bronze: '#CD7F32',
  Silver: '#C0C0C0',
  Gold: '#FFD700',
  Platinum: '#E5E4E2',
  Diamond: '#B9F2FF'
}

export function computeLevel(weight: number): LevelName {
  if (weight >= LEVEL_THRESHOLDS.Diamond) return 'Diamond'
  if (weight >= LEVEL_THRESHOLDS.Platinum) return 'Platinum'
  if (weight >= LEVEL_THRESHOLDS.Gold) return 'Gold'
  if (weight >= LEVEL_THRESHOLDS.Silver) return 'Silver'
  return 'Bronze'
}
