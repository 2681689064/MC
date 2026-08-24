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
