import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PantryIngredient } from '../types'

interface PantryState {
  ingredients: PantryIngredient[]
  addIngredient: (name: string) => void
  removeIngredient: (name: string) => void
  toggleIngredient: (name: string) => void
  clearAll: () => void
  addCommonStaples: () => void
}

const STAPLES = ['Salt', 'Pepper', 'Olive Oil', 'Butter', 'Garlic', 'Onion', 'Sugar', 'Flour', 'Eggs', 'Milk']

export const usePantryStore = create<PantryState>()(
  persist(
    (set, get) => ({
      ingredients: [],
      addIngredient: (name: string) => {
        const existing = get().ingredients
        const lower = name.toLowerCase()
        if (existing.some((i) => i.name.toLowerCase() === lower)) return
        set({ ingredients: [...existing, { name, enabled: true }] })
      },
      removeIngredient: (name: string) => {
        set({ ingredients: get().ingredients.filter((i) => i.name !== name) })
      },
      toggleIngredient: (name: string) => {
        set({
          ingredients: get().ingredients.map((i) =>
            i.name === name ? { ...i, enabled: !i.enabled } : i
          ),
        })
      },
      clearAll: () => set({ ingredients: [] }),
      addCommonStaples: () => {
        const existing = get().ingredients
        const toAdd: PantryIngredient[] = []
        for (const s of STAPLES) {
          if (!existing.some((i) => i.name.toLowerCase() === s.toLowerCase())) {
            toAdd.push({ name: s, enabled: true })
          }
        }
        if (toAdd.length > 0) {
          set({ ingredients: [...existing, ...toAdd] })
        }
      },
    }),
    { name: 'mealspin-pantry' }
  )
)
