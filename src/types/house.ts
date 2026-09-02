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

// 平台色板：色相拉开确保地图/饼图可区分（绿/蓝/玫红/琥珀/青/紫），
// 安居客避开品牌主色橙 #FF5516，避免与 UI 强调色撞色
export const PLATFORM_COLORS: Record<Platform, string> = {
  lianjia: '#00AE66', // 链家 · 绿
  beike: '#2B7FFF', // 贝壳 · 蓝
  anjuke: '#F43F5E', // 安居客 · 玫红
  '58': '#F59E0B', // 58同城 · 琥珀
  ziroom: '#06B6D4', // 自如 · 青
  personal: '#7C5CFF', // 个人直租 · 紫
};

export const RENT_TYPE_LABELS: Record<RentType, string> = {
  whole: '整租',
  shared: '合租',
  apartment: '公寓',
};
