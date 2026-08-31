import { memo } from 'react';
import { Building2, MapPin, Train, BadgeCheck, User, Home, Building } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import { useListingStore } from '@/store/useListingStore';
import type { RentType } from '@/types/house';

/** 首页 Hero：品牌标语 + 快捷找房入口（融合贝壳/自如首页风格） */
function HeroImpl() {
  const { filters, setFilters, totalCount, userLocation, requestLocation, setMockLocation } =
    useListingStore();

  /** 附近找房：一键定位 → 开 3km 半径 → 按距离排序 */
  const handleNearby = async () => {
    if (!userLocation) {
      const loc = await requestLocation();
      if (!loc) setMockLocation(); // 无 GPS 环境降级为市中心模拟位置
    }
    setFilters({ nearbyRadiusKm: 3 });
  };

  /** 租型快捷筛选（再次点击取消） */
  const toggleRentType = (t: RentType) =>
    setFilters({ rentType: filters.rentType === t ? '' : t });

  const quickChips: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void }[] = [
    { label: '整租', icon: <Home size={15} />, active: filters.rentType === 'whole', onClick: () => toggleRentType('whole') },
    { label: '合租', icon: <Building size={15} />, active: filters.rentType === 'shared', onClick: () => toggleRentType('shared') },
    { label: '独栋公寓', icon: <Building2 size={15} />, active: filters.rentType === 'apartment', onClick: () => toggleRentType('apartment') },
    { label: '个人直租', icon: <User size={15} />, active: filters.platform === 'personal', onClick: () => setFilters({ platform: filters.platform === 'personal' ? '' : 'personal' }) },
    { label: '近地铁', icon: <Train size={15} />, active: filters.nearSubwayOnly, onClick: () => setFilters({ nearSubwayOnly: !filters.nearSubwayOnly }) },
    { label: '已核验', icon: <BadgeCheck size={15} />, active: filters.verifiedOnly, onClick: () => setFilters({ verifiedOnly: !filters.verifiedOnly }) },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 via-brand-400 to-orange-300 px-6 py-8 text-white shadow-lg shadow-brand-500/20 sm:px-10 sm:py-10">
      {/* 装饰光晕与纹理 */}
      <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-10 h-56 w-56 rounded-full bg-orange-200/25 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <MapPin size={12} />
            专注天津 · {formatNumber(totalCount)} 套真实在租房源
          </div>
          <h2 className="text-2xl font-bold leading-tight tracking-wide sm:text-4xl">
            在天津，找一个
            <span className="mx-1 rounded-lg bg-white/95 px-2 text-brand-600">称心的家</span>
          </h2>
          <p className="mt-2 max-w-lg text-sm text-white/85 sm:text-base">
            一次搜索，聚合链家、贝壳、安居客、58 同城、自如与个人房东直租，
            地铁沿线、价格走势、房东直租一站可比。
          </p>
        </div>

        {/* 附近找房大按钮 */}
        <button
          type="button"
          onClick={handleNearby}
          className="group inline-flex shrink-0 items-center gap-3 self-start rounded-2xl bg-white/95 px-5 py-4 text-left shadow-xl shadow-brand-700/20 transition hover:-translate-y-0.5 hover:bg-white sm:px-6"
        >
          <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/40">
            <MapPin size={22} className="animate-page-bounce" />
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-white bg-mint-500" />
            </span>
          </span>
          <span>
            <span className="block text-base font-bold text-charcoal-900">
              附近找房
            </span>
            <span className="block text-xs text-charcoal-500">
              {userLocation
                ? `已定位 · ${filters.nearbyRadiusKm > 0 ? `${filters.nearbyRadiusKm}km 内` : '点此搜索 3km 内'}`
                : '定位我的位置 · 搜索周边房源'}
            </span>
          </span>
        </button>
      </div>

      {/* 快捷筛选 chips */}
      <div className="relative mt-6 flex flex-wrap gap-2">
        {quickChips.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={c.onClick}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm transition',
              c.active
                ? 'bg-white text-brand-600 shadow-md'
                : 'bg-white/20 text-white hover:bg-white/30',
            )}
          >
            {c.icon}
            {c.label}
          </button>
        ))}
      </div>
    </section>
  );
}

export const Hero = memo(HeroImpl);
export default Hero;
