import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Car,
  Compass,
  ExternalLink,
  Layers,
  MapPin,
  Maximize,
  Train,
} from 'lucide-react';
import { houseImageUrl } from '@/lib/houseImage';
import { formatNumber, timeAgo } from '@/lib/utils';
import { useListingStore } from '@/store/useListingStore';
import {
  PLATFORM_COLORS,
  PLATFORM_LABELS,
  RENT_TYPE_LABELS,
} from '@/types/house';

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-charcoal-50 p-2.5">
      <div className="text-xs text-charcoal-400">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-charcoal-800">{value}</div>
    </div>
  );
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const listings = useListingStore((s) => s.listings);
  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-24">
        <p className="text-sm text-charcoal-400">房源不存在或已下架</p>
        <Link
          to="/"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white transition hover:bg-brand-600"
        >
          返回列表
        </Link>
      </div>
    );
  }

  const platformColor = PLATFORM_COLORS[listing.platform];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-charcoal-500 transition hover:text-brand-600"
      >
        <ArrowLeft size={16} /> 返回列表
      </Link>

      <div className="mt-4 grid gap-5 md:grid-cols-[minmax(0,420px)_1fr]">
        {/* 图片 */}
        <div className="relative overflow-hidden rounded-xl bg-charcoal-100">
          <img
            src={houseImageUrl(listing)}
            alt={listing.title}
            className="aspect-4/3 w-full object-cover"
          />
          <span
            className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-xs font-semibold text-white shadow-sm"
            style={{ background: platformColor }}
          >
            {PLATFORM_LABELS[listing.platform]}
          </span>
        </div>

        {/* 信息 */}
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-charcoal-900">
            {listing.title}
            {listing.isVerified && (
              <BadgeCheck size={18} className="ml-1.5 inline text-mint-600" />
            )}
          </h1>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-charcoal-500">
            <span className="rounded bg-charcoal-50 px-1.5 py-0.5">
              {RENT_TYPE_LABELS[listing.rentType]}
            </span>
            <span className="inline-flex items-center gap-0.5">
              <MapPin size={11} />
              {listing.community} · {listing.district} {listing.area}
            </span>
            {listing.nearSubway && (
              <span className="inline-flex items-center gap-0.5 text-mint-700">
                <Train size={11} />
                {listing.subwayLine} {listing.subwayStation} {listing.subwayDistance}m
              </span>
            )}
          </div>

          <div className="mt-3">
            <span className="text-3xl font-bold text-brand-600">
              ¥{formatNumber(listing.price)}
            </span>
            <span className="text-charcoal-400"> /月</span>
            <span className="ml-2 text-sm text-charcoal-400">
              约合 ¥{Math.round(listing.price / listing.areaSize)}/㎡·月
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Spec
              label="户型"
              value={`${listing.rooms}室${listing.halls}厅${listing.baths}卫`}
            />
            <Spec label="面积" value={`${listing.areaSize} ㎡`} />
            <Spec
              label="楼层"
              value={`${listing.floor}/${listing.totalFloor}层（${listing.floorLevel}）`}
            />
            <Spec label="朝向" value={listing.orientation} />
            <Spec label="装修" value={listing.decoration} />
            <Spec
              label="电梯 / 车位"
              value={`${listing.hasElevator ? '有' : '无'}电梯 · ${
                listing.hasParking ? '有' : '无'
              }车位`}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-400">
            <span className="inline-flex items-center gap-1">
              <Compass size={12} />
              编号 {listing.id}
            </span>
            <span className="inline-flex items-center gap-1">
              <Maximize size={12} />
              房源 {listing.images} 张图
            </span>
            <span className="inline-flex items-center gap-1">
              <Layers size={12} />
              {listing.landlord} · {timeAgo(listing.publishedAt)}发布
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {listing.sourceUrl ? (
              <a
                href={listing.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
              >
                {listing.platform === 'ziroom'
                  ? '自如房源同步展示于贝壳，点击查看'
                  : `前往${PLATFORM_LABELS[listing.platform]}查看原房源`}
                <ExternalLink size={14} />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-mint-50 px-4 py-2.5 text-sm text-mint-700">
                <Car size={14} className="hidden" />
                个人房东直租 · 无平台佣金
              </span>
            )}
            <span className="text-xs text-charcoal-400">
              数据为模拟生成，外链跳转到对应平台租房搜索页
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
