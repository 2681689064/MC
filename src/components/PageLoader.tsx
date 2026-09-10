import { cn } from '@/lib/utils';

/** 品牌化加载动画：用于路由懒加载 / 数据就绪前的过渡态
 *  logo 使用 GitHub 云端仓库的 觅巢Logo.jpg（public/logo.jpg） */
export default function PageLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex min-h-24 flex-col items-center justify-center gap-3',
        className,
      )}
    >
      <img
        src="/logo.jpg"
        alt="觅巢"
        className="h-12 w-12 animate-page-bounce rounded-2xl object-cover shadow-lg shadow-brand-500/25"
      />
      <div className="h-1 w-32 overflow-hidden rounded-full bg-charcoal-100">
        <i className="block h-full w-2/5 animate-page-slide rounded-full bg-gradient-to-r from-brand-400 to-brand-600" />
      </div>
    </div>
  );
}
