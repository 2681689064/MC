import { Link, useLocation } from 'react-router-dom'
import { Home as HomeIcon, Search, MapPin, BarChart3, Plus, Heart } from 'lucide-react'
import { useFavoritesStore } from '@/store/favoritesStore'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface NavItem {
  to: string
  label: string
  icon: typeof HomeIcon
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: '首页', icon: HomeIcon },
  { to: '/list', label: '房源', icon: Search },
  { to: '/map', label: '地图找房', icon: MapPin },
  { to: '/insights', label: '数据看板', icon: BarChart3 },
  { to: '/publish', label: '发布房源', icon: Plus },
]

function isActive(pathname: string, to: string): boolean {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function Header() {
  const { pathname } = useLocation()
  const favoritesCount = useFavoritesStore((s) => s.ids.length)

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[var(--color-bg)]/80 border-b border-charcoal-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/logo.jpg" alt="觅巢" className="w-9 h-9 rounded-lg object-cover" />
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg text-charcoal-900">觅巢</span>
            <span className="text-[10px] text-charcoal-500 mt-0.5">天津租房聚合</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = isActive(pathname, to)
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'relative inline-flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm transition-colors',
                  active
                    ? 'text-brand-600'
                    : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-charcoal-50',
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {active && (
                  <span className="absolute -bottom-[1px] left-3 right-3 h-0.5 bg-brand-500 rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        <Link
          to="/favorites"
          className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-charcoal-600 hover:text-brand-600 hover:bg-charcoal-50 transition-colors"
          aria-label="收藏"
        >
          <Heart className="w-5 h-5" />
          <Badge count={favoritesCount} className="absolute -top-0.5 -right-0.5" />
        </Link>
      </div>
    </header>
  )
}
