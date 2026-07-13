import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ListingCard } from './ListingCard'
import { cn } from '@/lib/utils'
import type { Listing } from '@/types/listing'

interface VirtualListProps {
  listings: Listing[]
  className?: string
}

export function VirtualList({ listings, className }: VirtualListProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: listings.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 220,
    overscan: 5,
  })

  return (
    <div
      ref={parentRef}
      className={cn('h-[calc(100vh-220px)] overflow-y-auto pr-1', className)}
    >
      <div className="relative" style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={listings[item.index].id}
            className="absolute top-0 left-0 w-full"
            style={{ height: item.size, transform: `translateY(${item.start}px)` }}
          >
            <div className="pb-4">
              <ListingCard listing={listings[item.index]} layout="row" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
