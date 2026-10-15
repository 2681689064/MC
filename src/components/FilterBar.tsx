import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  X,
  LayoutGrid,
  Map,
  Columns2,
} from 'lucide-react';
import { DISTRICTS } from '@/data/tianjin';
import { cn, formatNumber } from '@/lib/utils';
import LocationControl from './LocationControl';
import { SORT_OPTIONS, useListingStore, type SortKey } from '@/store/useListingStore';
import {
  PLATFORM_LABELS,
  RENT_TYPE_LABELS,
  type Decoration,
  type Platform,
  type RentType,
} from '@/types/house';

/** split = 初始页同屏（列表 + 地图板块） */
export type ViewMode = 'split' | 'list' | 'map';

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
// 标点找房半径选项（与 MapView 面板保持一致；0 = 不限，保留标点但取消半径筛选）
const PIN_RADIUS_OPTIONS = [0, 1, 2, 3, 5, 10];
const PRICE_PRESETS = [
  { label: '全部', min: 0, max: 20000 },
  { label: '≤1500', min: 0, max: 1500 },
  { label: '1500-2500', min: 1500, max: 2500 },
  { label: '2500-4000', min: 2500, max: 4000 },
  { label: '4000-6000', min: 4000, max: 6000 },
  { label: '6000+', min: 6000, max: 20000 },
];
// 精简为 5 个常用档位（默认 2 万），自定义值走 footer 输入框
const COUNT_OPTIONS = [5000, 10000, 20000, 30000, 50000];
const VIEW_TABS: { key: ViewMode; label: string; icon: React.ReactNode }[] = [
  { key: 'split', label: '同屏', icon: <Columns2 size={13} /> },
  { key: 'list', label: '列表', icon: <LayoutGrid size={13} /> },
  { key: 'map', label: '地图', icon: <Map size={13} /> },
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
        // 激活态用近黑中性色，避免与品牌橙 CTA 争夺视觉焦点
        active
          ? 'bg-charcoal-900 text-white'
          : 'text-charcoal-500 hover:bg-charcoal-100 hover:text-charcoal-800',
      )}
    >
      {children}
    </button>
  );
}

