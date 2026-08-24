/** 房源来源平台（聚合多家平台 + 个人房东直租） */
export type Platform = 'lianjia' | 'beike' | 'anjuke' | '58' | 'ziroom' | 'personal';

/** 房源类型 */
export type RentType = 'whole' | 'shared' | 'apartment';

/** 朝向 */
export type Orientation =
  | '东'
  | '南'
  | '西'
  | '北'
  | '东南'
  | '西南'
  | '东北'
  | '西北'
  | '南北';

/** 楼层段 */
export type FloorLevel = '低楼层' | '中楼层' | '高楼层';

/** 装修 */
export type Decoration = '毛坯' | '简装' | '精装' | '豪装';

export interface HouseListing {
  id: string;
  title: string;
  community: string; // 小区名
  district: string; // 行政区
  area: string; // 板块
  platform: Platform;
  rentType: RentType;
  rooms: number; // 室
  halls: number; // 厅
  baths: number; // 卫
  areaSize: number; // 面积 m²
  price: number; // 月租 元
  floor: number; // 当前层
  totalFloor: number; // 总楼层
  floorLevel: FloorLevel;
  orientation: Orientation;
  decoration: Decoration;
  lng: number; // 经度
  lat: number; // 纬度
  subwayLine: string; // 最近地铁线
  subwayStation: string; // 最近地铁站
  subwayDistance: number; // 距地铁 米
  hasElevator: boolean;
  hasParking: boolean;
  nearSubway: boolean;
  images: number; // 图片数
  publishedAt: number; // 发布时间戳
  isVerified: boolean; // 已核验
  landlord: string; // 房东/经纪人昵称
  sourceUrl: string; // 平台链接
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  lianjia: '链家',
  beike: '贝壳',
  anjuke: '安居客',
  '58': '58同城',
  ziroom: '自如',
  personal: '个人房东直租',
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  lianjia: '#00AE66',
  beike: '#1FAB89',
  anjuke: '#FF5516',
  '58': '#FF6B35',
  ziroom: '#009670',
  personal: '#7C5CFF',
};

export const RENT_TYPE_LABELS: Record<RentType, string> = {
  whole: '整租',
  shared: '合租',
  apartment: '公寓',
};
