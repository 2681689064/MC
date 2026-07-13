import { useState, useEffect } from 'react'
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { createPriceIcon } from './PriceMarker'
import { LISTINGS } from '@/data/mockListings'
import { TIANJIN_DISTRICTS } from '@/data/tianjinDistricts'
import { formatPrice, formatArea } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Listing } from '@/types/listing'

interface MapViewProps {
  listings?: Listing[]
  center?: [number, number]
  zoom?: number
  height?: string
  showMiniCard?: boolean
  className?: string
}

const DEFAULT_CENTER: [number, number] = [39.13, 117.2]

const DISTRICT_NAME: Record<string, string> = Object.fromEntries(
  TIANJIN_DISTRICTS.map((d) => [d.code, d.name]),
)

/** 当 listings 变化时自动适配视野 */
function FitBounds({ listings }: { listings: Listing[] }) {
  const map = useMap()
  useEffect(() => {
    if (!listings.length) return
    if (listings.length === 1) {
      map.setView(listings[0].coords, 14)
      return
    }
    map.fitBounds(listings.map((l) => l.coords), { padding: [40, 40] })
  }, [listings, map])
  return null
}

export function MapContainer({
  listings = LISTINGS,
  center = DEFAULT_CENTER,
  zoom = 12,
  height = '100%',
  showMiniCard = true,
  className,
}: MapViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <div className={cn('relative w-full', className)} style={{ height }}>
      <LeafletMapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={listing.coords}
            icon={createPriceIcon(listing, activeId === listing.id)}
            eventHandlers={{ click: () => setActiveId(listing.id) }}
          >
            {showMiniCard && (
              <Popup>
                <div className="w-[240px]">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden">
                    <img
                      src={listing.cover}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-display text-sm text-charcoal-900 line-clamp-1 mt-2">
                    {listing.title}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-numeric text-brand-600 text-lg">
                      ¥{formatPrice(listing.price)}
                    </span>
                    <span className="text-xs text-charcoal-500">元/月</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-charcoal-500">
                    <span>{listing.roomType}</span>
                    <span>·</span>
                    <span>{formatArea(listing.area)}</span>
                    <span>·</span>
                    <span>{DISTRICT_NAME[listing.district] ?? listing.district}</span>
                  </div>
                  <Link
                    to={`/list/${listing.id}`}
                    className="mt-2 block text-center h-8 leading-8 rounded-lg bg-brand-500 text-white text-xs hover:bg-brand-600 transition-colors"
                  >
                    查看详情
                  </Link>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
        <FitBounds listings={listings} />
      </LeafletMapContainer>
    </div>
  )
}
