import type {
  Decoration,
  FloorLevel,
  HouseListing,
  Orientation,
  Platform,
  RentType,
} from '../types/house';
import {
  BEIKE_COMMUNITY_IDS,
  DISTRICTS,
  LANDLORD_NAMES,
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

// 区域权重：市中心房源更密集（参考贝壳各区域在租套数比例）
const DISTRICT_WEIGHTS: Record<string, number> = {
  和平区: 1.4,
  河西区: 1.6,
  南开区: 1.6,
  河北区: 0.9,
  河东区: 1.0,
  红桥区: 0.8,
  北辰区: 1.0,
  东丽区: 0.9,
  西青区: 0.8,
  津南区: 1.1,
};

// 区域价格系数（按真实在租房源抽样校准，基准 36 元/㎡·月）
// 抽样参考：和平吉利花园 73㎡ 4200 元、河西红波里 61㎡ 3200 元、
// 南开凤园北里 35㎡ 1550 元、津南咸水沽 82㎡ 1100 元、北仓荣翔园 75㎡ 1600 元
const DISTRICT_PRICE_FACTOR: Record<string, number> = {
  和平区: 1.55,
  河西区: 1.3,
  南开区: 1.25,
  河北区: 0.95,
  河东区: 1.05,
  红桥区: 0.82,
  北辰区: 0.72,
  东丽区: 0.65,
  西青区: 0.72,
  津南区: 0.5,
};

const BASE_PRICE_PER_SQM = 36; // 元/㎡·月，按天津真实市场校准

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

interface GenerateOptions {
  count: number;
  seed?: number;
}

// ---------- 平台真实链接 ----------
// 全部为实测验证过的真实地址：
//  - 链家/贝壳：优先小区 ID 直达页 /zufang/c{ID}/（真实小区在租列表，
//    ID 抓取自贝壳各区房源页；链家与贝壳共用同一套小区 ID），
//    未收录小区回退官方关键词搜索 /rs关键词/
//  - 安居客：?kw= 关键词搜索（真实浏览器实测返回该小区真实房源）
//  - 58同城：?key= 官方关键词搜索格式
//  - 自如：ziroom 域名被腾讯 EdgeOne WAF 硬拦截（外部点击直接
//    "Restricted Access"），自如房源在贝壳有同步展示，改跳贝壳小区页
//  - 个人房东：安居客个人房源栏目 l2（58 系，实测可访问）
function buildSourceUrl(
  platform: Platform,
  community: string,
  _district: string,
  _rentType: RentType,
): string {
  const kw = encodeURIComponent(community);
  const cid = BEIKE_COMMUNITY_IDS[community];
  switch (platform) {
    case 'lianjia':
      return cid
        ? `https://tj.lianjia.com/zufang/${cid}/`
        : `https://tj.lianjia.com/zufang/rs${kw}/`;
    case 'beike':
      return cid
        ? `https://tj.zu.ke.com/zufang/${cid}/`
        : `https://tj.zu.ke.com/zufang/rs${kw}/`;
    case 'anjuke':
      return `https://tj.zu.anjuke.com/fangyuan/?kw=${kw}`;
    case '58':
      return `https://tj.58.com/chuzu/?key=${kw}`;
    case 'ziroom':
      // 自如域名被 WAF 硬拦截，自如托管房源在贝壳同步展示
      return cid
        ? `https://tj.zu.ke.com/zufang/${cid}/`
        : `https://tj.zu.anjuke.com/fangyuan/?kw=${kw}`;
    default:
      return `https://tj.zu.anjuke.com/fangyuan/l2/?kw=${kw}`;
  }
}

/**
 * 生成房源数据集。默认 10000 条，上限 50000 条。
 * 数据基于真实参考生成：真实小区（贝壳/安居客/自如在租小区）、
 * 真实板块坐标、真实地铁站与线路、真实市场租金校准。
 */
export function generateListings({ count, seed = 20260824 }: GenerateOptions): HouseListing[] {
  const rand = mulberry32(seed);
  const now = Date.now();

  // 预计算区域加权抽样池，避免每条重复计算
  const districtPool: typeof DISTRICTS = [];
  for (const d of DISTRICTS) {
    const w = DISTRICT_WEIGHTS[d.name] ?? 1;
    const n = Math.max(1, Math.round(w * 10));
    for (let i = 0; i < n; i++) districtPool.push(d);
  }

  const listings: HouseListing[] = new Array(count);

  for (let i = 0; i < count; i++) {
    const district = pick(rand, districtPool);
    const block = pick(rand, district.blocks);
    // 真实小区名（来自贝壳/安居客/自如在租小区数据）
    const community = pick(rand, block.communities);

    // 坐标：真实板块中心附近小幅撒点（±0.005°，约 500m）
    const lng = +(block.lng + (rand() - 0.5) * 0.01).toFixed(6);
    const lat = +(block.lat + (rand() - 0.5) * 0.008).toFixed(6);

    // 地铁：使用板块真实地铁信息（无地铁板块 nearSubway=false）
    const sw = block.subway;
    const nearSubway = sw !== null;
    const subwayLine = sw ? sw.line : '';
    const subwayStation = sw ? sw.station : '';
    const subwayDistance = sw
      ? Math.max(80, Math.round(sw.walk * (0.85 + rand() * 0.3)))
      : 0;

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

    // 价格：按真实市场校准（区域/类型/装修/楼层/地铁因子）
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
    const subwayFactor = nearSubway ? 1.06 : 1.0;

    const rawPrice =
      areaSize *
      BASE_PRICE_PER_SQM *
      districtFactor *
      rentFactor *
      decoFactor *
      floorFactor *
      subwayFactor;
    // 合租按间计价，整数化到 50
    const price = Math.max(600, Math.round(rawPrice / 50) * 50);

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
      sourceUrl: buildSourceUrl(platform, community, district.name, rentType),
    };
  }

  return listings;
}

// ---------- 对外常量与缓存封装 ----------

export const MAX_LISTING_COUNT = 50000;
export const DEFAULT_LISTING_COUNT = 10000;

/** 按 count 缓存生成结果（确定性 PRNG 保证同 count 结果一致） */
const cache = new Map<number, HouseListing[]>();

export function getListings(count: number): HouseListing[] {
  const n = Math.min(MAX_LISTING_COUNT, Math.max(1, Math.round(count)));
  let data = cache.get(n);
  if (!data) {
    data = generateListings({ count: n });
    if (cache.size >= 8) cache.clear(); // 简单容量控制
    cache.set(n, data);
  }
  return data;
}
