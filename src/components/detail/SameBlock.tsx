import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { ListingCard } from '@/components/listing/ListingCard'
import { LISTINGS } from '@/data/mockListings'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'
import type { Listing } from '@/types/listing'

interface SameBlockProps {
  listing: Listing
  className?: string
}

export function SameBlock({ listing, className }: SameBlockProps) {
  const others = LISTINGS.filter(
    (l) => l.block === listing.block && l.id !== listing.id,
  ).slice(0, 8)

  return (
    <section className={cn('mt-8', className)}>
      <div className="flex items-end justify-between">
        <h2 className="font-display text-lg text-charcoal-900">同小区在售</h2>
        <Link
          to={`/list?block=${encodeURIComponent(listing.block)}`}
          className="text-sm text-brand-600 hover:text-brand-700"
        >
          查看全部 →
        </Link>
      </div>

      {others.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="暂无同小区在售房源"
          className="py-10"
        />
      ) : (
        <div className="mt-4 flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
          {others.map((item) => (
            <div
              key={item.id}
              className="min-w-[280px] max-w-[280px] snap-start shrink-0"
            >
              <ListingCard listing={item} layout="grid" />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
