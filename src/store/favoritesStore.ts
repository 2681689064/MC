import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  ids: string[]
  toggle: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  has: (id: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => set((s) => ({
        ids: s.ids.includes(id) ? s.ids.filter(x => x !== id) : [...s.ids, id]
      })),
      remove: (id) => set((s) => ({ ids: s.ids.filter(x => x !== id) })),
      clear: () => set({ ids: [] }),
      has: (id) => get().ids.includes(id),
    }),
    { name: 'michao-favorites' }
  )
)
