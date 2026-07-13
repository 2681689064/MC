import { Link, useLocation } from 'react-router-dom'
import { Home as HomeIcon, Map as MapIcon, BarChart3, Heart, User } from 'lucide-react'
import { useFavoritesStore } from '@/store/favoritesStore'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface TabItem {
  to: string
  label: string
  icon: typeof HomeIcon
}

const TABS: TabItem[] = [
  { to: '/', label: '首页', icon: HomeIcon },
  { to: '/map', label: '地图找房', icon: MapIcon },
  { to: '/insights', label: '数据', icon: BarChart3 },
  { to: '/favorites', label: '收藏', icon: Heart },
  { to: '/publish', label: '我的', icon: User },
]

function isActive(pathname: string, to: string): boolean {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function BottomNav() {
  const { pathname } = useLocation()
  const favoritesCount = useFavoritesStore((s) => s.ids.length)

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden z-40 backdrop-blur-xl bg-[var(--color-bg)]/90 border-t border-charcoal-100 h-16 grid grid-cols-5">
      {TABS.map(({ to, label, icon: Icon }) => {
        const active = isActive(pathname, to)
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              'relative flex flex-col items-center justify-center gap-0.5 text-[10px] transition-colors',
              active ? 'text-brand-600' : 'text-charcoal-500',
            )}
          >
            <div className="relative">
              <Icon className={cn('w-5 h-5', active && 'fill-current')} />
              {to === '/favorites' && (
                <Badge
                  count={favoritesCount}
                  className="absolute -top-1.5 -right-2 ring-1 ring-[var(--color-bg)]"
                />
              )}
            </div>
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
