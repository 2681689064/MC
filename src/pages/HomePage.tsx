import { lazy, Suspense, useState } from 'react';
import { LayoutGrid, Map, Columns2, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useListingStore } from '@/store/useListingStore';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import ListingList from '@/components/ListingList';
import MapView from '@/components/MapView';

// 图表库较大（recharts chunk ~110KB gzip），懒加载不阻塞首屏渲染
const StatsBar = lazy(() => import('@/components/StatsBar'));

/** split = 初始页同屏（列表 + 地图板块） */
type View = 'split' | 'list' | 'map';

const COUNT_OPTIONS = [600, 1200, 3000, 6000, 10000, 20000, 50000];

const VIEW_TABS: { key: View; label: string; icon: React.ReactNode }[] = [
  { key: 'split', label: '同屏', icon: <Columns2 size={14} /> },
  { key: 'list', label: '列表', icon: <LayoutGrid size={14} /> },
  { key: 'map', label: '地图', icon: <Map size={14} /> },
];

export default function HomePage() {
  const [view, setView] = useState<View>('split');
  const { totalCount, setTotalCount } = useListingStore();

  return (
    <div className="min-h-full">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <Suspense
          fallback={
            <div className="h-24 animate-pulse rounded-xl border border-charcoal-100 bg-white" />
          }
        >
          <StatsBar />
        </Suspense>

        {/* 房源数量控制 + 视图切换 */}
        <div className="mt-3 flex flex-col gap-2 rounded-xl border border-charcoal-100 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Gauge size={16} className="text-brand-500" />
            <span className="text-sm font-medium text-charcoal-700">
              房源数量
            </span>
            {COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setTotalCount(n)}
                className={cn(
                  'rounded-full px-3 py-1 text-sm transition-colors',
                  totalCount === n
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200',
                )}
              >
                {n.toLocaleString('zh-CN')}
              </button>
            ))}
            <input
              type="number"
              min={100}
              max={50000}
              step={100}
              value={totalCount}
              onChange={(e) => setTotalCount(Number(e.target.value))}
              className="w-24 rounded-full border border-charcoal-200 px-3 py-1 text-sm outline-none focus:border-brand-400"
              aria-label="自定义房源数量"
            />
            <span className="text-xs text-charcoal-400">套（100-50000）</span>
          </div>

          <div className="inline-flex rounded-full border border-charcoal-200 p-0.5">
            {VIEW_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setView(t.key)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm transition-colors',
                  view === t.key
                    ? 'bg-brand-500 text-white'
                    : 'text-charcoal-600 hover:bg-charcoal-50',
                )}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <FilterBar />
        </div>

        <div className="mt-3">
          {view === 'split' ? (
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
              {/* 移动端地图在上，桌面端地图固定右侧 */}
              <div className="order-1 lg:order-2 lg:sticky lg:top-20 lg:self-start">
                <MapView className="h-64 sm:h-72 lg:h-[calc(100vh-23rem)]" />
              </div>
              <div className="order-2 lg:order-1">
                <ListingList />
              </div>
            </div>
          ) : view === 'list' ? (
            <ListingList />
          ) : (
            <MapView />
          )}
        </div>
      </main>

      <footer className="border-t border-charcoal-100 py-4 text-center text-xs text-charcoal-400">
        觅巢 · 天津租房聚合平台 · 数据为模拟生成，仅用于功能演示
      </footer>
    </div>
  );
}
