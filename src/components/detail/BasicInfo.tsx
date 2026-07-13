import {
  type LucideIcon,
  Phone,
  Calendar,
  Heart,
  Wallet,
  Maximize2,
  Layers,
  Building2,
  Eye,
} from 'lucide-react'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'
import {
  formatPrice,
  formatArea,
  formatPricePerSqm,
  formatRelativeTime,
  formatViews,
} from '@/lib/format'
import { SOURCE_META } from '@/lib/constants'
import { useFavoritesStore } from '@/store/favoritesStore'
import { cn } from '@/lib/utils'
import type { Listing } from '@/types/listing'

interface BasicInfoProps {
  listing: Listing
  className?: string
}

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  unit?: string
  sub?: string
  tone?: 'default' | 'brand'
}

function StatCard({ icon: Icon, label, value, unit, sub, tone = 'default' }: StatCardProps) {
  return (
    <div className="rounded-xl border border-charcoal-100 bg-white p-4">
      <div className="text-xs text-charcoal-400 flex items-center gap-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div
        className={cn(
          'font-numeric text-2xl mt-2',
          tone === 'brand' ? 'text-brand-600' : 'text-charcoal-900',
        )}
      >
        {value}
        {unit && <span className="text-sm text-charcoal-400 ml-1 font-body">{unit}</span>}
      </div>
      {sub && <div className="text-xs text-charcoal-400 mt-0.5">{sub}</div>}
    </div>
  )
}

export function BasicInfo({ listing, className }: BasicInfoProps) {
  const isFav = useFavoritesStore((s) => s.has(listing.id))
  const toggle = useFavoritesStore((s) => s.toggle)
  const sourceMeta = SOURCE_META[listing.source]

  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6',
        className,
      )}
    >
      <div className="flex-1 min-w-0">
        <h1 className="font-display text-2xl md:text-3xl text-charcoal-900 leading-tight">
          {listing.title}
        </h1>

        <div className="mt-3 flex flex-wrap gap-2">
          {listing.isDirectRent && <Tag variant="direct">房东直租</Tag>}
          <Tag variant="outline">{listing.roomType}</Tag>
          <Tag variant="outline">{listing.orientation}</Tag>
          <Tag variant="outline">{listing.floor}</Tag>
          <Tag variant="brand">{sourceMeta.short} 来源</Tag>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-charcoal-400">
          <span className="inline-flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {formatViews(listing.views)} 次浏览
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatRelativeTime(listing.publishedAt)}发布
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <StatCard
            icon={Wallet}
            label="月租金"
            value={formatPrice(listing.price)}
            unit="元/月"
            tone="brand"
          />
          <StatCard
            icon={Maximize2}
            label="建筑面积"
            value={formatArea(listing.area)}
            sub={formatPricePerSqm(listing.price, listing.area)}
          />
          <StatCard
            icon={Layers}
            label="户型"
            value={listing.roomType}
            sub={listing.depositMode}
          />
          <StatCard
            icon={Building2}
            label="来源平台"
            value={sourceMeta.short}
            sub={sourceMeta.label}
          />
        </div>
      </div>

      <div className="lg:sticky lg:top-6 flex flex-col gap-2 lg:min-w-[200px]">
        <Button variant="primary" size="lg">
          <Phone className="w-4 h-4" />
          联系房东
        </Button>
        <Button variant="outline" size="lg">
          <Calendar className="w-4 h-4" />
          在线预约
        </Button>
        <Button
          variant={isFav ? 'primary' : 'outline'}
          size="lg"
          onClick={() => toggle(listing.id)}
          aria-pressed={isFav}
        >
          <Heart className={cn('w-4 h-4', isFav && 'fill-current')} />
          {isFav ? '已收藏' : '收藏'}
        </Button>
      </div>
    </div>
  )
}
