import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { List } from 'lucide-react'
import { MapContainer } from '@/components/map/MapContainer'
import { MapFilterPanel } from '@/components/map/MapFilterPanel'
import { Button } from '@/components/ui/Button'
import { LISTINGS } from '@/data/mockListings'
import { SUBWAY_LINES } from '@/data/subwayLines'
import { useFilterStore } from '@/store/filterStore'

export function MapView() {
  const filter = useFilterStore()

  const filtered = useMemo(() => {
    let list = [...LISTINGS]
    if (filter.district) list = list.filter((l) => l.district === filter.district)
    if (filter.priceMin !== undefined) list = list.filter((l) => l.price >= filter.priceMin!)
    if (filter.priceMax !== undefined) list = list.filter((l) => l.price <= filter.priceMax!)
    if (filter.roomTypes.length) list = list.filter((l) => filter.roomTypes.includes(l.roomType))
    if (filter.orientations.length)
      list = list.filter((l) => filter.orientations.includes(l.orientation))
    if (filter.subwayLine) {
      const lineName = SUBWAY_LINES.find((l) => l.id === filter.subwayLine)?.name
      list = list.filter((l) => l.subway?.line === lineName)
    }
    if (filter.sources.length) list = list.filter((l) => filter.sources.includes(l.source))
    if (filter.directOnly) list = list.filter((l) => l.isDirectRent)
    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase()
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(kw) ||
          l.block.toLowerCase().includes(kw) ||
          l.district.toLowerCase().includes(kw) ||
          (l.subway?.station.toLowerCase().includes(kw) ?? false),
      )
    }
    return list
  }, [
    filter.district,
    filter.priceMin,
    filter.priceMax,
    filter.roomTypes,
    filter.orientations,
    filter.subwayLine,
    filter.sources,
    filter.directOnly,
    filter.keyword,
  ])

  return (
    <div className="h-full relative">
      <MapContainer listings={filtered} height="100%" />
      <MapFilterPanel />
      <div className="absolute top-4 right-4 z-[1000] px-3 py-2 rounded-full bg-white/95 backdrop-blur shadow-lg text-xs text-charcoal-700 font-numeric">
        共 {filtered.length} 套房源
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
        <Link to="/list">
          <Button variant="secondary" size="sm">
            <List className="w-4 h-4" />
            切换到列表视图
          </Button>
        </Link>
      </div>
    </div>
  )
}
