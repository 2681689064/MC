import { Link } from 'react-router-dom'
import { Heart, Eye, Maximize2, DoorOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice, formatArea, formatRelativeTime, formatViews } from '@/lib/format'
import { SOURCE_META } from '@/lib/constants'
import { useFavoritesStore } from '@/store/favoritesStore'
import { Tag } from '@/components/ui/Tag'
import { TIANJIN_DISTRICTS } from '@/data/tianjinDistricts'
import type { Listing } from '@/types/listing'

interface ListingCardProps {
  listing: Listing
  layout?: 'grid' | 'row'
  className?: string
}

const DISTRICT_NAME: Record<string, string> = Object.fromEntries(
  TIANJIN_DISTRICTS.map((d) => [d.code, d.name]),
)

function HeartButton({
  listing,
  tone,
  className,
}: {
  listing: Listing
  tone: 'onImage' | 'onLight'
  className?: string
}) {
  const isFav = useFavoritesStore((s) => s.has(listing.id))
  const toggle = useFavoritesStore((s) => s.toggle)
  return (
    <button
      type="button"
      aria-label={isFav ? '取消收藏' : '收藏'}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(listing.id)
      }}
      className={cn(
        'grid place-items-center w-8 h-8 rounded-full backdrop-blur-md transition-colors',
        tone === 'onImage' ? 'bg-black/20' : 'bg-charcoal-100/80 hover:bg-charcoal-200',
        className,
      )}
    >
      <Heart
        className={cn(
          'w-4 h-4 transition-colors',
          isFav
            ? 'fill-brand-500 text-brand-500'
            : tone === 'onImage'
              ? 'text-white hover:fill-white/40'
              : 'text-charcoal-500',
        )}
      />
    </button>
  )
}

export function ListingCard({ listing, layout = 'grid', className }: ListingCardProps) {
  if (layout === 'row') return <RowCard listing={listing} className={className} />
  return <GridCard listing={listing} className={className} />
}

function GridCard({ listing, className }: { listing: Listing; className?: string }) {
  return (
    <Link
      to={`/list/${listing.id}`}
      className={cn(
        'group rounded-2xl bg-white border border-charcoal-100 overflow-hidden',
        'hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300',
        className,
      )}
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={listing.cover}
          alt={listing.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {listing.isDirectRent && (
          <div className="absolute top-3 left-3">
            <Tag variant="direct">房东直租</Tag>
          </div>
        )}
        <HeartButton listing={listing} tone="onImage" className="absolute top-3 right-3" />
      </div>

      <div className="p-4">
        <h3 className="font-display text-base text-charcoal-900 line-clamp-1">
          {listing.title}
        </h3>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="font-numeric text-xl font-semibold text-brand-600">
            {formatPrice(listing.price)}
          </span>
          <span className="text-xs text-charcoal-500">元/月</span>
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-charcoal-500">
          <span className="inline-flex items-center gap-1">
            <DoorOpen className="w-3.5 h-3.5" />
            {listing.roomType}
          </span>
          <span className="inline-flex items-center gap-1">
            <Maximize2 className="w-3.5 h-3.5" />
            {formatArea(listing.area)}
          </span>
          <span>{listing.floor}</span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-charcoal-100">
          <Tag variant="outline">{SOURCE_META[listing.source].short}</Tag>
          <span className="inline-flex items-center gap-1 text-xs text-charcoal-400">
            <Eye className="w-3.5 h-3.5" />
            {formatViews(listing.views)} · {formatRelativeTime(listing.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  )
}

function RowCard({ listing, className }: { listing: Listing; className?: string }) {
  const districtName = DISTRICT_NAME[listing.district] ?? listing.district
  const subway = listing.subway
  const desc = [
    listing.block,
    districtName,
    subway ? `${subway.line} ${subway.station} ${subway.walkMin}分钟` : '暂无地铁',
  ].join(' · ')

  return (
    <Link
      to={`/list/${listing.id}`}
      className={cn(
        'group flex gap-5 rounded-2xl bg-white border border-charcoal-100 p-4',
        'hover:border-brand-300 hover:shadow-lg transition-all duration-300',
        className,
      )}
    >
      <div className="w-48 md:w-64 aspect-[4/3] rounded-xl overflow-hidden relative shrink-0">
        <img
          src={listing.cover}
          alt={listing.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg text-charcoal-900 group-hover:text-brand-600 transition line-clamp-1">
            {listing.title}
          </h3>
          <HeartButton listing={listing} tone="onLight" className="shrink-0" />
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {listing.isDirectRent && <Tag variant="direct" size="sm">直租</Tag>}
          <Tag variant="outline" size="sm">{listing.roomType}</Tag>
          <Tag variant="outline" size="sm">{listing.orientation}</Tag>
          <Tag variant="outline" size="sm">{listing.floor}</Tag>
        </div>

        <p className="text-sm text-charcoal-500 mt-2 line-clamp-2">{desc}</p>

        <div className="flex items-end justify-between mt-auto pt-3 gap-3">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="font-numeric text-2xl text-brand-600">
                {formatPrice(listing.price)}
              </span>
              <span className="text-xs text-charcoal-500">元/月</span>
            </div>
            <span className="text-xs text-charcoal-400 mt-0.5">{listing.depositMode}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-charcoal-400">
            <Tag variant="outline" size="sm">{SOURCE_META[listing.source].short}</Tag>
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatViews(listing.views)}
            </span>
            <span className="hidden sm:inline">{formatRelativeTime(listing.publishedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
