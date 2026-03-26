import { create } from 'zustand'
import type { Meal, PantryIngredient, RecipeMatch, SpinFilters } from '../types'
import { loadAllRecipes } from '../data/recipes'
import { findMatchingRecipes } from '../utils/matchRecipes'

interface SpinState {
  allMeals: Meal[]
  allIngredients: string[]
  currentMatch: RecipeMatch | null
  isSpinning: boolean
  isLoading: boolean
  filters: SpinFilters
  history: string[]
  loadRecipes: () => Promise<void>
  spin: (pantryIngredients: PantryIngredient[]) => void
  setFilters: (filters: Partial<SpinFilters>) => void
  resetHistory: () => void
}

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

export const useSpinStore = create<SpinState>()((set, get) => ({
  allMeals: [],
  allIngredients: [],
  currentMatch: null,
  isSpinning: false,
  isLoading: true,
  filters: {
    cuisines: [],
    categories: [],
    maxMissing: 3,
  },
  history: [],

  loadRecipes: async () => {
    if (get().allMeals.length > 0) return
    set({ isLoading: true })
    const meals = await loadAllRecipes()
    set({
      allMeals: meals,
      allIngredients: extractIngredients(meals),
      isLoading: false,
    })
  },

  spin: (pantryIngredients: PantryIngredient[]) => {
    const { allMeals, filters, history } = get()

    set({ isSpinning: true })

    const filtersWithMaxMissing = { ...filters }
    const matches = findMatchingRecipes(allMeals, pantryIngredients, filtersWithMaxMissing)

    const fresh = matches.filter((m) => !history.includes(m.meal.id))
    const pool = fresh.length > 0 ? fresh : matches

    setTimeout(() => {
      if (pool.length === 0) {
        set({ currentMatch: null, isSpinning: false })
        return
      }

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
