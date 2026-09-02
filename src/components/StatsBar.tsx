import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatNumber } from '@/lib/utils';
import { useListingStore } from '@/store/useListingStore';
import { PLATFORM_COLORS, PLATFORM_LABELS, type Platform } from '@/types/house';

const PLATFORMS: Platform[] = [
  'lianjia',
  'beike',
  'anjuke',
  '58',
  'ziroom',
  'personal',
];

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

function StatCard({ label, value, hint }: StatCardProps) {
  return (
    // justify-center：与图表卡同行等高时内容垂直居中，消除底部空荡感
    <div className="flex flex-col justify-center rounded-xl border border-charcoal-100 bg-white p-3">
      <div className="text-xs text-charcoal-400">{label}</div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums text-charcoal-900">
        {value}
      </div>
      {hint && <div className="text-[11px] text-charcoal-400">{hint}</div>}
    </div>
  );
}

export default function StatsBar() {
  const listings = useListingStore((s) => s.listings);
  const filtered = useListingStore((s) => s.getFiltered());

  const { avgPrice, avgPsm, nearSubwayRate, verifiedRate, nearCount, verifiedCount } =
    useMemo(() => {
      const base = filtered.length ? filtered : listings;
      let sum = 0;
      let psm = 0;
      let near = 0;
      let verified = 0;
      for (const l of base) {
        sum += l.price;
        psm += l.price / l.areaSize;
        if (l.nearSubway) near++;
        if (l.isVerified) verified++;
      }
      const n = base.length || 1;
      return {
        avgPrice: Math.round(sum / n),
        avgPsm: Math.round(psm / n),
        nearSubwayRate: Math.round((near / n) * 100),
        verifiedRate: Math.round((verified / n) * 100),
        nearCount: near,
        verifiedCount: verified,
      };
    }, [filtered, listings]);

  const platformData = useMemo(() => {
    const map = new Map<Platform, number>();
    for (const p of PLATFORMS) map.set(p, 0);
    for (const l of listings) map.set(l.platform, (map.get(l.platform) ?? 0) + 1);
    return PLATFORMS.map((p) => ({
      key: p,
      name: PLATFORM_LABELS[p],
      value: map.get(p) ?? 0,
      color: PLATFORM_COLORS[p],
    }));
  }, [listings]);

  const districtData = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of listings) {
      map.set(l.district, (map.get(l.district) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [listings]);

  return (
    /* lg 8 列一行：4 数字卡(各1列) + 平台分布(2列) + 区域分布(2列)，
       恰好排满无第二行空白；图表卡高度对齐数字卡，整体紧凑 */
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      <StatCard
        label="在线房源"
        value={formatNumber(listings.length)}
        hint={`筛选 ${formatNumber(filtered.length)} 套`}
      />
      <StatCard
        label="平均月租"
        value={`¥${formatNumber(avgPrice)}`}
        hint={`¥${avgPsm}/㎡·月`}
      />
      {/* 后两张卡补 hint，四卡均为 3 行内容，大数字基线对齐 */}
      <StatCard
        label="近地铁占比"
        value={`${nearSubwayRate}%`}
        hint={`${formatNumber(nearCount)} 套近地铁`}
      />
      <StatCard
        label="已核验"
        value={`${verifiedRate}%`}
        hint={`${formatNumber(verifiedCount)} 套已核验`}
      />

      {/* 平台分布：左侧小环图 + 右侧两列带数值图例，填满卡宽消除空洞 */}
      <div className="col-span-2 flex flex-col rounded-xl border border-charcoal-100 bg-white p-3">
        <div className="text-xs text-charcoal-400">平台分布</div>
        <div className="flex flex-1 items-center gap-3">
          <div className="h-16 w-16 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={23}
                  outerRadius={31}
                  paddingAngle={1}
                  stroke="none"
                >
                  {platformData.map((d) => (
                    <Cell key={d.key} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number, n: string) => [`${formatNumber(v)} 套`, n]}
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #E5E5EA',
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-charcoal-600">
            {platformData.map((d) => (
              <span key={d.key} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 shrink-0 rounded-full"
                  style={{ background: d.color }}
                />
                <span className="shrink-0">{d.name}</span>
                <span className="ml-auto tabular-nums text-charcoal-400">
                  {formatNumber(d.value)}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-2 flex flex-col rounded-xl border border-charcoal-100 bg-white p-3">
        <div className="mb-1 text-xs text-charcoal-400">区域分布</div>
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={districtData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: '#8E8E93' }}
                tickLine={false}
                axisLine={false}
                interval={0}
              />
              <YAxis hide />
              <Tooltip
                formatter={(v: number) => [`${formatNumber(v)} 套`, '房源数']}
                cursor={{ fill: '#F5F5F7' }}
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #E5E5EA',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" radius={[3, 3, 0, 0]} fill="#FF5516" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
