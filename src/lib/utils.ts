import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 数值千分位 */
export function formatNumber(n: number): string {
  return n.toLocaleString('zh-CN');
}

/** 价格区间归一为简短标签，如 ¥2000-3000/月 */
export function formatPriceRange(min: number, max: number): string {
  if (min === max) return `¥${min}/月`;
  return `¥${min}-${max}/月`;
}

/** 限制 range 到 [min,max] */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** 相对发布时间：今天/昨天/N天前/N周前/N月前 */
export function timeAgo(ts: number): string {
  const day = 86400000;
  const d = Math.floor((Date.now() - ts) / day);
  if (d <= 0) return '今天';
  if (d === 1) return '昨天';
  if (d < 7) return `${d}天前`;
  if (d < 30) return `${Math.floor(d / 7)}周前`;
  return `${Math.floor(d / 30)}月前`;
}

/** haversine 球面距离（米），用于"距我最近"排序与定位展示 */
export function distanceMeters(
  lng1: number,
  lat1: number,
  lng2: number,
  lat2: number,
): number {
  const R = 6371000; // 地球半径（米）
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** 人类可读距离：<1000m 显示米，否则显示公里（1 位小数） */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}
