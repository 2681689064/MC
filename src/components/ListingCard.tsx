import { memo } from 'react';
import { BadgeCheck, MapPin, Train, Maximize, Layers, Compass } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import {
  PLATFORM_COLORS,
  PLATFORM_LABELS,
  RENT_TYPE_LABELS,
  type HouseListing,
} from '@/types/house';

const DECO_PROMPT: Record<string, string> = {
  毛坯: 'empty raw concrete apartment room, bright daylight, no furniture, minimalist',
  简装: 'simple furnished apartment living room, white walls, basic sofa, daylight',
  精装: 'modern cozy apartment living room, warm wood floor, sofa, plants, bright',
  豪装: 'luxury apartment living room, designer furniture, marble floor, golden light',
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const day = 86400000;
  const d = Math.floor(diff / day);
  if (d <= 0) return '今天';
  if (d === 1) return '昨天';
  if (d < 7) return `${d}天前`;
  if (d < 30) return `${Math.floor(d / 7)}周前`;
  return `${Math.floor(d / 30)}月前`;
}

function imageUrl(l: HouseListing): string {
  const prompt = encodeURIComponent(
    `Real estate listing photo, ${DECO_PROMPT[l.decoration]}, ${
      l.rentType === 'shared' ? 'single bedroom' : 'living room'
    }, ${l.areaSize} sqm, photorealistic, interior design`,
  );
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${prompt}&image_size=landscape_4_3`;
}

function ListingCardImpl({ listing }: { listing: HouseListing }) {
  const platformColor = PLATFORM_COLORS[listing.platform];
  const isPersonal = listing.platform === 'personal';

  return (
    <article className="group flex gap-3 rounded-xl border border-charcoal-100 bg-white p-2.5 transition-all hover:border-brand-200 hover:shadow-md sm:gap-4 sm:p-3">
      {/* 图片 */}
      <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-charcoal-100 sm:h-28 sm:w-40">
        <img
          src={imageUrl(listing)}
          alt={listing.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className="absolute left-1.5 top-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm"
          style={{ background: platformColor }}
        >
          {PLATFORM_LABELS[listing.platform]}
        </span>
        <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
          {listing.images} 图
        </span>
      </div>

      {/* 内容 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-medium text-charcoal-900">
            {listing.title}
          </h3>
          {listing.isVerified && (
            <BadgeCheck size={14} className="mt-0.5 shrink-0 text-mint-600" />
          )}
        </div>

        <div className="mt-0.5 flex items-center gap-1 text-xs text-charcoal-500">
          <MapPin size={11} className="text-charcoal-400" />
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
          <span className="text-[11px] text-charcoal-400">
            {isPersonal ? '房东直租' : listing.landlord} · {timeAgo(listing.publishedAt)}
          </span>
        </div>
      </div>
    </article>
  );
}

export const ListingCard = memo(ListingCardImpl);
export default ListingCard;
