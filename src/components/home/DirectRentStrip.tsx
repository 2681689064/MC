import { Link } from 'react-router-dom'
import { Heart, Sparkles } from 'lucide-react'
import { Tag } from '@/components/ui/Tag'
import { LISTINGS } from '@/data/mockListings'
import { useFavoritesStore } from '@/store/favoritesStore'
import { formatPrice } from '@/lib/format'
import type { Listing } from '@/types/listing'

const DIRECT_LISTINGS = LISTINGS.filter((l) => l.isDirectRent).slice(0, 8)

function DirectRentCard({ listing }: { listing: Listing }) {
  const isFav = useFavoritesStore((s) => s.has(listing.id))
  const toggle = useFavoritesStore((s) => s.toggle)

  return (
    <Link
      to={`/list/${listing.id}`}
      className="group min-w-[280px] max-w-[280px] snap-start shrink-0 rounded-2xl border border-charcoal-100 bg-white overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-charcoal-900/10 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
        <img
          src={listing.cover}
          alt={listing.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <Tag variant="direct">房东直租</Tag>
        </div>
        <button
          type="button"
          aria-label={isFav ? '取消收藏' : '收藏'}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggle(listing.id)
          }}
          className="absolute top-3 right-3 grid place-items-center h-8 w-8 rounded-full bg-white/90 backdrop-blur hover:bg-white transition"
        >
          <Heart
            className={`h-4 w-4 transition ${
              isFav ? 'fill-brand-500 text-brand-500' : 'text-charcoal-400'
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <div className="font-display text-base text-charcoal-900 line-clamp-1">
          {listing.title}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="font-numeric text-xl text-brand-600">
            {formatPrice(listing.price)}
          </span>
          <span className="text-xs text-charcoal-500">元/月</span>
        </div>
        <div className="mt-2 text-xs text-charcoal-500 flex gap-2">
          <span>{listing.roomType}</span>
          <span>·</span>
          <span>{listing.area}㎡</span>
          <span>·</span>
          <span className="truncate">{listing.block}</span>
        </div>
      </div>
    </Link>
  )
}

export function DirectRentStrip() {
  return (
    <section className="mt-16 md:mt-24">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl md:text-3xl text-charcoal-900">房东直租</h2>
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-mint-600">
            <Sparkles className="h-4 w-4" />
            0 中介费 · 100% 个人房东 · 已实名校验
          </p>
        </div>
        <Link to="/list?direct=1" className="text-sm text-brand-600 hover:text-brand-700">
          查看全部直租 →
        </Link>
      </div>

      <div className="mt-8 flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory">
        {DIRECT_LISTINGS.map((listing) => (
          <DirectRentCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  )
}
