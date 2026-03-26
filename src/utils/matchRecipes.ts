import type { Meal, PantryIngredient, RecipeMatch, SpinFilters } from '../types'
import { ingredientMatch } from './parseIngredients'

export function matchRecipe(meal: Meal, pantryIngredients: PantryIngredient[]): RecipeMatch {
  const enabled = pantryIngredients.filter((p) => p.enabled)
  let matchCount = 0
  const missingIngredients: string[] = []

  for (const ri of meal.ingredients) {
    // Match against English ingredient name
    const ingName = ri.name['en'] || ri.name.en || ''
    const found = enabled.some((p) => ingredientMatch(p.name, ingName))
    if (found) {
      matchCount++
    } else {
      missingIngredients.push(ingName)
    }
  }

  const totalIngredients = meal.ingredients.length
  const matchPercent = totalIngredients > 0 ? Math.round((matchCount / totalIngredients) * 100) : 0

  return {
    meal,
    matchCount,
    totalIngredients,
    missingIngredients,
    matchPercent,
  }
}

export function findMatchingRecipes(
  meals: Meal[],
  pantry: PantryIngredient[],
  filters: SpinFilters,
): RecipeMatch[] {
  const results: RecipeMatch[] = []

  for (const meal of meals) {
    if (filters.cuisines.length > 0 && !filters.cuisines.includes(meal.area)) continue
    if (filters.categories.length > 0 && !filters.categories.includes(meal.category)) continue

    const match = matchRecipe(meal, pantry)
    if (match.missingIngredients.length <= filters.maxMissing) {
      results.push(match)
    }
  }

  results.sort((a, b) => b.matchPercent - a.matchPercent)
  return results
}
