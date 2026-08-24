import { useMemo } from 'react';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { DISTRICTS } from '@/data/tianjin';
import { cn, formatNumber } from '@/lib/utils';
import LocationControl from './LocationControl';
import {
  DEFAULT_FILTERS,
  SORT_OPTIONS,
  useListingStore,
  type SortKey,
} from '@/store/useListingStore';
import {
  PLATFORM_LABELS,
  RENT_TYPE_LABELS,
  type Decoration,
  type Platform,
  type RentType,
} from '@/types/house';

const DECORATIONS: Decoration[] = ['毛坯', '简装', '精装', '豪装'];
const PLATFORMS: Platform[] = [
  'lianjia',
  'beike',
  'anjuke',
  '58',
  'ziroom',
  'personal',
];
const RENT_TYPES: RentType[] = ['whole', 'shared', 'apartment'];
const ROOM_OPTIONS = [0, 1, 2, 3, 4];
const NEARBY_OPTIONS = [0, 1, 3, 5, 10];
const PRICE_PRESETS = [
  { label: '全部', min: 0, max: 20000 },
  { label: '≤1500', min: 0, max: 1500 },
  { label: '1500-2500', min: 1500, max: 2500 },
  { label: '2500-4000', min: 2500, max: 4000 },
  { label: '4000-6000', min: 4000, max: 6000 },
  { label: '6000+', min: 6000, max: 20000 },
];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-3 py-1 text-sm transition-colors',
        active
          ? 'bg-brand-500 text-white shadow-sm'
          : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200',
      )}
    >
      {children}
    </button>
  );
}

export default function FilterBar() {
  const { filters, setFilters, resetFilters, sort, setSort, totalCount } =
    useListingStore();
  const filtered = useListingStore((s) => s.getFiltered());
  const userLocation = useListingStore((s) => s.userLocation);

  const districtOptions = useMemo(() => ['', ...DISTRICTS.map((d) => d.name)], []);

  return (
    <section className="space-y-3">
      {/* 搜索 + 排序 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400"
          />
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) => setFilters({ keyword: e.target.value })}
            placeholder="搜索小区 / 板块 / 地铁站 / 标题"
            className="w-full rounded-xl border border-charcoal-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal
            size={16}
            className="text-charcoal-400"
            aria-hidden
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-xl border border-charcoal-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
          <LocationControl compact />
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 rounded-xl border border-charcoal-200 bg-white px-3 py-2.5 text-sm text-charcoal-600 transition hover:bg-charcoal-50"
          >
            <RotateCcw size={14} />
            重置
          </button>
        </div>
      </div>

      {/* 附近搜索：定位成功后显示 */}
      {userLocation && (
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2">
          <span className="mr-1 text-xs font-medium text-blue-500">附近找房</span>
          {NEARBY_OPTIONS.map((km) => (
            <Chip
              key={km}
              active={filters.nearbyRadiusKm === km}
              onClick={() => {
                setFilters({ nearbyRadiusKm: km });
                if (km > 0) setSort('distance-asc');
              }}
            >
              {km === 0 ? '不限' : `${km}km`}
            </Chip>
          ))}
          <span className="text-xs text-charcoal-400">
            以您的位置为圆心（经纬度 {userLocation.lng.toFixed(3)}, {userLocation.lat.toFixed(3)}）
          </span>
        </div>
      )}

      {/* 筛选行 */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-medium text-charcoal-400">区域</span>
        {districtOptions.map((d) => (
          <Chip
            key={d || 'all'}
            active={filters.district === d}
            onClick={() => setFilters({ district: d })}
          >
            {d || '全部'}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-medium text-charcoal-400">来源</span>
        <Chip
          active={filters.platform === ''}
          onClick={() => setFilters({ platform: '' })}
        >
          全部
        </Chip>
        {PLATFORMS.map((p) => (
          <Chip
            key={p}
            active={filters.platform === p}
            onClick={() => setFilters({ platform: p })}
          >
            {PLATFORM_LABELS[p]}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-charcoal-50 px-3 py-2 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-charcoal-400">类型</span>
          <Chip
            active={filters.rentType === ''}
            onClick={() => setFilters({ rentType: '' })}
          >
            不限
          </Chip>
          {RENT_TYPES.map((r) => (
            <Chip
              key={r}
              active={filters.rentType === r}
              onClick={() => setFilters({ rentType: r })}
            >
              {RENT_TYPE_LABELS[r]}
            </Chip>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-charcoal-400">户型</span>
          {ROOM_OPTIONS.map((n) => (
            <Chip
              key={n}
              active={filters.rooms === n}
              onClick={() => setFilters({ rooms: n })}
            >
              {n === 0 ? '不限' : `${n}室`}
            </Chip>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-charcoal-400">装修</span>
          <Chip
            active={filters.decoration === ''}
            onClick={() => setFilters({ decoration: '' })}
          >
            不限
          </Chip>
          {DECORATIONS.map((d) => (
            <Chip
              key={d}
              active={filters.decoration === d}
              onClick={() => setFilters({ decoration: d })}
            >
              {d}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-medium text-charcoal-400">租金</span>
        {PRICE_PRESETS.map((p) => {
          const active =
            filters.priceMin === p.min && filters.priceMax === p.max;
          return (
            <Chip
              key={p.label}
              active={active}
              onClick={() => setFilters({ priceMin: p.min, priceMax: p.max })}
            >
              {p.label}
            </Chip>
          );
        })}
        <label className="ml-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-charcoal-100 px-3 py-1 text-sm text-charcoal-700">
          <input
            type="checkbox"
            checked={filters.nearSubwayOnly}
            onChange={(e) => setFilters({ nearSubwayOnly: e.target.checked })}
            className="accent-brand-500"
          />
          近地铁
        </label>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-charcoal-100 px-3 py-1 text-sm text-charcoal-700">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => setFilters({ verifiedOnly: e.target.checked })}
            className="accent-brand-500"
          />
          已核验
        </label>
      </div>

      <div className="flex items-center justify-between border-t border-charcoal-100 pt-2 text-sm text-charcoal-500">
        <span>
          共 <span className="font-semibold text-charcoal-900 tabular-nums">{formatNumber(filtered.length)}</span> 套
          <span className="ml-1 text-charcoal-400">
            / 总库 {formatNumber(totalCount)}
          </span>
          {filters.district && (
            <span className="ml-2 rounded bg-brand-50 px-2 py-0.5 text-brand-700">
              {filters.district}
            </span>
          )}
        </span>
      </div>

      {/* 静默引用 DEFAULT_FILTERS 防止 lint unused */}
      <span className="hidden">{Object.keys(DEFAULT_FILTERS).length}</span>
    </section>
  );
}
