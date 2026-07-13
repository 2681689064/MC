import { Link } from 'react-router-dom'
import { HeartOff } from 'lucide-react'
import { ListingCard } from '@/components/listing/ListingCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { getListingById } from '@/data/mockListings'
import { useFavoritesStore } from '@/store/favoritesStore'

export function Favorites() {
  const ids = useFavoritesStore((s) => s.ids)
  const clear = useFavoritesStore((s) => s.clear)

  const listings = ids
    .map((id) => getListingById(id))
    .filter((l): l is NonNullable<typeof l> => l !== undefined)

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl text-charcoal-900">我的收藏</h1>
          <p className="text-sm text-charcoal-500 mt-1">已收藏 {listings.length} 套房源</p>
        </div>
        {listings.length > 0 && (
          <Button variant="outline" size="sm" onClick={clear}>
            清空收藏
          </Button>
        )}
      </div>

      {listings.length === 0 ? (
        <div className="py-20">
          <EmptyState
            icon={HeartOff}
            title="还没有收藏房源"
            description="去发现你心仪的家"
            action={
              <Link to="/list">
                <Button variant="primary">浏览房源</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} layout="grid" />
          ))}
        </div>
      )}
    </div>
  )
}
