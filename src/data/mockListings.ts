import type { Listing, ListingSource, Landlord, SubwayInfo } from '@/types/listing'
import { TIANJIN_DISTRICTS } from './tianjinDistricts'
import { SUBWAY_LINES } from './subwayLines'
import { LISTING_IMAGE_POOL, pickListingImages, genImage } from '@/lib/constants'

// 确定性伪随机：保证每次生成结果可重现（publishedAt 时间戳以运行时为准保持新鲜）
function seededRandom(seed: number): () => number {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const rand = seededRandom(20260713)
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)]
const range = (min: number, max: number): number => min + rand() * (max - min)
const rangeInt = (min: number, max: number): number => Math.floor(range(min, max + 1))

// 户型（2室1厅 权重最高，贴近真实市场分布）
const ROOM_TYPES: readonly string[] = [
  '1室1厅', '1室1厅', '1室1厅',
  '2室1厅', '2室1厅', '2室1厅', '2室1厅', '2室1厅', '2室1厅',
  '2室2厅', '2室2厅',
  '3室1厅', '3室1厅',
  '3室2厅', '3室2厅', '3室2厅',
  '4室及以上',
  '开间', '开间',
]

const AREA_RANGE: Record<string, [number, number]> = {
  '1室1厅': [35, 55],
  '2室1厅': [55, 85],
  '2室2厅': [85, 110],
  '3室1厅': [75, 100],
  '3室2厅': [100, 150],
  '4室及以上': [130, 220],
  '开间': [25, 45],
}

// 朝向（南北 权重最高）
const ORIENTATIONS: readonly string[] = [
  '南北', '南北', '南北', '南北', '南北',
  '南', '南', '东南', '东南', '东西', '东', '西', '北', '西南',
]

// 押付方式
const DEPOSIT_MODES: readonly string[] = [
  '押一付一', '押一付一', '押一付一', '押一付一',
  '押一付三', '押一付三', '押一付三', '押一付三',
  '押一付六', '半年付', '年付',
]

const FACILITIES_POOL = [
  'WiFi', '空调', '洗衣机', '冰箱', '电视', '热水器',
  '床', '沙发', '微波炉', '厨房', '停车位', '自行车',
]

const BLOCKS: readonly string[] = [
  '华苑新城', '时代奥城', '保利玫瑰湾', '中交富力', '仁恒海河广场', '万科城市花园',
  '招商贝肯山', '中海八里台', '融创中心', '金融街融御', '鲁能公馆', '华润橡树湾',
  '绿城桂语江南', '保利香颂', '碧桂园天玺', '富力又一城', '远洋天地', '梅江湾',
  '诚基中心', '塘沽外滩', '万科朗润园', '保利茉莉公馆', '龙湖天街', '金地艺境',
  '中海寰宇时代', '远洋万和城', '华润昆仑御', '绿城晓风印月', '保利和光尘樾', '中骏森系',
]

const TITLE_FEATURES: readonly string[] = [
  '精装修 拎包入住', '精装修 拎包入住', '地铁口', '南北通透', '近地铁', '学区房',
  '豪华装修', '温馨宜居', '观景高层', '采光充足', '业主自住装', '江景大平层', '看海景', '拎包入住',
]

const FLOOR_TAGS: readonly string[] = ['低楼层', '中楼层', '高楼层']
const TOTAL_FLOORS: readonly number[] = [6, 11, 18, 24, 26, 32, 33]

const LANDLORD_NAMES: readonly string[] = ['张先生', '李女士', '王女士', '赵先生', '刘先生', '陈女士', '孙先生', '周女士']

// 按各区 listingCount 比例分配 120 条房源
const TOTAL_LISTING_COUNT = TIANJIN_DISTRICTS.reduce((s, d) => s + d.listingCount, 0)
function districtForIndex(i: number) {
  const target = ((i + 0.5) * TOTAL_LISTING_COUNT) / 120
  let cum = 0
  for (const d of TIANJIN_DISTRICTS) {
    cum += d.listingCount
    if (target <= cum) return d
  }
  return TIANJIN_DISTRICTS[TIANJIN_DISTRICTS.length - 1]
}

