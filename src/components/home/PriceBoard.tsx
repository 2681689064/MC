import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { PRICE_TREND } from '@/data/priceStats'
import { TIANJIN_DISTRICTS } from '@/data/tianjinDistricts'
import { formatPrice, formatChange } from '@/lib/format'

const TOP_DISTRICTS = [...TIANJIN_DISTRICTS]
  .sort((a, b) => b.avgPrice - a.avgPrice)
  .slice(0, 5)

export function PriceBoard() {
  const latest = PRICE_TREND[0]
  const prev = PRICE_TREND[1]
  const momChange = prev ? ((latest.avgPrice - prev.avgPrice) / prev.avgPrice) * 100 : 0
  const isUp = momChange >= 0

  return (
    <section className="mt-16 md:mt-24">
      <div>
        <h2 className="font-display text-2xl md:text-3xl text-charcoal-900">天津租房行情</h2>
        <p className="text-sm text-charcoal-500 mt-1">2025 年 8 月 · 基于全网 4,820 套房源</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* 全市均价 */}
        <div className="lg:col-span-1 rounded-3xl bg-charcoal-900 text-white p-8 relative overflow-hidden">
          <div className="text-xs text-charcoal-300 uppercase tracking-wider">全市均价</div>
          <div className="font-numeric text-5xl font-semibold mt-3">
            {formatPrice(latest.avgPrice)}
          </div>
          <div className="text-sm text-charcoal-300 mt-1">元/月 · 整租</div>
          <span
            className={`mt-6 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
              isUp ? 'bg-mint-500/15 text-mint-400' : 'bg-brand-500/15 text-brand-400'
            }`}
          >
            {isUp ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {formatChange(momChange)}
          </span>
          <span className="font-numeric text-[200px] opacity-5 -bottom-12 -right-4 absolute leading-none select-none pointer-events-none">
            ¥
          </span>
        </div>

        {/* Top 5 热门区域 */}
        <div className="lg:col-span-2 rounded-3xl border border-charcoal-100 bg-white p-6">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-lg">热门区域均价</h3>
            <span className="text-xs text-charcoal-400">Top 5</span>
          </div>

          <div className="mt-2">
            {TOP_DISTRICTS.map((d, i) => {
              const up = d.momChange >= 0
              return (
                <Link
                  key={d.code}
                  to={`/list?district=${d.code}`}
                  className="grid grid-cols-[1fr_auto_auto] gap-4 items-center py-3 border-b border-charcoal-100 last:border-0 hover:bg-charcoal-50/60 transition rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`font-numeric text-lg ${
                        i < 3 ? 'text-brand-500' : 'text-charcoal-400'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="font-display text-base text-charcoal-900 truncate">
                      {d.name}
                    </span>
                    <span className="text-xs text-charcoal-400">{d.listingCount} 套</span>
                  </div>
                  <div className="font-numeric text-lg font-semibold text-charcoal-900">
                    ¥{formatPrice(d.avgPrice)}
                  </div>
                  <div
                    className={`text-xs font-numeric ${up ? 'text-mint-600' : 'text-brand-500'}`}
                  >
                    {formatChange(d.momChange)}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
