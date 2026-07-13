// 觅巢 - 天津租房聚合平台 类型定义

export type ListingSource = 'beike' | 'lianjia' | 'ziroom' | '58' | 'anju' | 'direct'

export interface Landlord {
  name: string
  avatar: string
  verified: boolean
  responseRate: number
}

export interface SubwayInfo {
  line: string
  station: string
  walkMin: number
}

export interface Listing {
  id: string
  title: string
  cover: string
  images: string[]
  price: number
  depositMode: string
  roomType: string
  area: number
  orientation: string
  floor: string
  district: string
  block: string
  subway?: SubwayInfo
  source: ListingSource
  isDirectRent: boolean
  landlord?: Landlord
  facilities: string[]
  publishedAt: string
  coords: [number, number]
  views: number
  featured?: boolean
}

export type DistrictGroup = 'inner' | 'suburb' | 'outer'

export interface TianjinDistrict {
  code: string
  name: string
  group: DistrictGroup
  avgPrice: number
  momChange: number
  coords: [number, number]
  listingCount: number
  description: string
}

export interface SubwayStation {
  name: string
  coords: [number, number]
}

export interface SubwayLine {
  id: string
  name: string
  color: string
  stations: SubwayStation[]
}

export interface PriceTrendPoint {
  month: string
  avgPrice: number
  medianPrice: number
}

export interface RoomTypeStat {
  type: string
  count: number
  share: number
}

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'area-desc' | 'latest'
export type ViewMode = 'list' | 'map'
