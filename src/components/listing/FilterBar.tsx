import { useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SOURCE_META, PRICE_RANGES, ROOM_TYPE_OPTIONS, ORIENTATION_OPTIONS } from '@/lib/constants'
import { TIANJIN_DISTRICTS } from '@/data/tianjinDistricts'
import { SUBWAY_LINES } from '@/data/subwayLines'
import { useFilterStore } from '@/store/filterStore'
import { Sheet } from '@/components/ui/Sheet'
import { Button } from '@/components/ui/Button'
import type { ListingSource } from '@/types/listing'

const TABS = [
  { key: 'district', label: '区域' },
  { key: 'price', label: '价格' },
  { key: 'roomType', label: '户型' },
  { key: 'orientation', label: '朝向' },
  { key: 'subway', label: '地铁' },
  { key: 'source', label: '来源' },
] as const

type TabKey = (typeof TABS)[number]['key']
const SOURCES: ListingSource[] = ['beike', 'lianjia', 'ziroom', '58', 'anju', 'direct']

function Chip({ label, active, onClick, onClear }: { label: string; active: boolean; onClick: () => void; onClear?: () => void }) {
  return (
    <div className="relative inline-flex shrink-0">
      <button type="button" onClick={onClick} className={cn('h-9 px-3 rounded-full border text-sm whitespace-nowrap transition-colors', active ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-charcoal-200 text-charcoal-700 hover:border-brand-400')}>{label}</button>
      {active && onClear && (
        <button type="button" aria-label="清除" onClick={(e) => { e.stopPropagation(); onClear() }} className="absolute -top-1 -right-1 grid place-items-center w-4 h-4 rounded-full bg-charcoal-900 text-white">
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  )
}

function Option({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={cn('h-10 px-3 rounded-xl border text-sm transition-colors text-center truncate', active ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-charcoal-200 text-charcoal-700 hover:border-brand-400')}>{children}</button>
  )
}

export function FilterBar() {
  const filter = useFilterStore()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('district')

  const districtName = TIANJIN_DISTRICTS.find((d) => d.code === filter.district)?.name
  const priceRange = PRICE_RANGES.find((r) => r.min === filter.priceMin && r.max === filter.priceMax)
  const subwayObj = SUBWAY_LINES.find((l) => l.id === filter.subwayLine)
  const rtLabel = filter.roomTypes.length ? `${filter.roomTypes[0]}${filter.roomTypes.length > 1 ? `+${filter.roomTypes.length - 1}` : ''}` : null
  const oriLabel = filter.orientations.length ? `${filter.orientations[0]}${filter.orientations.length > 1 ? `+${filter.orientations.length - 1}` : ''}` : null
  const srcLabel = filter.sources.length ? `${filter.sources.length}个` : null
  const open = (tab: TabKey) => { setActiveTab(tab); setSheetOpen(true) }

  const chips = [
    { label: districtName ?? '区域', active: !!filter.district, onClick: () => open('district'), onClear: () => filter.setFilter({ district: undefined }) },
    { label: priceRange?.label ?? '价格', active: !!priceRange, onClick: () => open('price'), onClear: () => filter.setFilter({ priceMin: undefined, priceMax: undefined }) },
    { label: rtLabel ?? '户型', active: !!rtLabel, onClick: () => open('roomType'), onClear: () => filter.setFilter({ roomTypes: [] }) },
    { label: oriLabel ?? '朝向', active: !!oriLabel, onClick: () => open('orientation'), onClear: () => filter.setFilter({ orientations: [] }) },
    { label: subwayObj?.name ?? '地铁', active: !!subwayObj, onClick: () => open('subway'), onClear: () => filter.setFilter({ subwayLine: undefined }) },
    { label: srcLabel ?? '来源', active: !!srcLabel, onClick: () => open('source'), onClear: () => filter.setFilter({ sources: [] }) },
    { label: filter.directOnly ? '✓ 直租' : '直租', active: filter.directOnly, onClick: () => filter.setFilter({ directOnly: !filter.directOnly }) },
  ]

  return (
    <>
      <div className="sticky top-16 z-30 backdrop-blur-md bg-[var(--color-bg)]/90 border-b border-charcoal-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {chips.map((c, i) => (
            <Chip key={i} label={c.label} active={c.active} onClick={c.onClick} onClear={c.onClear} />
          ))}
        </div>
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="筛选">
        <div className="flex gap-2 border-b border-charcoal-100 pb-3 mb-4 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button key={t.key} type="button" onClick={() => setActiveTab(t.key)} className={cn('h-8 px-3 rounded-full text-sm whitespace-nowrap transition-colors', activeTab === t.key ? 'bg-charcoal-900 text-white' : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200')}>{t.label}</button>
          ))}
        </div>

        {activeTab === 'district' && (
          <div className="grid grid-cols-3 gap-2">
            <Option active={!filter.district} onClick={() => filter.setFilter({ district: undefined })}>不限</Option>
            {TIANJIN_DISTRICTS.map((d) => <Option key={d.code} active={filter.district === d.code} onClick={() => filter.setFilter({ district: d.code })}>{d.name}</Option>)}
          </div>
        )}

        {activeTab === 'price' && (
          <div className="grid grid-cols-2 gap-2">
            <Option active={!priceRange} onClick={() => filter.setFilter({ priceMin: undefined, priceMax: undefined })}>不限</Option>
            {PRICE_RANGES.map((r) => <Option key={r.label} active={priceRange?.label === r.label} onClick={() => filter.setFilter({ priceMin: r.min, priceMax: r.max })}>{r.label}</Option>)}
          </div>
        )}

        {activeTab === 'roomType' && (
          <div className="grid grid-cols-3 gap-2">
            {ROOM_TYPE_OPTIONS.map((rt) => <Option key={rt} active={filter.roomTypes.includes(rt)} onClick={() => filter.toggleArray('roomTypes', rt)}>{rt}</Option>)}
          </div>
        )}

        {activeTab === 'orientation' && (
          <div className="grid grid-cols-4 gap-2">
            {ORIENTATION_OPTIONS.map((o) => <Option key={o} active={filter.orientations.includes(o)} onClick={() => filter.toggleArray('orientations', o)}>{o}</Option>)}
          </div>
        )}

        {activeTab === 'subway' && (
          <div className="grid grid-cols-2 gap-2">
            <Option active={!subwayObj} onClick={() => filter.setFilter({ subwayLine: undefined })}>不限</Option>
            {SUBWAY_LINES.map((l) => (
              <Option key={l.id} active={subwayObj?.id === l.id} onClick={() => filter.setFilter({ subwayLine: l.id })}>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                  {l.name}
                </span>
              </Option>
            ))}
          </div>
        )}

        {activeTab === 'source' && (
          <div className="grid grid-cols-2 gap-2">
            {SOURCES.map((s) => <Option key={s} active={filter.sources.includes(s)} onClick={() => filter.toggleArray('sources', s)}>{SOURCE_META[s].label}</Option>)}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <Button variant="ghost" className="flex-1" onClick={() => filter.reset()}>重置</Button>
          <Button variant="primary" className="flex-1" onClick={() => setSheetOpen(false)}>完成</Button>
        </div>
      </Sheet>
    </>
  )
}
