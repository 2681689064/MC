import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-20 md:py-32 text-center animate-fade-in">
      <div className="font-numeric text-[120px] md:text-[180px] leading-none text-brand-500">
        404
      </div>
      <h1 className="font-display text-2xl md:text-3xl text-charcoal-900 mt-4">
        巢，好像飞偏了
      </h1>
      <p className="text-sm text-charcoal-500 mt-2">你访问的页面不存在或已被移除</p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link to="/">
          <Button variant="primary">返回首页</Button>
        </Link>
        <Link to="/list">
          <Button variant="outline">浏览房源</Button>
        </Link>
      </div>
    </div>
  )
}
