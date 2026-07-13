import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { FilterBar } from '@/components/listing/FilterBar'
import { SortBar } from '@/components/listing/SortBar'
import { VirtualList } from '@/components/listing/VirtualList'
import { MapContainer } from '@/components/map/MapContainer'
import { MapFilterPanel } from '@/components/map/MapFilterPanel'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { LISTINGS } from '@/data/mockListings'
import { SUBWAY_LINES } from '@/data/subwayLines'
import { useFilterStore } from '@/store/filterStore'
import type { FilterState } from '@/store/filterStore'

type FilterPatch = Partial<Omit<FilterState, 'setFilter' | 'toggleArray' | 'reset'>>

export function Listing() {
  const filter = useFilterStore()
  const [searchParams] = useSearchParams()

  // 初次挂载：从 URL 读取并同步到 filterStore
  useEffect(() => {
    const district = searchParams.get('district') || undefined
    const direct = searchParams.get('direct') === '1'
    const q = searchParams.get('q') || undefined
    const block = searchParams.get('block') || undefined
    const patch: FilterPatch = {}
    if (district) patch.district = district
    if (direct) patch.directOnly = true
    if (q) patch.keyword = q
    // block 当作 keyword 处理（q 优先）
    if (block && !q) patch.keyword = block
    if (Object.keys(patch).length > 0) filter.setFilter(patch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 过滤 + 排序逻辑
  const filtered = useMemo(() => {
    let list = [...LISTINGS]
    // listing.district 与 filter.district 均存的是区 code（如 'heping'），可直接比较
    if (filter.district) list = list.filter((l) => l.district === filter.district)
    if (filter.priceMin !== undefined) list = list.filter((l) => l.price >= filter.priceMin!)
    if (filter.priceMax !== undefined) list = list.filter((l) => l.price <= filter.priceMax!)
    // roomType 选项与 listing.roomType 取值一致，直接 includes
    if (filter.roomTypes.length) list = list.filter((l) => filter.roomTypes.includes(l.roomType))
    if (filter.orientations.length) list = list.filter((l) => filter.orientations.includes(l.orientation))
    // filter.subwayLine 存的是线路 id（如 '1'），listing.subway.line 存的是线路名（如 '1号线'），需转换
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
          (l.subway?.station.toLowerCase().includes(kw) ?? false)
      )
    }
    // 排序
    switch (filter.sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'area-desc':
        list.sort((a, b) => b.area - a.area)
        break
      case 'latest':
        list.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
        break
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
    filter.sort,
    filter.keyword,
  ])

  if (filtered.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <FilterBar />
        <div className="py-20">
          <EmptyState
            icon={SearchX}
            title="没有找到匹配的房源"
            description="试着放宽筛选条件，或重置所有筛选"
            action={
              <Button variant="primary" onClick={() => filter.reset()}>
                重置筛选
              </Button>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <FilterBar />
      <SortBar total={filtered.length} />
      {filter.view === 'list' ? (
        <VirtualList listings={filtered} />
      ) : (
        <div className="relative h-[calc(100vh-220px)] rounded-2xl overflow-hidden border border-charcoal-100">
          <MapContainer listings={filtered} height="100%" />
          <MapFilterPanel />
        </div>
      )}
    </div>
  )
}
