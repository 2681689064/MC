import { Crosshair, Loader2, MapPinOff, LocateFixed } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useListingStore } from '@/store/useListingStore';

/**
 * 个人定位控件：点击请求浏览器定位，展示定位状态。
 * 定位成功后可使用"距我最近"排序与地图个人位置标记。
 */
export default function LocationControl({ compact = false }: { compact?: boolean }) {
  const { locationStatus, userLocation, requestLocation } = useListingStore();

  const handleLocate = async () => {
    await requestLocation();
  };

  const config = {
    idle: {
      icon: <Crosshair size={compact ? 14 : 16} />,
      label: '获取定位',
      cls: 'border-charcoal-200 bg-white text-charcoal-600 hover:border-brand-300 hover:text-brand-600',
    },
    locating: {
      icon: <Loader2 size={compact ? 14 : 16} className="animate-spin" />,
      label: '定位中…',
      cls: 'border-brand-200 bg-brand-50 text-brand-600',
    },
    ok: {
      icon: <LocateFixed size={compact ? 14 : 16} />,
      label: userLocation ? `已定位 · ±${Math.round(userLocation.accuracy)}m` : '已定位',
      cls: 'border-mint-200 bg-mint-50 text-mint-700',
    },
    error: {
      icon: <MapPinOff size={compact ? 14 : 16} />,
      label: '定位失败，点此重试',
      cls: 'border-orange-200 bg-orange-50 text-orange-600',
    },
  }[locationStatus];

  return (
    <button
      type="button"
      onClick={handleLocate}
      disabled={locationStatus === 'locating'}
      title="使用浏览器定位，支持按距离找房与地图展示我的位置"
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition-colors',
        compact ? 'py-1.5' : 'py-2.5',
        config.cls,
      )}
    >
      {config.icon}
      <span className="whitespace-nowrap">{config.label}</span>
    </button>
  );
}
