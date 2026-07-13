import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useFilterStore } from '@/store/filterStore'
import { HOT_KEYWORDS, genImage } from '@/lib/constants'

const HERO_IMAGE = genImage(
  'tianjin city skyline aerial view haihe river sunset golden hour cinematic',
  'landscape_16_9',
)

export function HeroSearch() {
  const navigate = useNavigate()
  const keyword = useFilterStore((s) => s.keyword)
  const setFilter = useFilterStore((s) => s.setFilter)

  const goSearch = () => navigate('/list')

  const pickHotWord = (word: string) => {
    setFilter({ keyword: word })
    navigate('/list')
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-charcoal-900 text-white min-h-[480px] md:min-h-[560px]">
      <img
        src={HERO_IMAGE}
        alt="天津海河日落城市天际线"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900/80 via-charcoal-900/60 to-brand-900/40" />

      <div className="relative flex min-h-[480px] md:min-h-[560px] items-center">
        <div className="mx-auto w-full max-w-3xl px-6">
          <h1 className="font-display text-4xl md:text-6xl font-semibold leading-tight">
            在天津，
            <br />
            找到属于你的巢
          </h1>
          <p className="mt-4 text-charcoal-300 text-base md:text-lg">
            汇聚贝壳、链家、自如等 5+ 平台 · 100% 真实房源 · 个人房东直租 0 中介费
          </p>

          <div className="mt-10 flex items-center bg-white rounded-2xl p-2 shadow-2xl shadow-charcoal-900/30">
            <input
              type="text"
              value={keyword ?? ''}
              onChange={(e) => setFilter({ keyword: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') goSearch()
              }}
              placeholder="试试小区名 / 地铁站 / 商圈，如 华苑、滨江道"
              className="flex-1 h-12 px-5 text-charcoal-900 bg-transparent outline-none placeholder:text-charcoal-400"
            />
            <Button variant="primary" size="lg" onClick={goSearch}>
              <Search className="h-5 w-5" />
              搜索
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-charcoal-300 text-xs">
            <span>热门：</span>
            {HOT_KEYWORDS.map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => pickHotWord(word)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
