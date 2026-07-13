import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { TooltipProps } from 'recharts'
import { PRICE_TREND } from '@/data/priceStats'
import { formatMonthShort, formatPrice } from '@/lib/format'

interface TrendDatum {
  month: string
  avgPrice: number
  medianPrice: number
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) return null
  const datum = (payload[0].payload ?? {}) as TrendDatum
  return (
    <div className="bg-charcoal-900 text-white rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="font-display">{formatMonthShort(datum.month)}</div>
      <div className="mt-0.5 flex items-center gap-1.5">
        <span className="text-charcoal-300">均价</span>
        <span className="font-numeric">¥{formatPrice(datum.avgPrice)}</span>
      </div>
      <div className="mt-0.5 flex items-center gap-1.5">
        <span className="text-charcoal-300">中位</span>
        <span className="font-numeric">¥{formatPrice(datum.medianPrice)}</span>
      </div>
    </div>
  )
}

export function TrendChart() {
  const data = [...PRICE_TREND].reverse()
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF5516" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#FF5516" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#E5E5EA" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonthShort}
          tick={{ fontSize: 11, fill: '#8E8E93' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={['dataMin - 100', 'dataMax + 100']}
          tickFormatter={(v) => `¥${v}`}
          tick={{ fontSize: 11, fill: '#8E8E93' }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="avgPrice"
          stroke="#FF5516"
          strokeWidth={2}
          fill="url(#brandGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
