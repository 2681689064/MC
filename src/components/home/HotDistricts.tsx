import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { TIANJIN_DISTRICTS, DISTRICT_GROUPS } from '@/data/tianjinDistricts'
import { formatPrice } from '@/lib/format'
import type { DistrictGroup } from '@/types/listing'

const GROUP_EN: Record<DistrictGroup, string> = {
  inner: 'INNER CITY',
  suburb: 'SUBURBAN RING',
  outer: 'OUTER METRO',
}

export function HotDistricts() {
  return (
    <section className="mt-16 md:mt-24">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal-900">
            热门区域
          </h2>
          <p className="text-sm text-charcoal-500 mt-1">
            天津 16 个行政区，从市内六区到远郊六区
          </p>
        </div>
      </div>

      {DISTRICT_GROUPS.map((group) => {
        const districts = TIANJIN_DISTRICTS.filter((d) => d.group === group.value)
        return (
          <div key={group.value}>
            <h3 className="text-xs font-medium text-charcoal-400 uppercase tracking-wider mt-8 mb-4">
              {group.label} · {GROUP_EN[group.value]}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {districts.map((d) => (
                <Link
                  key={d.code}
                  to={`/list?district=${d.code}`}
                  className="group relative overflow-hidden rounded-2xl border border-charcoal-100 bg-white p-4 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-300"
                >
                  <div className="font-display text-base font-semibold text-charcoal-900">
                    {d.name}
                  </div>
                  <div className="font-numeric text-sm text-brand-600 mt-1">
                    ¥{formatPrice(d.avgPrice)}/月
                  </div>
                  <div className="text-xs text-charcoal-400 mt-1">{d.listingCount} 套在售</div>
                  <ArrowUpRight className="absolute top-3 right-3 h-4 w-4 text-charcoal-300 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}
