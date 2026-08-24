import { create } from 'zustand';
import { clamp } from '@/lib/utils';
import {
  DEFAULT_LISTING_COUNT,
  generateListings,
  getListings,
} from '@/data/generateListings';
import type { Decoration, HouseListing, Platform, RentType } from '@/types/house';

export type SortKey =
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'area-desc'
  | 'price-per-sqm-asc';

export interface Filters {
  keyword: string;
  district: string; // '' = 全部
  platform: Platform | ''; // '' = 全部
  rentType: RentType | ''; // '' = 全部
  rooms: number | 0; // 0 = 不限
  priceMin: number;
  priceMax: number;
  decoration: Decoration | '';
  nearSubwayOnly: boolean;
  verifiedOnly: boolean;
}

export const DEFAULT_FILTERS: Filters = {
  keyword: '',
  district: '',
  platform: '',
  rentType: '',
  rooms: 0,
  priceMin: 0,
  priceMax: 20000,
  decoration: '',
  nearSubwayOnly: false,
  verifiedOnly: false,
};

interface ListingState {
  totalCount: number;
  listings: HouseListing[];
  filters: Filters;
  sort: SortKey;
  pageSize: number;
  /** memoized 派生 */
  _sig: string;
  _filtered: HouseListing[];
  setTotalCount: (n: number) => void;
  setFilters: (patch: Partial<Filters>) => void;
  resetFilters: () => void;
  setSort: (s: SortKey) => void;
  setPageSize: (n: number) => void;
  getFiltered: () => HouseListing[];
}

function signature(filters: Filters, sort: SortKey, ids: string): string {
  return [
    filters.keyword.trim().toLowerCase(),
    filters.district,
    filters.platform,
    filters.rentType,
    filters.rooms,
    filters.priceMin,
    filters.priceMax,
    filters.decoration,
    filters.nearSubwayOnly ? 1 : 0,
    filters.verifiedOnly ? 1 : 0,
    sort,
    ids,
  ].join('|');
}

function applyFilters(listings: HouseListing[], filters: Filters): HouseListing[] {
  const kw = filters.keyword.trim().toLowerCase();
  const result: HouseListing[] = [];
  for (const l of listings) {
    if (filters.district && l.district !== filters.district) continue;
    if (filters.platform && l.platform !== filters.platform) continue;
    if (filters.rentType && l.rentType !== filters.rentType) continue;
    if (filters.rooms && l.rooms !== filters.rooms) continue;
    if (l.price < filters.priceMin || l.price > filters.priceMax) continue;
    if (filters.decoration && l.decoration !== filters.decoration) continue;
    if (filters.nearSubwayOnly && !l.nearSubway) continue;
    if (filters.verifiedOnly && !l.isVerified) continue;
    if (kw) {
      const hay = `${l.title} ${l.community} ${l.district} ${l.area} ${l.subwayStation}`.toLowerCase();
      if (!hay.includes(kw)) continue;
    }
    result.push(l);
  }
  return result;
}

function applySort(listings: HouseListing[], sort: SortKey): HouseListing[] {
  const arr = listings.slice();
  switch (sort) {
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price);
    case 'area-desc':
      return arr.sort((a, b) => b.areaSize - a.areaSize);
    case 'price-per-sqm-asc':
      return arr.sort(
        (a, b) => a.price / a.areaSize - b.price / b.areaSize,
      );
    case 'newest':
    default:
      return arr.sort((a, b) => b.publishedAt - a.publishedAt);
  }
}

export const useListingStore = create<ListingState>((set, get) => ({
  totalCount: DEFAULT_LISTING_COUNT,
  listings: getListings(DEFAULT_LISTING_COUNT),
  filters: { ...DEFAULT_FILTERS },
  sort: 'newest',
  pageSize: 30,
  _sig: '',
  _filtered: [],

  setTotalCount: (n) => {
    const clamped = clamp(Math.round(n), 100, 20000);
    const listings = getListings(clamped);
    set({
      totalCount: clamped,
      listings,
      _sig: '',
      _filtered: [],
    });
  },
  setFilters: (patch) =>
    set((s) => ({ filters: { ...s.filters, ...patch } })),
  resetFilters: () => set({ filters: { ...DEFAULT_FILTERS } }),
  setSort: (s) => set({ sort: s }),
  setPageSize: (n) => set({ pageSize: clamp(n, 10, 200) }),

  getFiltered: () => {
    const { listings, filters, sort, _sig, _filtered } = get();
    const sig = signature(filters, sort, `${listings.length}:${listings[0]?.id ?? ''}`);
    if (sig === _sig) return _filtered;
    const filtered = applySort(applyFilters(listings, filters), sort);
    set({ _sig: sig, _filtered: filtered });
    return filtered;
  },
}));

// 暴露生成器便于重新种子化（不进 store，避免热更新时重新生成）
export const regenerateWithSeed = (count: number, seed: number) => {
  const data = generateListings({ count, seed });
  useListingStore.setState({
    totalCount: count,
    listings: data,
    _sig: '',
    _filtered: [],
  });
};
