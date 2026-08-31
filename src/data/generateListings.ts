import type {
  Decoration,
  FloorLevel,
  HouseListing,
  Orientation,
  Platform,
  RentType,
} from '../types/house';
import {
  COMMUNITY_PREFIX,
  COMMUNITY_SUFFIX,
  DISTRICTS,
  LANDLORD_NAMES,
  SUBWAY_LINES,
  SUBWAY_STATIONS,
} from './tianjin';

// ---------- 确定性伪随机（mulberry32），保证同 count 下结果稳定 ----------
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function randInt(rand: () => number, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

// 区域权重：市中心房源更密集
const DISTRICT_WEIGHTS: Record<string, number> = {
  和平区: 1.6,
  河西区: 1.5,
  南开区: 1.5,
  河北区: 0.9,
  河东区: 1.1,
  红桥区: 0.8,
  北辰区: 0.9,
  东丽区: 0.8,
  西青区: 1.0,
  津南区: 0.9,
};

// 区域价格系数（基准倍数）
const DISTRICT_PRICE_FACTOR: Record<string, number> = {
  和平区: 1.55,
  河西区: 1.3,
  南开区: 1.25,
  河北区: 0.9,
  河东区: 1.0,
  红桥区: 0.85,
  北辰区: 0.75,
  东丽区: 0.7,
  西青区: 0.78,
  津南区: 0.72,
};

const PLATFORMS: Platform[] = [
  'lianjia',
  'beike',
  'anjuke',
  '58',
  'ziroom',
  'personal',
];

const PLATFORM_WEIGHTS: Record<Platform, number> = {
  lianjia: 1.4,
  beike: 1.5,
  anjuke: 1.2,
  '58': 1.3,
  ziroom: 0.9,
  personal: 1.0,
};

const RENT_TYPES: RentType[] = ['whole', 'shared', 'apartment'];
const RENT_TYPE_WEIGHTS: Record<RentType, number> = {
  whole: 1.6,
  shared: 1.0,
  apartment: 0.8,
};

const ORIENTATIONS: Orientation[] = [
  '南',
  '南北',
  '东南',
  '东',
  '西南',
  '北',
  '西',
  '东北',
  '西北',
];

const DECORATIONS: Decoration[] = ['毛坯', '简装', '精装', '豪装'];
const DECORATION_WEIGHTS: Record<Decoration, number> = {
  毛坯: 0.4,
  简装: 1.2,
  精装: 1.6,
  豪装: 0.6,
};

function weightedPick<T extends string>(
  rand: () => number,
  items: readonly T[],
  weights: Record<T, number>,
): T {
  const total = items.reduce((s, k) => s + weights[k], 0);
  let r = rand() * total;
  for (const k of items) {
    r -= weights[k];
    if (r <= 0) return k;
  }
  return items[items.length - 1];
}

function floorLevelFrom(floor: number, total: number): FloorLevel {
  const ratio = total > 0 ? floor / total : 0.5;
  if (ratio < 0.34) return '低楼层';
  if (ratio < 0.67) return '中楼层';
  return '高楼层';
}

const TITLE_TEMPLATES = [
  '{community} {rooms}室{halls}厅 朝{orientation} {decoration}',
  '{community} {rentType} {area}㎡ 朝{orientation} 近地铁',
  '【{platform}】{community} {rooms}室{halls}厅 精装好房',
  '{community} 业主直租 {rooms}室{halls}厅 采光好',
  '{community} {rooms}室{halls}厅 {decoration} {floor}',
];

function buildTitle(
  rand: () => number,
  platform: Platform,
  rentType: RentType,
  rooms: number,
  halls: number,
  areaSize: number,
  decoration: Decoration,
  orientation: Orientation,
  floorLevel: FloorLevel,
  community: string,
): string {
  const tpl = pick(rand, TITLE_TEMPLATES);
  const platformLabel: Record<Platform, string> = {
    lianjia: '链家',
    beike: '贝壳',
    anjuke: '安居客',
    '58': '58同城',
    ziroom: '自如',
    personal: '个人房东',
  };
  const rentLabel = rentType === 'whole' ? '整租' : rentType === 'shared' ? '合租' : '公寓';
  return tpl
    .replace('{community}', community)
    .replace('{platform}', platformLabel[platform])
    .replace('{rentType}', rentLabel)
    .replace('{rooms}', String(rooms))
    .replace('{halls}', String(halls))
    .replace('{area}', String(areaSize))
    .replace('{decoration}', decoration)
    .replace('{orientation}', orientation)
    .replace('{floor}', floorLevel)
    .replace(/\s+/g, ' ')
    .trim();
}

function communityName(rand: () => number): string {
  return `${pick(rand, COMMUNITY_PREFIX)}${pick(rand, COMMUNITY_SUFFIX)}`;
}

interface GenerateOptions {
  count: number;
  seed?: number;
}

// 天津市行政区域近似边界（含远郊区），房源坐标必须落在此范围内
const TJ_LNG_MIN = 116.7;
const TJ_LNG_MAX = 118.0;
const TJ_LAT_MIN = 38.53;
const TJ_LAT_MAX = 40.25;

function clampTianjin(lng: number, lat: number): [number, number] {
  return [
    +Math.min(TJ_LNG_MAX, Math.max(TJ_LNG_MIN, lng)).toFixed(6),
    +Math.min(TJ_LAT_MAX, Math.max(TJ_LAT_MIN, lat)).toFixed(6),
  ];
}

// 各平台天津租房页：均支持携带小区关键词直达搜索结果
const PLATFORM_BASE_URL: Record<Platform, string> = {
  lianjia: 'https://tj.lianjia.com/zufang/',
  beike: 'https://tj.zu.ke.com/zufang/',
  anjuke: 'https://tj.zu.anjuke.com/fangyuan/',
  '58': 'https://tj.58.com/chuzu/',
  ziroom: 'https://www.ziroom.com/z/zhuang/',
  // 个人房东直租：跳转 58 同城天津个人房源栏目（真实可访问）
  personal: 'https://tj.58.com/gr/chuzu/',
};

/** 房源来源跳转链接：直达对应平台该小区的搜索结果页，均可真实访问 */
function buildSourceUrl(platform: Platform, community: string): string {
  const kw = encodeURIComponent(community);
  switch (platform) {
    case 'lianjia':
    case 'beike':
      // 链家/贝壳租房支持 /rs关键词/ 搜索路径
      return `${PLATFORM_BASE_URL[platform]}rs${kw}/`;
    case 'anjuke':
      // 安居客房源列表页，kwd 参数为关键词
      return `${PLATFORM_BASE_URL.anjuke}?kwd=${kw}`;
    case '58':
      // 58 同城租房，key 参数为关键词
      return `${PLATFORM_BASE_URL['58']}?key=${kw}`;
    default:
      return PLATFORM_BASE_URL[platform];
  }
}

/**
 * 生成房源数据集。默认 10000 条，上限 50000 条。
 * 通过确定性 PRNG + 权重分布保证结果稳定且贴近真实天津市场。
 */
export function generateListings({ count, seed = 20260824 }: GenerateOptions): HouseListing[] {
  const rand = mulberry32(seed);
  const now = Date.now();

  // 预计算区域加权抽样池，避免每条重复计算
  const districtPool: string[] = [];
  for (const d of DISTRICTS) {
    const w = DISTRICT_WEIGHTS[d.name] ?? 1;
    const n = Math.max(1, Math.round(w * 10));
    for (let i = 0; i < n; i++) districtPool.push(d.name);
  }

  const listings: HouseListing[] = new Array(count);

  for (let i = 0; i < count; i++) {
    const districtName = pick(rand, districtPool);
    const district = DISTRICTS.find((d) => d.name === districtName)!;
    const block = pick(rand, district.blocks);

    // 在板块点附近撒点（经纬度小幅扰动 ~±0.006°，约 600m），并 clamp 到天津市边界内
    const [lng, lat] = clampTianjin(
      block.lng + (rand() - 0.5) * 0.012,
      block.lat + (rand() - 0.5) * 0.012,
    );

    const platform = weightedPick(rand, PLATFORMS, PLATFORM_WEIGHTS);
    const rentType = weightedPick(rand, RENT_TYPES, RENT_TYPE_WEIGHTS);

    // 户型：合租偏向 1-2 室，整租偏向 2-3 室，公寓 1-2 室
    let rooms: number;
    if (rentType === 'shared') rooms = pick(rand, [1, 1, 2]);
    else if (rentType === 'apartment') rooms = pick(rand, [1, 1, 2]);
    else rooms = pick(rand, [1, 2, 2, 3, 3, 4]);
    const halls = rooms <= 1 ? 0 : pick(rand, [1, 1, 2]);
    const baths = rooms <= 2 ? 1 : pick(rand, [1, 2]);

    // 面积：随室数+扰动
    const baseArea = rooms * 28 + 12;
    const areaSize = +Math.max(8, baseArea + rand() * 22).toFixed(1);

    const decoration = weightedPick(rand, DECORATIONS, DECORATION_WEIGHTS);
    const orientation = pick(rand, ORIENTATIONS);

    const totalFloor = randInt(rand, 6, 34);
    const floor = randInt(rand, 1, totalFloor);
    const floorLevel = floorLevelFrom(floor, totalFloor);

    const nearSubway = rand() < 0.62;
    const subwayLine = pick(rand, SUBWAY_LINES);
    const subwayStation = pick(rand, SUBWAY_STATIONS);
    const subwayDistance = nearSubway
      ? randInt(rand, 80, 800)
      : randInt(rand, 900, 2500);

    // 价格：基准 60 元/㎡·月，按区域/类型/装修/楼层/地铁 调整
    const districtFactor = DISTRICT_PRICE_FACTOR[district.name] ?? 1;
    const rentFactor =
      rentType === 'whole' ? 1 : rentType === 'apartment' ? 1.1 : 0.55;
    const decoFactor =
      decoration === '豪装'
        ? 1.25
        : decoration === '精装'
          ? 1.12
          : decoration === '简装'
            ? 1.0
            : 0.88;
    const floorFactor =
      floorLevel === '中楼层' ? 1.05 : floorLevel === '高楼层' ? 0.98 : 0.95;
    const subwayFactor = nearSubway ? 1.08 : 1.0;

    const rawPrice =
      areaSize * 60 * districtFactor * rentFactor * decoFactor * floorFactor * subwayFactor;
    // 合租按间计价，整数化到 50
    const price = Math.max(600, Math.round(rawPrice / 50) * 50);

    const community = communityName(rand);

    const publishedDaysAgo = randInt(rand, 0, 30);
    const publishedAt = now - publishedDaysAgo * 86400000 - randInt(rand, 0, 86400000);

    listings[i] = {
      id: `TJ${String(i + 1).padStart(6, '0')}`,
      title: buildTitle(
        rand,
        platform,
        rentType,
        rooms,
        halls,
        areaSize,
        decoration,
        orientation,
        floorLevel,
        community,
      ),
      community,
      district: district.name,
      area: block.name,
      platform,
      rentType,
      rooms,
      halls,
      baths,
      areaSize,
      price,
      floor,
      totalFloor,
      floorLevel,
      orientation,
      decoration,
      lng,
      lat,
      subwayLine,
      subwayStation,
      subwayDistance,
      hasElevator: totalFloor >= 7 ? rand() < 0.85 : rand() < 0.3,
      hasParking: rand() < 0.5,
      nearSubway,
      images: randInt(rand, 3, 18),
      publishedAt,
      isVerified: rand() < 0.78,
      landlord: pick(rand, LANDLORD_NAMES),
      sourceUrl: buildSourceUrl(platform, community),
    };
  }

  return listings;
}

// 默认数据集（10,000 条），上限 50000 条
const DEFAULT_COUNT = 10000;
export const MAX_LISTING_COUNT = 50000;

// 多规模 LRU 缓存（最多 4 份），在数量预设间来回切换时秒开
const listingCache = new Map<number, HouseListing[]>();
const CACHE_MAX_ENTRIES = 4;

export function getListings(count: number = DEFAULT_COUNT): HouseListing[] {
  const hit = listingCache.get(count);
  if (hit) {
    // 重新插入以刷新 LRU 顺序
    listingCache.delete(count);
    listingCache.set(count, hit);
    return hit;
  }
  const data = generateListings({ count });
  listingCache.set(count, data);
  while (listingCache.size > CACHE_MAX_ENTRIES) {
    const oldest = listingCache.keys().next().value;
    if (oldest === undefined) break;
    listingCache.delete(oldest);
  }
  return data;
}

export const DEFAULT_LISTING_COUNT = DEFAULT_COUNT;
