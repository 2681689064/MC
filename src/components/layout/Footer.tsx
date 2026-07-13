import { Link } from 'react-router-dom'
import { QrCode } from 'lucide-react'

interface FooterColumn {
  title: string
  links: { label: string; to: string }[]
}

const COLUMNS: FooterColumn[] = [
  {
    title: '房源分类',
    links: [
      { label: '合租', to: '/list?mode=share' },
      { label: '整租', to: '/list?mode=entire' },
      { label: '公寓', to: '/list?type=apartment' },
      { label: '直租', to: '/list?direct=1' },
    ],
  },
  {
    title: '区域导航',
    links: [
      { label: '和平区', to: '/list?district=和平' },
      { label: '南开区', to: '/list?district=南开' },
      { label: '西青区', to: '/list?district=西青' },
      { label: '武清区', to: '/list?district=武清' },
    ],
  },
  {
    title: '关于我们',
    links: [
      { label: '平台介绍', to: '/about' },
      { label: '联系方式', to: '/contact' },
      { label: '隐私政策', to: '/privacy' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="hidden md:block bg-charcoal-900 text-charcoal-300 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <img src="/logo.jpg" alt="觅巢" className="w-9 h-9 rounded-lg object-cover" />
              <span className="font-display text-lg text-white">觅巢</span>
            </div>
            <p className="text-sm text-charcoal-400 leading-relaxed">专注天津，聚合全网房源</p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-charcoal-800 text-xs text-charcoal-400">
              <QrCode className="w-4 h-4" />
              <span>微信公众号：觅巢租房</span>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm text-white mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-charcoal-400 hover:text-brand-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-charcoal-800 text-center text-xs text-charcoal-500">
          © 2025 觅巢 MiChao · 天津租房聚合平台 · 数据仅供演示
        </div>
      </div>
    </footer>
  )
}
