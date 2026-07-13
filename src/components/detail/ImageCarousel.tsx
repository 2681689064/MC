import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageCarouselProps {
  images: string[]
  alt: string
  className?: string
}

export function ImageCarousel({ images, alt, className }: ImageCarouselProps) {
  const [active, setActive] = useState(0)
  const total = images.length

  const go = useCallback(
    (delta: number) => {
      setActive((cur) => (cur + delta + total) % total)
    },
    [total],
  )

  useEffect(() => {
    if (total <= 1) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, total])

  if (total === 0) {
    return (
      <div
        className={cn(
          'aspect-[16/10] rounded-2xl bg-charcoal-100 flex items-center justify-center text-charcoal-400',
          className,
        )}
      >
        暂无图片
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-charcoal-100">
        <img
          src={images[active]}
          alt={`${alt} - 第 ${active + 1} 张`}
          className="w-full h-full object-cover"
        />

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="上一张"
              onClick={() => go(-1)}
              className="absolute top-1/2 left-3 -translate-y-1/2 w-10 h-10 rounded-full grid place-items-center bg-black/30 backdrop-blur-md text-white hover:bg-charcoal-900/80 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="下一张"
              onClick={() => go(1)}
              className="absolute top-1/2 right-3 -translate-y-1/2 w-10 h-10 rounded-full grid place-items-center bg-black/30 backdrop-blur-md text-white hover:bg-charcoal-900/80 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-charcoal-900/60 text-white text-xs font-numeric">
              {active + 1} / {total}
            </div>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`查看第 ${i + 1} 张`}
              aria-current={i === active}
              className={cn(
                'w-20 h-14 rounded-lg overflow-hidden border-2 transition cursor-pointer shrink-0',
                i === active
                  ? 'border-brand-500 opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-100',
              )}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
