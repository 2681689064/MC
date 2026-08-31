import { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  MapPin,
  Train,
  Maximize,
  Layers,
  Compass,
  ExternalLink,
} from 'lucide-react';
import { formatDistance, formatNumber, distanceMeters, timeAgo } from '@/lib/utils';
import { houseImageUrl } from '@/lib/houseImage';
import { useListingStore } from '@/store/useListingStore';
import {
  PLATFORM_COLORS,
  PLATFORM_LABELS,
  RENT_TYPE_LABELS,
  type HouseListing,
} from '@/types/house';

function ListingCardImpl({ listing }: { listing: HouseListing }) {
  const platformColor = PLATFORM_COLORS[listing.platform];
  const isPersonal = listing.platform === 'personal';
  const userLocation = useListingStore((s) => s.userLocation);
  const dist = userLocation
    ? distanceMeters(userLocation.lng, userLocation.lat, listing.lng, listing.lat)
    : null;

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="group relative flex gap-3 rounded-2xl border border-charcoal-100 bg-white p-2.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10 sm:gap-4 sm:p-3"
    >
      {/* 图片 */}
      <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-charcoal-100 sm:h-28 sm:w-40">
        <img
          src={houseImageUrl(listing)}
          alt={listing.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span
          className="absolute left-1.5 top-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm"
          style={{ background: platformColor }}
        >
          {PLATFORM_LABELS[listing.platform]}
        </span>
        <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-sm">
          {listing.images} 图
        </span>
        {isPersonal && (
          <span className="absolute right-1.5 top-1.5 rounded-md bg-mint-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
            0 佣金
          </span>
        )}
      </div>

      {/* 直达平台外链按钮：不跳站内详情，直接打开该房源所在平台
          （用 button + window.open，避免 <a> 嵌套在卡片 <a> 内的无效 DOM 结构） */}
      <button
        type="button"
        title={`在${PLATFORM_LABELS[listing.platform]}中查看该小区房源`}
        onClick={(e) => {
          // 阻止冒泡到卡片的站内路由跳转，新窗口打开平台链接
          e.stopPropagation();
          window.open(listing.sourceUrl, '_blank', 'noopener,noreferrer');
        }}
        className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-lg border border-charcoal-200/80 bg-white/95 px-2 py-1 text-[11px] font-medium text-charcoal-500 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:border-brand-300 hover:text-brand-600 focus:opacity-100 group-hover:opacity-100"
      >
        <ExternalLink size={12} />
        平台直达
      </button>

      {/* 内容 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-medium text-charcoal-900 transition-colors group-hover:text-brand-600">
            {listing.title}
          </h3>
          {listing.isVerified && (
            <BadgeCheck size={14} className="mt-0.5 shrink-0 text-mint-600" />
          )}
        </div>

        <div className="mt-0.5 flex items-center gap-1 text-xs text-charcoal-500">
          <MapPin size={11} className="shrink-0 text-charcoal-400" />
          <span className="line-clamp-1">
            {listing.community} · {listing.district} {listing.area}
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-charcoal-500">
          <span className="rounded bg-charcoal-50 px-1.5 py-0.5 text-charcoal-600">
            {RENT_TYPE_LABELS[listing.rentType]}
          </span>
          <span className="inline-flex items-center gap-0.5">
            {listing.rooms}室{listing.halls}厅{listing.baths}卫
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Maximize size={11} />
            {listing.areaSize}㎡
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Layers size={11} />
            {listing.floor}/{listing.totalFloor}层
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Compass size={11} />
            {listing.orientation}
          </span>
          <span>{listing.decoration}</span>
        </div>

        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-charcoal-400">
          {dist !== null && (
            <span className="mr-1 rounded bg-blue-50 px-1.5 py-0.5 font-medium text-blue-600">
              距您 {formatDistance(dist)}
            </span>
          )}
          {listing.nearSubway ? (
            <>
              <Train size={11} className="text-mint-600" />
              <span className="text-mint-700">
                {listing.subwayLine} · {listing.subwayStation} {listing.subwayDistance}m
              </span>
            </>
          ) : (
            <span>距地铁 {listing.subwayDistance}m</span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between pt-1.5">
          <div>
            <span className="text-lg font-bold text-brand-600">
              ¥{formatNumber(listing.price)}
            </span>
            <span className="text-xs text-charcoal-400">/月</span>
          </div>
          <span className="text-[11px] text-charcoal-400 transition-colors group-hover:text-brand-500">
            {isPersonal ? '房东直租' : listing.landlord} · {timeAgo(listing.publishedAt)} · 查看详情 →
          </span>
        </div>
      </div>
    </Link>
  );
}

export const ListingCard = memo(ListingCardImpl);
export default ListingCard;
