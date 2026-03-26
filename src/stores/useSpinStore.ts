import { create } from 'zustand'
import type { Meal, PantryIngredient, RecipeMatch, SpinFilters } from '../types'
import { allRecipes } from '../data/recipes'
import { findMatchingRecipes } from '../utils/matchRecipes'

interface SpinState {
  allMeals: Meal[]
  allIngredients: string[]
  currentMatch: RecipeMatch | null
  isSpinning: boolean
  filters: SpinFilters
  history: string[]
  spin: (pantryIngredients: PantryIngredient[]) => void
  setFilters: (filters: Partial<SpinFilters>) => void
  resetHistory: () => void
}

// Extract unique ingredient names (English) from all recipes
function extractIngredients(meals: Meal[]): string[] {
  const set = new Set<string>()
  for (const meal of meals) {
    for (const ing of meal.ingredients) {
      const name = ing.name['en'] || ing.name.en
      if (name) set.add(name)
    }
  }
  return Array.from(set).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
}

const ingredientList = extractIngredients(allRecipes)

export const useSpinStore = create<SpinState>()((set, get) => ({
  allMeals: allRecipes,
  allIngredients: ingredientList,
  currentMatch: null,
  isSpinning: false,
  filters: {
    cuisines: [],
    categories: [],
    maxMissing: 3,
  },
  history: [],

  spin: (pantryIngredients: PantryIngredient[]) => {
    const { allMeals, filters, history } = get()

    set({ isSpinning: true })

    const filtersWithMaxMissing = { ...filters }
    const matches = findMatchingRecipes(allMeals, pantryIngredients, filtersWithMaxMissing)

    // Filter out history to avoid repeats
    const fresh = matches.filter((m) => !history.includes(m.meal.id))
    const pool = fresh.length > 0 ? fresh : matches

    setTimeout(() => {
      if (pool.length === 0) {
        set({ currentMatch: null, isSpinning: false })
        return
      }

      // Pick from top results with some randomness
      const topCount = Math.min(pool.length, Math.max(3, Math.floor(pool.length * 0.3)))
      const idx = Math.floor(Math.random() * topCount)
      const match = pool[idx]

      set({
        currentMatch: match,
        isSpinning: false,
        history: [...history, match.meal.id],
      })
    }, 1500)
  },

  setFilters: (partial: Partial<SpinFilters>) => {
    set({ filters: { ...get().filters, ...partial } })
  },

  resetHistory: () => set({ history: [] }),
}))