export default function FilterBar({
  view,
  onViewChange,
}: {
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
}) {
  const { filters, setFilters, resetFilters, sort, setSort, totalCount, setTotalCount } =
    useListingStore();
  const filtered = useListingStore((s) => s.getFiltered());
  const userLocation = useListingStore((s) => s.userLocation);
  const mapPin = useListingStore((s) => s.mapPin);
  const clearMapPin = useListingStore((s) => s.clearMapPin);

  const districtOptions = useMemo(() => ['', ...DISTRICTS.map((d) => d.name)], []);

  // 搜索防抖：本地即时回显，200ms 后才触发全量过滤（避免每个按键都重跑过滤+图表重绘）
  const [keywordDraft, setKeywordDraft] = useState(filters.keyword);
  useEffect(() => setKeywordDraft(filters.keyword), [filters.keyword]);
  useEffect(() => {
    if (keywordDraft === filters.keyword) return;
    const t = setTimeout(() => setFilters({ keyword: keywordDraft }), 200);
    return () => clearTimeout(t);
  }, [keywordDraft, filters.keyword, setFilters]);

  return (
    /* 单张筛选面板：搜索、条件、结果统计收拢在同一容器内，
       替代原先「工具栏卡 + 散浮 chips」的多层堆叠 */
    <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
      {/* 搜索 + 排序 + 定位 + 重置 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400"
          />
          <input
            type="text"
            value={keywordDraft}
            onChange={(e) => setKeywordDraft(e.target.value)}
            placeholder="搜索小区 / 板块 / 地铁站 / 标题"
            className="h-10 w-full rounded-xl bg-charcoal-50 pl-10 pr-3 text-sm outline-none transition placeholder:text-charcoal-400 focus:bg-white focus:ring-2 focus:ring-brand-200"
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
            className="h-10 rounded-xl bg-charcoal-50 px-3 text-sm text-charcoal-600 outline-none transition hover:bg-charcoal-100 focus:ring-2 focus:ring-brand-200"
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
            title="重置筛选条件"
            className="inline-flex h-10 items-center gap-1 rounded-xl bg-charcoal-50 px-3 text-sm text-charcoal-600 transition hover:bg-charcoal-100"
          >
            <RotateCcw size={14} />
            重置
          </button>
        </div>
      </div>

      {/* 标点找房：地图标点存在时显示（优先于定位锚点） */}
      {mapPin && (
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-brand-50 px-3 py-2">
          <span className="mr-1 text-xs font-medium text-brand-600">标点找房</span>
          {PIN_RADIUS_OPTIONS.map((km) => (
            <Chip
              key={km}
              active={filters.nearbyRadiusKm === km}
              onClick={() => setFilters({ nearbyRadiusKm: km })}
            >
              {km === 0 ? '不限' : `${km}km`}
            </Chip>
          ))}
          <span className="text-xs text-charcoal-400">
            {filters.nearbyRadiusKm > 0
              ? `以地图标点为圆心 ${filters.nearbyRadiusKm}km（经纬度 ${mapPin.lng.toFixed(3)}, ${mapPin.lat.toFixed(3)}）`
              : `标点 ${mapPin.lng.toFixed(3)}, ${mapPin.lat.toFixed(3)}（半径不限）`}{' '}
            · {formatNumber(filtered.length)} 套
          </span>
          <button
            type="button"
            onClick={clearMapPin}
            className="ml-auto inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs text-charcoal-500 transition hover:text-red-500"
          >
            <X size={12} />
            清除标点
          </button>
        </div>
      )}

      {/* 附近搜索：定位成功且无标点时显示 */}
      {!mapPin && userLocation && (
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2">
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

      {/* 类型/户型/装修：扁平化单行流式布局，chips 逐个换行填满行宽 */}
      <div className="flex flex-wrap items-center gap-1.5 text-sm">
        <span className="mr-0.5 text-xs font-medium text-charcoal-400">类型</span>
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

        <span className="ml-2 mr-0.5 text-xs font-medium text-charcoal-400">户型</span>
        {ROOM_OPTIONS.map((n) => (
          <Chip
            key={n}
            active={filters.rooms === n}
            onClick={() => setFilters({ rooms: n })}
          >
            {n === 0 ? '不限' : `${n}室`}
          </Chip>
        ))}

        <span className="ml-2 mr-0.5 text-xs font-medium text-charcoal-400">装修</span>
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
        <label className="ml-2 inline-flex cursor-pointer items-center gap-1.5 text-sm text-charcoal-600">
          <input
            type="checkbox"
            checked={filters.nearSubwayOnly}
            onChange={(e) => setFilters({ nearSubwayOnly: e.target.checked })}
            className="accent-brand-500"
          />
          近地铁
        </label>
        <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-charcoal-600">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => setFilters({ verifiedOnly: e.target.checked })}
            className="accent-brand-500"
          />
          已核验
        </label>
      </div>

      {/* 面板 footer：结果统计 + 数据规模（演示控制，视觉降级）+ 视图切换 */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-charcoal-100 pt-2.5 text-sm text-charcoal-500">
        <span className="flex items-center">
          共{' '}
          <span className="mx-0.5 font-semibold tabular-nums text-charcoal-900">
            {formatNumber(filtered.length)}
          </span>{' '}
          套
          <span className="mx-1 text-charcoal-300">/</span>
          总库
          <select
            value={COUNT_OPTIONS.includes(totalCount) ? totalCount : 'custom'}
            onChange={(e) => {
              if (e.target.value !== 'custom') setTotalCount(Number(e.target.value));
            }}
            className="-ml-0.5 cursor-pointer rounded-md px-1 py-0.5 text-xs tabular-nums text-charcoal-500 outline-none transition hover:bg-charcoal-50 hover:text-charcoal-800"
            aria-label="选择数据规模"
          >
            {COUNT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {formatNumber(n)} 套
              </option>
            ))}
            <option value="custom">自定义</option>
          </select>
          {!COUNT_OPTIONS.includes(totalCount) && (
            <input
              type="number"
              min={100}
              max={50000}
              step={100}
              value={totalCount}
              onChange={(e) => setTotalCount(Number(e.target.value))}
              className="ml-1 w-20 rounded-md bg-charcoal-50 px-2 py-0.5 text-xs tabular-nums outline-none focus:ring-2 focus:ring-brand-200"
              aria-label="自定义房源数量"
            />
          )}
          {filters.district && (
            <span className="ml-2 rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
              {filters.district}
            </span>
          )}
        </span>

        <div className="inline-flex shrink-0 rounded-full bg-charcoal-50 p-0.5">
          {VIEW_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => onViewChange(t.key)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                view === t.key
                  ? 'bg-white text-charcoal-900 shadow-sm'
                  : 'text-charcoal-400 hover:text-charcoal-700',
              )}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