// 来源分布：beike 36 / lianjia 22 / ziroom 22 / 58 12 / anju 8 / direct 20（direct≥20 满足直租要求）
function buildSourcePlan(): ListingSource[] {
  const plan: ListingSource[] = []
  for (let i = 0; i < 36; i++) plan.push('beike')
  for (let i = 0; i < 22; i++) plan.push('lianjia')
  for (let i = 0; i < 22; i++) plan.push('ziroom')
  for (let i = 0; i < 12; i++) plan.push('58')
  for (let i = 0; i < 8; i++) plan.push('anju')
  for (let i = 0; i < 20; i++) plan.push('direct')
  // 确定性洗牌，让 direct 房源均匀分布
  for (let i = plan.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    const tmp = plan[i]
    plan[i] = plan[j]
    plan[j] = tmp
  }
  return plan
}
const SOURCE_PLAN = buildSourcePlan()

function pickFacilities(): string[] {
  const count = rangeInt(4, 9)
  const pool = [...FACILITIES_POOL]
  const result: string[] = []
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(rand() * pool.length)
    result.push(pool[idx])
    pool.splice(idx, 1)
  }
  return result
}

function maybeSubway(): SubwayInfo | undefined {
  if (rand() > 0.6) return undefined
  const line = SUBWAY_LINES[Math.floor(rand() * SUBWAY_LINES.length)]
  const station = line.stations[Math.floor(rand() * line.stations.length)]
  return { line: line.name, station: station.name, walkMin: rangeInt(3, 15) }
}

function makeLandlord(): Landlord {
  return {
    name: pick(LANDLORD_NAMES),
    avatar: genImage('friendly chinese landlord portrait avatar', 'square'),
    verified: rand() > 0.2,
    responseRate: rangeInt(80, 99),
  }
}

function publishedAt(i: number): string {
  const dayMs = 86400000
  let offset: number
  if (i < 5) offset = 0 // 今天
  else if (i < 10) offset = 1 // 昨天
  else offset = Math.floor(rand() * 60) // 最近 60 天内
  return new Date(Date.now() - offset * dayMs - Math.floor(rand() * dayMs)).toISOString()
}

const LISTINGS: Listing[] = []
for (let i = 0; i < 120; i++) {
  const idNum = i + 1
  const id = `TJ${String(idNum).padStart(5, '0')}`
  const district = districtForIndex(i)
  const roomType = pick(ROOM_TYPES)
  const [aMin, aMax] = AREA_RANGE[roomType]
  const area = Math.round(range(aMin, aMax))
  const price = Math.round((district.avgPrice * (0.7 + rand() * 0.6)) / 50) * 50
  const orientation = pick(ORIENTATIONS)
  const depositMode = pick(DEPOSIT_MODES)
  const floor = `${pick(FLOOR_TAGS)}/共${pick(TOTAL_FLOORS)}层`
  const block = pick(BLOCKS)
  const title = `${block} ${roomType} ${pick(TITLE_FEATURES)}`
  const source = SOURCE_PLAN[i]
  const isDirectRent = source === 'direct'
  const subway = maybeSubway()
  const landlord = isDirectRent ? makeLandlord() : undefined
  const facilities = pickFacilities()
  const isFeatured = i % 8 === 0
  const views = isFeatured ? rangeInt(1500, 5000) : rangeInt(50, 2500)
  const lat = district.coords[0] + (rand() - 0.5) * 0.04
  const lng = district.coords[1] + (rand() - 0.5) * 0.04
  const coords: [number, number] = [Number(lat.toFixed(4)), Number(lng.toFixed(4))]
  const cover = LISTING_IMAGE_POOL[idNum % 10]
  const images = pickListingImages(idNum)

  LISTINGS.push({
    id,
    title,
    cover,
    images,
    price,
    depositMode,
    roomType,
    area,
    orientation,
    floor,
    district: district.code,
    block,
    subway,
    source,
    isDirectRent,
    landlord,
    facilities,
    publishedAt: publishedAt(i),
    coords,
    views,
    featured: isFeatured,
  })
}

export function getListingById(id: string): Listing | undefined {
  return LISTINGS.find((l) => l.id === id)
}

export { LISTINGS }
