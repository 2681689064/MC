import { lazy, Suspense, useState } from 'react';
import { LayoutGrid, Map, Columns2, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useListingStore } from '@/store/useListingStore';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FilterBar from '@/components/FilterBar';
import ListingList from '@/components/ListingList';
import MapView from '@/components/MapView';
import PageLoader from '@/components/PageLoader';

// 图表库较大（recharts chunk ~110KB gzip），懒加载不阻塞首屏渲染
const StatsBar = lazy(() => import('@/components/StatsBar'));

/** split = 初始页同屏（列表 + 地图板块） */
type View = 'split' | 'list' | 'map';

// 精简为 5 个常用档位（原 7 档过密），自定义值走输入框
const COUNT_OPTIONS = [3000, 6000, 10000, 20000, 50000];

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

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        {/* 品牌 Hero：标语 + 快捷找房入口 */}
        <Hero />

        {/* 数据概览：统计卡片 + 平台/区域分布（lg 一行 8 列） */}
        <div className="mt-5">
          <Suspense fallback={<PageLoader className="h-24" />}>
            <StatsBar />
          </Suspense>
        </div>

        {/* 工具栏：数据规模 + 视图切换（自定义输入仅在选择"自定义"时出现，减少常驻拥挤） */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-charcoal-100 bg-white px-3 py-2.5 shadow-sm">
          <div className="flex items-center gap-2">
            <Gauge size={15} className="shrink-0 text-brand-500" />
            <span className="shrink-0 text-xs font-medium text-charcoal-500">
              数据规模
            </span>
            <select
              value={COUNT_OPTIONS.includes(totalCount) ? totalCount : 'custom'}
              onChange={(e) => {
                if (e.target.value !== 'custom') setTotalCount(Number(e.target.value));
              }}
              className="h-9 rounded-lg border border-charcoal-200 bg-white px-2.5 text-sm text-charcoal-700 outline-none transition focus:border-brand-400"
              aria-label="选择数据规模"
            >
              {COUNT_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n.toLocaleString('zh-CN')} 套
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
                className="h-9 w-20 rounded-lg border border-charcoal-200 px-2.5 text-sm tabular-nums outline-none transition focus:border-brand-400"
                aria-label="自定义房源数量"
              />
            )}
            <span className="hidden text-[11px] text-charcoal-300 sm:inline">
              100 – 50,000
            </span>
          </div>

          <div className="inline-flex shrink-0 rounded-full border border-charcoal-200 p-0.5">
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

        <div className="mt-5">
          <FilterBar />
        </div>

        <div className="mt-5">
          {/* split 同屏：gap-5 与其他区块 20px 间距一致 */}
          {view === 'split' ? (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
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

      {/* charcoal-500 保证小字对比度 ≥ 4.5:1 */}
      <footer className="border-t border-charcoal-100 py-5 text-center text-xs text-charcoal-500">
        觅巢 · 天津租房聚合平台 · 数据为模拟生成，仅用于功能演示
      </footer>
    </div>
  );
}
