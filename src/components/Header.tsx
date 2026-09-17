import { MapPin } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useListingStore } from '@/store/useListingStore';

export default function Header() {
  const totalCount = useListingStore((s) => s.totalCount);
  const userLocation = useListingStore((s) => s.userLocation);

  return (
    <header className="sticky top-0 z-30 border-b border-charcoal-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-2.5">
          {/* 觅巢 Logo：GitHub 云端仓库的 觅巢Logo.jpg（public/logo.jpg） */}
          <img
            src="/logo.jpg"
            alt="觅巢 Logo"
            className="h-8 w-8 rounded-lg object-cover"
          />
          <div className="leading-tight">
            <h1 className="text-base font-bold tracking-wide text-charcoal-900">
              觅巢
              <span className="ml-1.5 hidden text-sm font-normal text-charcoal-400 sm:inline">
                天津租房聚合平台
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 定位状态徽章：定位后显示所在坐标 */}
          {userLocation && (
            <span className="hidden items-center gap-1 rounded-full bg-charcoal-100 px-2.5 py-1 text-xs font-medium text-charcoal-500 md:inline-flex">
              <MapPin size={12} />
              {userLocation.lat.toFixed(3)}, {userLocation.lng.toFixed(3)}
            </span>
          )}
          <span className="hidden items-center gap-1 rounded-full bg-charcoal-100 px-2.5 py-1 text-xs font-medium text-charcoal-500 sm:inline-flex">
            <MapPin size={12} />
            仅服务天津
          </span>
          <div className="flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm shadow-brand-500/25">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            在线房源 <span className="tabular-nums">{formatNumber(totalCount)}</span> 套
          </div>
        </div>
      </div>
    </header>
  );
}
