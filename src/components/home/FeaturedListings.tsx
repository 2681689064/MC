import { Link } from 'react-router-dom'
import { LISTINGS } from '@/data/mockListings'
import { ListingCard } from '@/components/listing/ListingCard'

const FEATURED = LISTINGS.filter((l) => l.featured === true).slice(0, 6)

export function FeaturedListings() {
  return (
    <section className="mt-16 md:mt-24">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl md:text-3xl text-charcoal-900">精选房源</h2>
          <p className="text-sm text-charcoal-500 mt-1">今日编辑亲选 · 6 套优质房源</p>
        </div>
        <Link to="/list" className="text-sm text-brand-600 hover:text-brand-700">
          查看全部 →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {FEATURED.map((listing) => (
          <ListingCard key={listing.id} listing={listing} layout="grid" />
        ))}
      </div>
    </section>
  )
}
