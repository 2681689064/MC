import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { TooltipProps } from 'recharts'
import { ROOM_TYPE_STATS } from '@/data/priceStats'

const COLORS = ['#FF5516', '#FF7B47', '#FF9E71', '#FFC5A8', '#8E8E93', '#636366', '#48484A']

interface PieDatum {
  type: string
  count: number
  share: number
}

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) return null
  const datum = (payload[0].payload ?? {}) as PieDatum
  return (
    <div className="bg-charcoal-900 text-white rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="font-display">{datum.type}</div>
      <div className="mt-0.5 flex items-center gap-1.5">
        <span className="text-charcoal-300">套数</span>
        <span className="font-numeric">{datum.count}</span>
      </div>
      <div className="mt-0.5 flex items-center gap-1.5">
        <span className="text-charcoal-300">占比</span>
        <span className="font-numeric">{(datum.share * 100).toFixed(1)}%</span>
      </div>
    </div>
  )
}

export function RoomTypePie() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={ROOM_TYPE_STATS}
          dataKey="count"
          nameKey="type"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          stroke="none"
        >
          {ROOM_TYPE_STATS.map((entry, idx) => (
            <Cell key={entry.type} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          formatter={(value, entry) => {
            const datum = (entry?.payload ?? {}) as PieDatum
            return (
              <span className="text-xs text-charcoal-600 ml-1">
                {value} ·{' '}
                <span className="font-numeric">{(datum.share * 100).toFixed(1)}%</span>
              </span>
            )
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
