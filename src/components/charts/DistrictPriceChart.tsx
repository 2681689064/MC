import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { TooltipProps } from 'recharts'
import { TIANJIN_DISTRICTS } from '@/data/tianjinDistricts'
import { formatPrice } from '@/lib/format'
import type { DistrictGroup } from '@/types/listing'

const GROUP_COLOR: Record<DistrictGroup, string> = {
  inner: '#FF5516',
  suburb: '#FF9E71',
  outer: '#8E8E93',
}

interface ChartDatum {
  name: string
  price: number
  group: DistrictGroup
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) return null
  const datum = (payload[0].payload ?? {}) as ChartDatum
  return (
    <div className="bg-charcoal-900 text-white rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="font-display">{datum.name}</div>
      <div className="font-numeric mt-0.5">
        ¥{formatPrice(datum.price)}
        <span className="text-charcoal-300 ml-1">/月</span>
      </div>
    </div>
  )
}

export function DistrictPriceChart() {
  const data: ChartDatum[] = [...TIANJIN_DISTRICTS]
    .sort((a, b) => b.avgPrice - a.avgPrice)
    .map((d) => ({ name: d.name, price: d.avgPrice, group: d.group }))

  return (
    <ResponsiveContainer width="100%" height={480}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 32, top: 8, bottom: 8 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={60}
          tick={{ fontSize: 12, fill: '#48484A' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} content={<CustomTooltip />} />
        <Bar dataKey="price" radius={[0, 6, 6, 0]} barSize={18}>
          {data.map((entry, idx) => (
            <Cell key={idx} fill={GROUP_COLOR[entry.group]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
