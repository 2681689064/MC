import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface HistoryState {
  ids: string[]
  push: (id: string) => void
  clear: () => void
}

const MAX_HISTORY = 50

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      ids: [],
      push: (id) =>
        set((s) => {
          const filtered = s.ids.filter((x) => x !== id)
          const next = [id, ...filtered]
          return { ids: next.length > MAX_HISTORY ? next.slice(0, MAX_HISTORY) : next }
        }),
      clear: () => set({ ids: [] }),
    }),
    { name: 'michao-history' }
  )
)
