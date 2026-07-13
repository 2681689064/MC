/** 价格格式化：4500 → "4,500" */
export function formatPrice(price: number): string {
  return price.toLocaleString('en-US')
}

/** 价格带单位："4,500 元/月" */
export function formatPriceWithUnit(price: number): string {
  return `${formatPrice(price)} 元/月`
}

/** 价格区间："3,000 - 5,000" */
export function formatPriceRange(min: number, max: number): string {
  return `${formatPrice(min)} - ${formatPrice(max)}`
}

/** 面积："86㎡" */
export function formatArea(area: number): string {
  return `${area}㎡`
}

/** 均价："58 元/㎡·月" */
export function formatPricePerSqm(price: number, area: number): string {
  if (area <= 0) return '-'
  return `${Math.round(price / area)} 元/㎡·月`
}

/** 相对时间："3天前" */
export function formatRelativeTime(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diff = Math.max(0, now - then)
  const day = 24 * 60 * 60 * 1000
  const days = Math.floor(diff / day)
  if (days <= 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  if (days < 365) return `${Math.floor(days / 30)}月前`
  return `${Math.floor(days / 365)}年前`
}

/** 月份："2025-08" → "8月" */
export function formatMonthShort(month: string): string {
  const [, m] = month.split('-')
  return `${parseInt(m, 10)}月`
}

/** 浏览量："1.2k" */
export function formatViews(n: number): string {
  if (n < 1000) return `${n}`
  if (n < 10000) return `${(n / 1000).toFixed(1)}k`
  return `${(n / 10000).toFixed(1)}w`
}

/** 环比变化："+2.3%" / "-1.2%" */
export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(1)}%`
}
