import { cn } from '@/lib/utils';

/** 品牌化加载动画：用于路由懒加载 / 数据就绪前的过渡态 */
export default function PageLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex min-h-24 flex-col items-center justify-center gap-3',
        className,
      )}
    >
      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-500/25">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 animate-page-bounce"
        >
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9 21v-6h6v6" />
        </svg>
      </div>
      <div className="h-1 w-32 overflow-hidden rounded-full bg-charcoal-100">
        <i className="block h-full w-2/5 animate-page-slide rounded-full bg-gradient-to-r from-brand-400 to-brand-600" />
      </div>
    </div>
  );
}
