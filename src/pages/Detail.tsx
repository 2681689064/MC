import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Home as HomeIcon } from 'lucide-react'
import { ImageCarousel } from '@/components/detail/ImageCarousel'
import { BasicInfo } from '@/components/detail/BasicInfo'
import { Facilities } from '@/components/detail/Facilities'
import { LocationMap } from '@/components/detail/LocationMap'
import { SameBlock } from '@/components/detail/SameBlock'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { getListingById } from '@/data/mockListings'
import { useHistoryStore } from '@/store/historyStore'

export function Detail() {
  const { id } = useParams<{ id: string }>()
  const listing = id ? getListingById(id) : undefined
  const pushHistory = useHistoryStore((s) => s.push)

  useEffect(() => {
    if (listing) pushHistory(listing.id)
  }, [listing, pushHistory])

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <EmptyState
          icon={HomeIcon}
          title="房源不存在或已下架"
          description="该房源可能已被房东移除"
          action={
            <Link to="/list">
              <Button variant="primary">浏览其他房源</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 animate-fade-in">
      {/* 面包屑 */}
      <nav className="text-xs text-charcoal-400 mb-4 flex items-center gap-1.5">
        <Link to="/" className="hover:text-brand-600">
          首页
        </Link>
        <span>/</span>
        <Link to="/list" className="hover:text-brand-600">
          房源
        </Link>
        <span>/</span>
        <span className="text-charcoal-600">{listing.block}</span>
      </nav>

      {/* 主图 + 基本信息 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-7">
          <ImageCarousel images={listing.images} alt={listing.title} />
        </div>
        <div className="lg:col-span-5">
          <BasicInfo listing={listing} />
        </div>
      </div>

      {/* 配套设施 */}
      <div className="mt-8">
        <Facilities listing={listing} />
      </div>

      {/* 位置地图 */}
      <div className="mt-8">
        <LocationMap listing={listing} />
      </div>

      {/* 同小区在售 */}
      <SameBlock listing={listing} />
    </div>
  )
}
