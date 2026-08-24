import { useState } from 'react';
import { LayoutGrid, Map, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useListingStore } from '@/store/useListingStore';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import StatsBar from '@/components/StatsBar';
import ListingList from '@/components/ListingList';
import MapView from '@/components/MapView';

type View = 'list' | 'map';

const COUNT_OPTIONS = [600, 1200, 3000, 6000, 10000];

export default function HomePage() {
  const [view, setView] = useState<View>('list');
  const { totalCount, setTotalCount } = useListingStore();

  return (
    <div className="min-h-full">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <StatsBar />

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
              max={20000}
              step={100}
              value={totalCount}
              onChange={(e) => setTotalCount(Number(e.target.value))}
              className="w-24 rounded-full border border-charcoal-200 px-3 py-1 text-sm outline-none focus:border-brand-400"
              aria-label="自定义房源数量"
            />
            <span className="text-xs text-charcoal-400">套（100-20000）</span>
          </div>

          <div className="inline-flex rounded-full border border-charcoal-200 p-0.5">
            <button
              type="button"
              onClick={() => setView('list')}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm transition-colors',
                view === 'list'
                  ? 'bg-brand-500 text-white'
                  : 'text-charcoal-600 hover:bg-charcoal-50',
              )}
            >
              <LayoutGrid size={14} /> 列表
            </button>
            <button
              type="button"
              onClick={() => setView('map')}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm transition-colors',
                view === 'map'
                  ? 'bg-brand-500 text-white'
                  : 'text-charcoal-600 hover:bg-charcoal-50',
              )}
            >
              <Map size={14} /> 地图
            </button>
          </div>
        </div>

        <div className="mt-3">
          <FilterBar />
        </div>

        <div className="mt-3">
          {view === 'list' ? <ListingList /> : <MapView />}
        </div>
      </main>

      <footer className="border-t border-charcoal-100 py-4 text-center text-xs text-charcoal-400">
        觅巢 · 天津租房聚合平台 · 数据为模拟生成，仅用于功能演示
      </footer>
    </div>
  );
}
