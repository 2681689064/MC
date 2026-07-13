import { List, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SORT_OPTIONS } from '@/lib/constants'
import { useFilterStore } from '@/store/filterStore'

interface SortBarProps {
  total: number
  className?: string
}

export function SortBar({ total, className }: SortBarProps) {
  const sort = useFilterStore((s) => s.sort)
  const view = useFilterStore((s) => s.view)
  const setFilter = useFilterStore((s) => s.setFilter)

  return (
    <div className={cn('flex items-center justify-between py-4', className)}>
      <div className="text-sm text-charcoal-500">
        共 <span className="font-numeric text-charcoal-900">{total}</span> 套房源
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter({ sort: opt.value })}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full transition-colors',
                sort === opt.value
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-charcoal-100',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex items-center bg-charcoal-100 rounded-full p-1">
          <button
            type="button"
            aria-label="列表视图"
            onClick={() => setFilter({ view: 'list' })}
            className={cn(
              'grid place-items-center w-8 h-8 rounded-full transition-all',
              view === 'list' ? 'bg-white shadow-sm text-brand-600' : 'text-charcoal-500',
            )}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="地图视图"
            onClick={() => setFilter({ view: 'map' })}
            className={cn(
              'grid place-items-center w-8 h-8 rounded-full transition-all',
              view === 'map' ? 'bg-white shadow-sm text-brand-600' : 'text-charcoal-500',
            )}
          >
            <MapPin className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
