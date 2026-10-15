import { lazy, Suspense, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FilterBar, { type ViewMode } from '@/components/FilterBar';
import ListingList from '@/components/ListingList';
import MapView from '@/components/MapView';
import PageLoader from '@/components/PageLoader';

// 图表库较大（recharts chunk ~110KB gzip），懒加载不阻塞首屏渲染
const StatsBar = lazy(() => import('@/components/StatsBar'));

export default function HomePage() {
  const [view, setView] = useState<ViewMode>('split');

  return (
    <div className="min-h-full">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
        {/* 品牌 Hero：标语 + 附近找房入口 */}
        <Hero />

        {/* 数据概览：统计卡片 + 平台/区域分布（lg 一行 8 列） */}
        <div className="mt-5">
          <Suspense fallback={<PageLoader className="h-24" />}>
            <StatsBar />
          </Suspense>
        </div>

        {/* 筛选面板：搜索 + 筛选 chips + 底部结果统计/数据规模/视图切换 */}
        <div className="mt-5">
          <FilterBar view={view} onViewChange={setView} />
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
