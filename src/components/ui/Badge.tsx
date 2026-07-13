import { cn } from '@/lib/utils'

interface BadgeProps {
  count: number
  max?: number
  className?: string
}

export function Badge({ count, max = 99, className }: BadgeProps) {
  if (count <= 0) return null

  const display = count > max ? `${max}+` : count

  return (
    <span
      className={cn(
        'bg-brand-500 text-white text-[10px] font-numeric rounded-full',
        'min-w-[18px] h-[18px] px-1 flex items-center justify-center',
        className,
      )}
    >
      {display}
    </span>
  )
}
