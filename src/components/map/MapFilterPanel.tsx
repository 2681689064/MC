import { useState, type ReactNode } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { PRICE_RANGES, ROOM_TYPE_OPTIONS } from '@/lib/constants'
import { useFilterStore } from '@/store/filterStore'

interface PriceRange {
  label: string
  min: number
  max: number
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-8 px-2.5 text-xs rounded-full border transition-colors truncate text-center',
        active
          ? 'border-brand-500 bg-brand-50 text-brand-700'
          : 'border-charcoal-200 text-charcoal-700 hover:border-brand-400',
      )}
    >
      {children}
    </button>
  )
}

/** 地图浮层筛选面板 */
export function MapFilterPanel({ className }: { className?: string }) {
  const filter = useFilterStore()
  const [collapsed, setCollapsed] = useState(false)

  const activePrice = PRICE_RANGES.find(
    (r) => r.min === filter.priceMin && r.max === filter.priceMax,
  )

  const handlePrice = (r: PriceRange | null) => {
    if (r) filter.setFilter({ priceMin: r.min, priceMax: r.max })
    else filter.setFilter({ priceMin: undefined, priceMax: undefined })
  }

  const handleReset = () => {
    filter.setFilter({
      priceMin: undefined,
      priceMax: undefined,
      roomTypes: [],
      directOnly: false,
    })
  }

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        aria-label="展开筛选"
        className={cn(
          'absolute top-4 left-4 z-[1000] grid place-items-center w-11 h-11 rounded-full',
          'bg-white shadow-xl border border-charcoal-100 hover:border-brand-300 transition-colors',
          className,
        )}
      >
        <SlidersHorizontal className="w-5 h-5 text-charcoal-700" />
      </button>
    )
  }

  return (
    <div
      className={cn(
        'absolute top-4 left-4 right-4 md:right-auto md:w-72 z-[1000]',
        'rounded-2xl bg-white shadow-xl border border-charcoal-100 p-4',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-charcoal-700" />
          <span className="font-display text-sm text-charcoal-900">筛选</span>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          aria-label="收起筛选"
          className="grid place-items-center w-7 h-7 rounded-full text-charcoal-500 hover:bg-charcoal-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4">
        <div className="text-xs font-medium text-charcoal-500 mb-2">价格</div>
        <div className="grid grid-cols-2 gap-1.5">
          <Chip active={!activePrice} onClick={() => handlePrice(null)}>
            不限
          </Chip>
          {PRICE_RANGES.map((r) => (
            <Chip
              key={r.label}
              active={activePrice?.label === r.label}
              onClick={() => handlePrice(r)}
            >
              {r.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs font-medium text-charcoal-500 mb-2">户型</div>
        <div className="grid grid-cols-3 gap-1.5">
          {ROOM_TYPE_OPTIONS.map((rt) => (
            <Chip
              key={rt}
              active={filter.roomTypes.includes(rt)}
              onClick={() => filter.toggleArray('roomTypes', rt)}
            >
              {rt}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => filter.setFilter({ directOnly: !filter.directOnly })}
          className={cn(
            'w-full flex items-center justify-between h-9 px-3 rounded-full border text-sm transition-colors',
            filter.directOnly
              ? 'border-brand-500 bg-brand-50 text-brand-700'
              : 'border-charcoal-200 text-charcoal-700 hover:border-brand-400',
          )}
        >
          <span>仅看房东直租</span>
          <span
            className={cn(
              'text-xs',
              filter.directOnly ? 'text-brand-600' : 'text-charcoal-400',
            )}
          >
            {filter.directOnly ? '已开启' : '关闭'}
          </span>
        </button>
      </div>

      <div className="flex gap-2 mt-5">
        <Button variant="ghost" size="sm" className="flex-1" onClick={handleReset}>
          重置
        </Button>
        <Button variant="primary" size="sm" className="flex-1" onClick={() => setCollapsed(true)}>
          应用
        </Button>
      </div>
    </div>
  )
}
