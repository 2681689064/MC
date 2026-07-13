import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'brand' | 'mint' | 'charcoal' | 'outline' | 'direct'

interface TagProps {
  variant?: Variant
  size?: 'sm' | 'md'
  children: ReactNode
  className?: string
}

const VARIANT: Record<Variant, string> = {
  brand: 'bg-brand-50 text-brand-700',
  mint: 'bg-mint-50 text-mint-700',
  charcoal: 'bg-charcoal-100 text-charcoal-700',
  outline: 'border border-charcoal-200 text-charcoal-600',
  direct: 'bg-charcoal-900 text-white',
}

const SIZE = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
} as const

export function Tag({ variant = 'brand', size = 'md', children, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap',
        VARIANT[variant],
        SIZE[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
