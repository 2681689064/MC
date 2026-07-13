import { Link } from 'react-router-dom'
import {
  type LucideIcon,
  MapPin,
  Navigation,
  ShoppingBag,
  ShoppingCart,
  Footprints,
} from 'lucide-react'
import { MapContainer } from '@/components/map/MapContainer'
import { cn } from '@/lib/utils'
import type { Listing } from '@/types/listing'

interface LocationMapProps {
  listing: Listing
  className?: string
}

interface Poi {
  name: string
  walkMin: number
  icon: LucideIcon
}

export function LocationMap({ listing, className }: LocationMapProps) {
  const subway = listing.subway

  const pois: Poi[] = [
    { name: '便利店', walkMin: 3, icon: ShoppingBag },
    ...(subway
      ? [{ name: `${subway.line} ${subway.station}`, walkMin: subway.walkMin, icon: Navigation }]
      : [{ name: '社区公园', walkMin: 5, icon: Footprints }]),
    { name: '生鲜超市', walkMin: 8, icon: ShoppingCart },
  ]

  return (
    <section className={cn('rounded-2xl border border-charcoal-100 bg-white p-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-charcoal-900">位置信息</h2>
        <Link
          to={`/map?focus=${listing.id}`}
          className="text-sm text-brand-600 hover:text-brand-700"
        >
          查看大图 →
        </Link>
      </div>

      <div className="mt-3 text-sm text-charcoal-600 flex items-center gap-1.5">
        <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
        <span>
          {listing.block} · {listing.district}
          {subway ? ` · ${subway.line} ${subway.station} ${subway.walkMin}分钟` : ''}
        </span>
      </div>

      <div className="mt-4 h-80 rounded-xl overflow-hidden border border-charcoal-100">
        <MapContainer
          listings={[listing]}
          center={listing.coords}
          zoom={15}
          height="100%"
          showMiniCard={false}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {pois.map((poi) => {
          const Icon = poi.icon
          return (
            <div
              key={poi.name}
              className="flex items-center gap-2 p-3 rounded-lg bg-charcoal-50/50"
            >
              <Icon className="w-4 h-4 text-brand-500 shrink-0" />
              <div className="text-xs min-w-0">
                <div className="text-charcoal-700 truncate">{poi.name}</div>
                <div className="text-charcoal-400">步行 {poi.walkMin} 分钟</div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
