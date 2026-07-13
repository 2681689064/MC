import { type LucideIcon, PackageOpen } from 'lucide-react'
import { FACILITY_META } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Listing } from '@/types/listing'

interface FacilitiesProps {
  listing: Listing
  className?: string
}

interface FacilityItem {
  key: string
  label: string
  icon: LucideIcon
}

export function Facilities({ listing, className }: FacilitiesProps) {
  const items: FacilityItem[] = listing.facilities.flatMap((key) => {
    const meta = FACILITY_META[key]
    return meta ? [{ key, label: meta.label, icon: meta.icon }] : []
  })

  return (
    <section className={cn('rounded-2xl border border-charcoal-100 bg-white p-6', className)}>
      <h2 className="font-display text-lg text-charcoal-900">配套设施</h2>

      {items.length === 0 ? (
        <p className="mt-5 text-sm text-charcoal-400 flex items-center gap-2">
          <PackageOpen className="w-4 h-4" />
          暂无配套设施信息
        </p>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-5">
          {items.map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-charcoal-50/50"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-500 shadow-sm">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-charcoal-700">{label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
