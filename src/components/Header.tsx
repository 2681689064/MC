import { Building2, MapPin } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useListingStore } from '@/store/useListingStore';

export default function Header() {
  const totalCount = useListingStore((s) => s.totalCount);
  const userLocation = useListingStore((s) => s.userLocation);

  return (
    <header className="sticky top-0 z-30 border-b border-charcoal-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-500/30">
            <Building2 size={20} strokeWidth={2.4} />
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-bold tracking-wide text-charcoal-900">
              觅巢
              <span className="ml-1.5 hidden text-sm font-normal text-charcoal-500 sm:inline">
                天津租房聚合平台
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 定位状态徽章：定位后显示所在坐标 */}
          {userLocation && (
            <span className="hidden items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 md:inline-flex">
              <MapPin size={12} />
              {userLocation.lat.toFixed(3)}, {userLocation.lng.toFixed(3)}
            </span>
          )}
          <span className="hidden items-center gap-1 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 sm:inline-flex">
            <MapPin size={12} />
            仅服务天津
          </span>
          <div className="flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            在线房源 <span className="tabular-nums">{formatNumber(totalCount)}</span> 套
          </div>
        </div>
      </div>
    </header>
  );
}
