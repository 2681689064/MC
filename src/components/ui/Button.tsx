import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const VARIANT: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm shadow-brand-500/20',
  secondary: 'bg-charcoal-900 text-white hover:bg-charcoal-800 active:bg-charcoal-700',
  ghost: 'text-charcoal-700 hover:bg-charcoal-100 active:bg-charcoal-200',
  outline:
    'border border-charcoal-200 text-charcoal-900 hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50/50',
}

const SIZE: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-7 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-medium',
          'transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
          'active:scale-[0.98]',
          VARIANT[variant],
          SIZE[size],
          className,
        )}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'
