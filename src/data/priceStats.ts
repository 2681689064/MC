import type { PriceTrendPoint, RoomTypeStat } from '@/types/listing'

// 天津整体租金走势：12 个月，从 2025-08 倒推到 2024-09
// avgPrice 在 3800-4600 之间波动，呈现温和上行趋势（含春节前后小幅回调）
export const PRICE_TREND: PriceTrendPoint[] = [
  { month: '2025-08', avgPrice: 4520, medianPrice: 4210 },
  { month: '2025-07', avgPrice: 4480, medianPrice: 4190 },
  { month: '2025-06', avgPrice: 4450, medianPrice: 4100 },
  { month: '2025-05', avgPrice: 4380, medianPrice: 4080 },
  { month: '2025-04', avgPrice: 4320, medianPrice: 3990 },
  { month: '2025-03', avgPrice: 4250, medianPrice: 3920 },
  { month: '2025-02', avgPrice: 4180, medianPrice: 3890 },
  { month: '2025-01', avgPrice: 4100, medianPrice: 3780 },
  { month: '2024-12', avgPrice: 4150, medianPrice: 3860 },
  { month: '2024-11', avgPrice: 4080, medianPrice: 3750 },
  { month: '2024-10', avgPrice: 4020, medianPrice: 3740 },
  { month: '2024-09', avgPrice: 3950, medianPrice: 3650 },
]

// 户型分布：count = share × 2480（约总房源数），合计 2480
export const ROOM_TYPE_STATS: RoomTypeStat[] = [
  { type: '1室1厅', count: 446, share: 0.18 },
  { type: '2室1厅', count: 794, share: 0.32 },
  { type: '2室2厅', count: 298, share: 0.12 },
  { type: '3室1厅', count: 248, share: 0.1 },
  { type: '3室2厅', count: 347, share: 0.14 },
  { type: '4室及以上', count: 149, share: 0.06 },
  { type: '开间', count: 198, share: 0.08 },
]
