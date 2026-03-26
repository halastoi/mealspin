import type { LocalMeal } from '../data/recipes'

export type Meal = LocalMeal

export interface PantryIngredient {
  name: string
  enabled: boolean
}

export interface SpinFilters {
  cuisines: string[]
  categories: string[]
  maxMissing: number
}

export interface RecipeMatch {
  meal: Meal
  matchCount: number
  totalIngredients: number
  missingIngredients: string[]
  matchPercent: number
}

/** Helper to get a translated string from a Record<string,string> */
export function getText(rec: Record<string, string>, lang: string): string {
  return rec[lang] ?? rec['en'] ?? ''
}
