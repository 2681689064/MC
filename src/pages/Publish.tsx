import { useState, type FormEvent } from 'react'
import { ShieldCheck, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TIANJIN_DISTRICTS } from '@/data/tianjinDistricts'

const ROOM_TYPES = ['1室1厅', '2室1厅', '2室2厅', '3室1厅', '3室2厅', '4室及以上', '开间']
const DEPOSIT_MODES = ['押一付一', '押一付三', '押一付六', '半年付', '年付']
interface PublishForm {
  block: string
  district: string
  roomType: string
  area: string
  price: string
  depositMode: string
  phone: string
  title: string
  description: string
}
const EMPTY_FORM: PublishForm = {
  block: '',
  district: '',
  roomType: '',
  area: '',
  price: '',
  depositMode: '押一付一',
  phone: '',
  title: '',
  description: '',
}
const INPUT_CLASS =
  'w-full h-11 px-4 rounded-xl border border-charcoal-200 bg-white text-charcoal-900 placeholder:text-charcoal-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition'

export function Publish() {
  const [form, setForm] = useState<PublishForm>(EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)

  const update = (key: keyof PublishForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setForm(EMPTY_FORM)
    window.setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 animate-fade-in">
      <header>
        <h1 className="font-display text-3xl text-charcoal-900">发布直租房源</h1>
        <p className="text-sm text-charcoal-500 mt-2">0 中介费 · 100% 个人房东 · 实名校验</p>
      </header>

      <div className="mt-6 rounded-2xl bg-mint-50 border border-mint-200 p-4 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-mint-600 shrink-0 mt-0.5" />
        <p className="text-sm text-mint-800">
          发布房源需实名认证。我们承诺保护您的隐私，联系方式仅对认证租客可见。
        </p>
      </div>

      {submitted && (
        <div className="mt-6 rounded-2xl bg-brand-50 border border-brand-200 p-4 flex gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
          <p className="text-sm text-brand-800">
            房源已提交成功！我们会在 24 小时内完成审核，审核通过后将在平台上展示。
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1.5">小区名</label>
          <input
            type="text"
            required
            value={form.block}
            onChange={(e) => update('block', e.target.value)}
            placeholder="如 时代奥城"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1.5">所在区域</label>
          <select
            required
            value={form.district}
            onChange={(e) => update('district', e.target.value)}
            className={INPUT_CLASS}
          >
            <option value="">请选择区域</option>
            {TIANJIN_DISTRICTS.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1.5">户型</label>
          <select
            required
            value={form.roomType}
            onChange={(e) => update('roomType', e.target.value)}
            className={INPUT_CLASS}
          >
            <option value="">请选择户型</option>
            {ROOM_TYPES.map((rt) => (
              <option key={rt} value={rt}>
                {rt}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1.5">面积（㎡）</label>
            <input
              type="number"
              min="1"
              required
              value={form.area}
              onChange={(e) => update('area', e.target.value)}
              placeholder="如 86"
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1.5">月租金（元/月）</label>
            <input
              type="number"
              min="1"
              required
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
              placeholder="如 4500"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1.5">押付方式</label>
          <select
            value={form.depositMode}
            onChange={(e) => update('depositMode', e.target.value)}
            className={INPUT_CLASS}
          >
            {DEPOSIT_MODES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1.5">联系电话</label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="如 138****8888"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1.5">房源标题</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="如 时代奥城 2室1厅 精装修 拎包入住"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1.5">详细描述</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="介绍房源的亮点、周边配套、交通情况等"
            className="w-full px-4 py-3 rounded-xl border border-charcoal-200 bg-white text-charcoal-900 placeholder:text-charcoal-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition resize-none"
          />
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full mt-8">
          提交发布
        </Button>
      </form>
    </div>
  )
}
