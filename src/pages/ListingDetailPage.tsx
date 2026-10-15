import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  ExternalLink,
  MapPin,
  ShieldCheck,
  Train,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { houseImageUrl } from '@/lib/houseImage';
import { formatNumber, timeAgo } from '@/lib/utils';
import { estimateMarketPrice } from '@/data/generateListings';
import { useListingStore } from '@/store/useListingStore';
import {
  PLATFORM_COLORS,
  PLATFORM_LABELS,
  RENT_TYPE_LABELS,
} from '@/types/house';
import { cn } from '@/lib/utils';

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-charcoal-50 px-3 py-2.5">
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
  const marketPrice = estimateMarketPrice(listing);
  const devPct = Math.round(((listing.price - marketPrice) / marketPrice) * 100);
  const priceLevel = devPct <= -12 ? 'low' : devPct <= 10 ? 'fair' : 'high';

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-charcoal-500 transition hover:text-brand-600"
      >
        <ArrowLeft size={16} /> 返回列表
      </Link>

      <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,420px)_1fr]">
        {/* 图片 */}
        <div className="relative overflow-hidden rounded-2xl bg-charcoal-100 shadow-sm">
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
          <h1 className="text-xl font-semibold text-charcoal-900">
            {listing.title}
            {listing.isVerified && (
              <BadgeCheck size={18} className="ml-1.5 inline text-mint-600" />
            )}
          </h1>

          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-charcoal-500">
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

          {/* 价格 + 市场参考价核验 */}
          <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <span className="text-3xl font-bold text-brand-600">
                  ¥{formatNumber(listing.price)}
                </span>
                <span className="text-charcoal-400"> /月</span>
                <span className="ml-2 text-sm text-charcoal-400">
                  约合 ¥{Math.round(listing.price / listing.areaSize)}/㎡·月
                </span>
              </div>
              {/* 价格核验徽章：与市场参考价的偏离档位 */}
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
                  priceLevel === 'low' && 'bg-mint-50 text-mint-700',
                  priceLevel === 'fair' && 'bg-blue-50 text-blue-600',
                  priceLevel === 'high' && 'bg-amber-50 text-amber-600',
                )}
              >
                {priceLevel === 'low' && <TrendingDown size={13} />}
                {priceLevel === 'high' && <TrendingUp size={13} />}
                {priceLevel === 'fair' && <ShieldCheck size={13} />}
                {priceLevel === 'low' && `低于市场 ${Math.abs(devPct)}%`}
                {priceLevel === 'fair' &&
                  (devPct === 0 ? '与市场一致' : `贴近市场 ${devPct > 0 ? '+' : ''}${devPct}%`)}
                {priceLevel === 'high' && `高于市场 ${devPct}%`}
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-2 border-t border-charcoal-100 pt-2.5 text-xs text-charcoal-400">
              <ShieldCheck size={13} className="shrink-0 text-charcoal-400" />
              <span>
                市场参考价 ¥{formatNumber(marketPrice)}/月（按{listing.district}
                同档户型/装修校准）·{' '}
                {priceLevel === 'low'
                  ? '报价明显偏低，建议了解房屋状况后尽快联系'
                  : priceLevel === 'fair'
                    ? '价格处于正常区间，可信度高'
                    : '报价偏高，可尝试议价'}
              </span>
            </div>
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

          {/* 房源核验：数据构成说明 */}
          <div className="mt-4 rounded-2xl bg-charcoal-50 p-3.5 text-xs text-charcoal-500">
            <div className="flex items-center gap-1.5 font-medium text-charcoal-600">
              <Building2 size={13} />
              房源信息构成
            </div>
            <div className="mt-1.5 leading-relaxed">
              小区「{listing.community}」为{listing.district}
              {listing.area}真实在租小区 · 地铁信息取自板块真实线路
              {listing.nearSubway ? `（${listing.subwayLine} ${listing.subwayStation}）` : '（周边暂无地铁覆盖）'} ·
              价格按天津市场租金基准校准
              {listing.isVerified && (
                <>
                  {' '}· <span className="text-mint-600">已通过价格核验</span>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-400">
            <span>编号 {listing.id}</span>
            <span>{listing.images} 张图</span>
            <span>
              {listing.landlord} · {timeAgo(listing.publishedAt)}发布
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {listing.sourceUrl ? (
              <a
                href={listing.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-brand-500/25 transition hover:bg-brand-600"
              >
                {listing.platform === 'ziroom'
                  ? '自如房源同步展示于贝壳，点击查看'
                  : `前往${PLATFORM_LABELS[listing.platform]}查看原房源`}
                <ExternalLink size={14} />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-mint-50 px-4 py-2.5 text-sm text-mint-700">
                个人房东直租 · 无平台佣金
              </span>
            )}
            <span className="text-xs text-charcoal-400">
              外链跳转至对应平台租房页，可进一步核实房源
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
