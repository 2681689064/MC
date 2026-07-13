import {
  Wifi,
  AirVent,
  WashingMachine,
  Refrigerator,
  Tv,
  ShowerHead,
  BedDouble,
  Sofa,
  Microwave,
  CookingPot,
  ParkingCircle,
  Bike,
  type LucideIcon,
} from 'lucide-react'
import type { ListingSource } from '@/types/listing'

/** 房源来源平台元信息 */
export const SOURCE_META: Record<ListingSource, { label: string; short: string; color: string }> = {
  beike: { label: '贝壳找房', short: '贝壳', color: '#0066CC' },
  lianjia: { label: '链家', short: '链家', color: '#00AE66' },
  ziroom: { label: '自如', short: '自如', color: '#FF7B47' },
  '58': { label: '58 同城', short: '58', color: '#FFD300' },
  anju: { label: '安居客', short: '安居', color: '#E4393C' },
  direct: { label: '房东直租', short: '直租', color: '#1A1A2E' },
}

/** 设施图标映射 */
export const FACILITY_META: Record<string, { label: string; icon: LucideIcon }> = {
  WiFi: { label: 'WiFi', icon: Wifi },
  空调: { label: '空调', icon: AirVent },
  洗衣机: { label: '洗衣机', icon: WashingMachine },
  冰箱: { label: '冰箱', icon: Refrigerator },
  电视: { label: '电视', icon: Tv },
  热水器: { label: '热水器', icon: ShowerHead },
  床: { label: '床', icon: BedDouble },
  沙发: { label: '沙发', icon: Sofa },
  微波炉: { label: '微波炉', icon: Microwave },
  厨房: { label: '可做饭', icon: CookingPot },
  停车位: { label: '停车位', icon: ParkingCircle },
  自行车: { label: '自行车', icon: Bike },
}

/** 朝向选项 */
export const ORIENTATION_OPTIONS = ['东', '南', '西', '北', '南北', '东西', '东南', '西南']

/** 户型选项 */
export const ROOM_TYPE_OPTIONS = ['1室1厅', '2室1厅', '2室2厅', '3室1厅', '3室2厅', '4室及以上', '开间']

/** 价格区间选项（元/月） */
export const PRICE_RANGES: { label: string; min: number; max: number }[] = [
  { label: '1500 以下', min: 0, max: 1500 },
  { label: '1500-3000', min: 1500, max: 3000 },
  { label: '3000-5000', min: 3000, max: 5000 },
  { label: '5000-8000', min: 5000, max: 8000 },
  { label: '8000 以上', min: 8000, max: 999999 },
]

/** 排序选项 */
export const SORT_OPTIONS: { value: 'default' | 'price-asc' | 'price-desc' | 'area-desc' | 'latest'; label: string }[] = [
  { value: 'default', label: '综合排序' },
  { value: 'price-asc', label: '价格 低到高' },
  { value: 'price-desc', label: '价格 高到低' },
  { value: 'area-desc', label: '面积 大到小' },
  { value: 'latest', label: '最新发布' },
]

/** 热门搜索词 */
export const HOT_KEYWORDS = ['华苑', '滨江道', '南开大学', '天津大学', '金融街', '梅江', '小白楼', '滨海']

/** 图片生成 helper：使用 trae text_to_image API */
export function genImage(prompt: string, size: 'square' | 'landscape_16_9' | 'portrait_4_3' = 'landscape_16_9'): string {
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}`
}

/** 预生成房源封面图池（10 张复用） */
export const LISTING_IMAGE_POOL: string[] = [
  genImage('cozy modern chinese apartment living room with sofa and bookshelf warm natural light, real estate photo', 'landscape_16_9'),
  genImage('minimalist bedroom with white bed and wood floor large window daylight, real estate listing photo', 'landscape_16_9'),
  genImage('modern kitchen with white cabinets wood countertop and pendant lights, tianjin apartment interior', 'landscape_16_9'),
  genImage('bright chinese apartment living room with tv wall and dining area, warm tone real estate photo', 'landscape_16_9'),
  genImage('scandinavian style bedroom with plants and reading nook, soft daylight, real estate listing', 'landscape_16_9'),
  genImage('small studio apartment with loft bed and work desk, cozy modern interior', 'landscape_16_9'),
  genImage('renovated old tianjin apartment with brick wall and modern furniture, stylish interior', 'landscape_16_9'),
  genImage('high rise apartment living room with city view through floor to ceiling window, sunset light', 'landscape_16_9'),
  genImage('clean bathroom with subway tiles and glass shower, modern chinese apartment', 'landscape_16_9'),
  genImage('furnished one bedroom apartment with bay window and city view, real estate photo', 'landscape_16_9'),
]

/** 详情页图集（每个房源随机 5-8 张，从池中取） */
export function pickListingImages(seed: number): string[] {
  const count = 5 + (seed % 4)
  const result: string[] = []
  for (let i = 0; i < count; i++) {
    result.push(LISTING_IMAGE_POOL[(seed + i * 3) % LISTING_IMAGE_POOL.length])
  }
  return result
}
