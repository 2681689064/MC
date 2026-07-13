import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SortOption, ViewMode, ListingSource } from '@/types/listing'

export interface FilterState {
  district?: string
  priceMin?: number
  priceMax?: number
  roomTypes: string[]
  orientations: string[]
  subwayLine?: string
  sources: ListingSource[]
  directOnly: boolean
  sort: SortOption
  view: ViewMode
  keyword?: string
  setFilter: (patch: Partial<Omit<FilterState, 'setFilter' | 'toggleArray' | 'reset'>>) => void
  toggleArray: (key: 'roomTypes' | 'orientations' | 'sources', value: string) => void
  reset: () => void
}

const DEFAULTS = {
  district: undefined,
  priceMin: undefined,
  priceMax: undefined,
  roomTypes: [] as string[],
  orientations: [] as string[],
  subwayLine: undefined,
  sources: [] as ListingSource[],
  directOnly: false,
  sort: 'default' as SortOption,
  view: 'list' as ViewMode,
  keyword: undefined,
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setFilter: (patch) => set(patch),
      toggleArray: (key, value) =>
        set((s) => {
          const arr = s[key]
          const exists = (arr as readonly string[]).includes(value)
          const next = exists
            ? arr.filter((x) => (x as string) !== value)
            : [...arr, key === 'sources' ? (value as ListingSource) : value]
          return { [key]: next } as Pick<FilterState, typeof key>
        }),
      reset: () => set({ ...DEFAULTS }),
    }),
    { name: 'michao-filter' }
  )
)
