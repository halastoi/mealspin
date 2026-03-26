import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Meal } from '../types'

interface FavoritesState {
  favorites: Meal[]
  addFavorite: (meal: Meal) => void
  removeFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (meal: Meal) => {
        if (get().favorites.some((f) => f.id === meal.id)) return
        set({ favorites: [...get().favorites, meal] })
      },
      removeFavorite: (id: string) => {
        set({ favorites: get().favorites.filter((f) => f.id !== id) })
      },
      isFavorite: (id: string) => {
        return get().favorites.some((f) => f.id === id)
      },
    }),
    { name: 'mealspin-favorites' }
  )
)
