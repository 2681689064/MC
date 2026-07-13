import { useMemo } from 'react'
import { TrendChart } from '@/components/charts/TrendChart'
import { RoomTypePie } from '@/components/charts/RoomTypePie'
import { DistrictPriceChart } from '@/components/charts/DistrictPriceChart'
import { LISTINGS } from '@/data/mockListings'
import { PRICE_TREND } from '@/data/priceStats'
import { formatPrice, formatChange } from '@/lib/format'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string
  unit: string
  change?: string
  changeUp?: boolean
}

function KpiCard({ label, value, unit, change, changeUp }: KpiCardProps) {
  return (
    <div className="rounded-2xl bg-white border border-charcoal-100 p-5">
      <div className="text-xs text-charcoal-500">{label}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-numeric text-3xl text-brand-600">{value}</span>
        <span className="text-xs text-charcoal-500">{unit}</span>
      </div>
      {change && (
        <div className={cn('mt-1 text-xs', changeUp ? 'text-brand-600' : 'text-mint-600')}>
          环比 {change}
        </div>
      )}
    </div>
  )
}

interface HotBlock {
  block: string
  count: number
  avgPrice: number
}

export function Insights() {
  const avgPrice = PRICE_TREND[0].avgPrice
  const prevPrice = PRICE_TREND[1].avgPrice
  const momChange = ((avgPrice - prevPrice) / prevPrice) * 100

  const hotBlocks = useMemo<HotBlock[]>(() => {
    const map = new Map<string, { block: string; count: number; totalPrice: number }>()
    for (const l of LISTINGS) {
      const entry = map.get(l.block) ?? { block: l.block, count: 0, totalPrice: 0 }
      entry.count++
      entry.totalPrice += l.price
      map.set(l.block, entry)
    }
    return [...map.values()]
      .map((e) => ({
        block: e.block,
        count: e.count,
        avgPrice: Math.round(e.totalPrice / e.count),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 animate-fade-in">
      <header>
        <h1 className="font-display text-3xl md:text-4xl text-charcoal-900">天津租房数据看板</h1>
        <p className="text-sm text-charcoal-500 mt-2">基于全网 4,820 套在租房源 · 2025 年 8 月</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <KpiCard
          label="全市均价"
          value={formatPrice(avgPrice)}
          unit="元/月"
          change={formatChange(momChange)}
          changeUp={momChange >= 0}
        />
        <KpiCard label="在租房源数" value="4,820" unit="套" />
        <KpiCard label="直租占比" value="15" unit="%" />
        <KpiCard label="平均看房次数" value="68" unit="次/套" />
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-charcoal-100 p-6">
          <h2 className="font-display text-lg text-charcoal-900">租金走势 · 近 12 个月</h2>
          <p className="text-xs text-charcoal-400">全市整租均价</p>
          <div className="mt-4">
            <TrendChart />
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-charcoal-100 p-6">
          <h2 className="font-display text-lg text-charcoal-900">户型分布</h2>
          <p className="text-xs text-charcoal-400">各户型在租房源占比</p>
          <div className="mt-4">
            <RoomTypePie />
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-charcoal-100 p-6">
          <h2 className="font-display text-lg text-charcoal-900">16 区均价排行</h2>
          <p className="text-xs text-charcoal-400">按区域分组着色</p>
          <div className="mt-4">
            <DistrictPriceChart />
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-white border border-charcoal-100 p-6">
          <h2 className="font-display text-lg text-charcoal-900">热门小区 Top 5</h2>
          <p className="text-xs text-charcoal-400">按在租房源数量排序</p>
          <ul className="mt-4 divide-y divide-charcoal-100">
            {hotBlocks.map((b, idx) => (
              <li key={b.block} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="font-numeric text-lg text-charcoal-300 w-6">{idx + 1}</span>
                  <span className="font-display text-base text-charcoal-900">{b.block}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-charcoal-500">
                    在租 <span className="font-numeric text-charcoal-900">{b.count}</span> 套
                  </span>
                  <span className="text-charcoal-500">
                    均价 <span className="font-numeric text-brand-600">{formatPrice(b.avgPrice)}</span> 元/月
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
