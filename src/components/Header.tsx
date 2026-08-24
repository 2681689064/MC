import { Building2 } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useListingStore } from '@/store/useListingStore';

export default function Header() {
  const totalCount = useListingStore((s) => s.totalCount);

  return (
    <header className="sticky top-0 z-30 border-b border-charcoal-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
            <Building2 size={20} strokeWidth={2.4} />
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-semibold text-charcoal-900">
              觅巢
              <span className="ml-1 text-sm font-normal text-charcoal-500">
                天津租房聚合平台
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
          </span>
          在线房源 <span className="tabular-nums">{formatNumber(totalCount)}</span> 套
        </div>
      </div>
    </header>
  );
}
