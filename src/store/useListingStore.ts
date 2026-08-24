import { create } from 'zustand';
import { clamp, distanceMeters } from '@/lib/utils';
import {
  DEFAULT_LISTING_COUNT,
  getListings,
  MAX_LISTING_COUNT,
} from '@/data/generateListings';
import type { Decoration, HouseListing, Platform, RentType } from '@/types/house';

export type SortKey =
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'area-desc'
  | 'price-per-sqm-asc'
  | 'distance-asc';

/** 用户定位 */
export interface UserLocation {
  lng: number;
  lat: number;
  accuracy: number; // 精度（米）
}

export type LocationStatus = 'idle' | 'locating' | 'ok' | 'error';

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
  nearbyRadiusKm: number; // 附近搜索半径（公里），0 = 关闭
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
  nearbyRadiusKm: 0,
};

interface ListingState {
  totalCount: number;
  listings: HouseListing[];
  filters: Filters;
  sort: SortKey;
  pageSize: number;
  userLocation: UserLocation | null;
  locationStatus: LocationStatus;
  /** memoized 派生 */
  _sig: string;
  _filtered: HouseListing[];
  setTotalCount: (n: number) => void;
  setFilters: (patch: Partial<Filters>) => void;
  resetFilters: () => void;
  setSort: (s: SortKey) => void;
  setPageSize: (n: number) => void;
  /** 请求浏览器定位；成功返回位置，失败返回 null */
  requestLocation: () => Promise<UserLocation | null>;
  /** 定位失败时的降级：使用天津市中心模拟位置（标注为模拟） */
  setMockLocation: () => void;
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
    filters.nearbyRadiusKm,
    sort,
    ids,
  ].join('|');
}

export function applyFilters(
  listings: HouseListing[],
  filters: Filters,
  userLocation?: UserLocation | null,
): HouseListing[] {
  const kw = filters.keyword.trim().toLowerCase();
  const nearbyRadiusM =
    filters.nearbyRadiusKm > 0 && userLocation ? filters.nearbyRadiusKm * 1000 : 0;
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
    if (nearbyRadiusM > 0) {
      if (distanceMeters(userLocation!.lng, userLocation!.lat, l.lng, l.lat) > nearbyRadiusM)
        continue;
    }
    if (kw) {
      const hay = `${l.title} ${l.community} ${l.district} ${l.area} ${l.subwayStation}`.toLowerCase();
      if (!hay.includes(kw)) continue;
    }
    result.push(l);
  }
  return result;
}

export function applySort(
  listings: HouseListing[],
  sort: SortKey,
  userLocation?: UserLocation | null,
): HouseListing[] {
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
    case 'distance-asc': {
      if (!userLocation) return arr; // 未定位时保持原序
      const { lng, lat } = userLocation;
      // 预计算距离缓存，避免 sort 比较器内重复 haversine
      const distCache = new Map<string, number>();
      const dist = (l: HouseListing) => {
        let d = distCache.get(l.id);
        if (d === undefined) {
          d = distanceMeters(lng, lat, l.lng, l.lat);
          distCache.set(l.id, d);
        }
        return d;
      };
      return arr.sort((a, b) => dist(a) - dist(b));
    }
    case 'newest':
    default:
      return arr.sort((a, b) => b.publishedAt - a.publishedAt);
  }
}

export const useListingStore = create<ListingState>((set, get) => ({
  totalCount: DEFAULT_LISTING_COUNT,
  listings: getListings(DEFAULT_LISTING_COUNT),
  filters: { ...DEFAULT_FILTERS },
  sort: 'price-asc', // 低价房源优先展示
  pageSize: 30,
  userLocation: null,
  locationStatus: 'idle',
  _sig: '',
  _filtered: [],

  setTotalCount: (n) => {
    // 输入框可能给出 NaN（如清空/非法字符），回退到默认规模
    const safe = Number.isFinite(n) ? Math.round(n) : DEFAULT_LISTING_COUNT;
    const clamped = clamp(safe, 100, MAX_LISTING_COUNT);
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

  requestLocation: async () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      set({ locationStatus: 'error' });
      return null;
    }
    set({ locationStatus: 'locating' });
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });
      const loc: UserLocation = {
        lng: pos.coords.longitude,
        lat: pos.coords.latitude,
        accuracy: pos.coords.accuracy,
      };
      set({ userLocation: loc, locationStatus: 'ok', _sig: '' });
      return loc;
    } catch {
      set({ locationStatus: 'error' });
      return null;
    }
  },

  setMockLocation: () => {
    // 天津市中心（和平区附近），精度按市级 IP 定位近似 5km
    set({
      userLocation: { lng: 117.2145, lat: 39.1171, accuracy: 5000 },
      locationStatus: 'ok',
      _sig: '',
    });
  },

  getFiltered: () => {
    const { listings, filters, sort, userLocation, _sig, _filtered } = get();
    const sig =
      signature(filters, sort, `${listings.length}:${listings[0]?.id ?? ''}`) +
      (userLocation && (filters.nearbyRadiusKm > 0 || sort === 'distance-asc')
        ? `@${userLocation.lng.toFixed(5)},${userLocation.lat.toFixed(5)}`
        : '');
    if (sig === _sig) return _filtered;
    const filtered = applySort(
      applyFilters(listings, filters, userLocation),
      sort,
      userLocation,
    );
    set({ _sig: sig, _filtered: filtered });
    return filtered;
  },
}));

// 排序下拉的展示顺序（低价优先置顶，与默认排序一致）
export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'price-asc', label: '租金 低→高（低价优先）' },
  { key: 'distance-asc', label: '距我最近' },
  { key: 'newest', label: '最新发布' },
  { key: 'price-desc', label: '租金 高→低' },
  { key: 'area-desc', label: '面积 大→小' },
  { key: 'price-per-sqm-asc', label: '单价 低→高' },
];
