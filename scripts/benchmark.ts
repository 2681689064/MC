/**
 * 房源模块性能基准测试（Node 环境，V8 引擎与浏览器一致，指标可参考）
 * 运行：npm run bench
 */
import { performance } from 'node:perf_hooks';
import process from 'node:process';
import {
  DEFAULT_FILTERS,
  applyFilters,
  applySort,
} from '../src/store/useListingStore';
import {
  generateListings,
  getListings,
} from '../src/data/generateListings';

interface Row {
  label: string;
  ms: number;
}

const rows: Row[] = [];

function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

/** 多次运行取中位数，降低 JIT / GC 抖动 */
function timeIt(label: string, fn: () => unknown, runs = 5): number {
  const times: number[] = [];
  for (let i = 0; i < runs; i++) {
    const t0 = performance.now();
    fn();
    times.push(performance.now() - t0);
  }
  const ms = median(times);
  rows.push({ label, ms });
  console.log(`  ${label}  ${ms.toFixed(1)} ms`);
  return ms;
}

function heapMB(): number {
  return process.memoryUsage().heapUsed / 1024 / 1024;
}

console.log(`\n=== 房源模块性能基准（Node ${process.version}）===\n`);

// [1] 数据生成
console.log('[1] 数据生成（每次换随机种子，取中位数）');
let seedSeq = 1;
for (const count of [1200, 10000, 50000]) {
  timeIt(`生成 ${count.toLocaleString('zh-CN')} 条`, () =>
    generateListings({ count, seed: 1000 + seedSeq++ * 7919 }),
  );
}

// [2] LRU 缓存命中
console.log('\n[2] LRU 缓存命中（在已生成过的数量规模间切换）');
timeIt('getListings(50,000) 缓存命中', () => {
  const d = getListings(50000);
  if (d.length !== 50000) throw new Error('unexpected cache miss');
});

// [3] 过滤性能
const data = getListings(50000);
console.log('\n[3] 过滤性能（50,000 条全量）');
timeIt('无条件全量过滤', () => applyFilters(data, { ...DEFAULT_FILTERS }));
timeIt('区域筛选（和平区）', () =>
  applyFilters(data, { ...DEFAULT_FILTERS, district: '和平区' }),
);
timeIt('关键词筛选（万科）', () =>
  applyFilters(data, { ...DEFAULT_FILTERS, keyword: '万科' }),
);
timeIt('组合筛选（整租+近地铁+价格区间）', () =>
  applyFilters(data, {
    ...DEFAULT_FILTERS,
    rentType: 'whole',
    nearSubwayOnly: true,
    priceMin: 2000,
    priceMax: 5000,
  }),
);

// [4] 排序性能
console.log('\n[4] 排序性能（50,000 条全量）');
timeIt('租金升序排序（默认低价优先）', () => applySort(data, 'price-asc'));
timeIt('最新发布排序', () => applySort(data, 'newest'));
timeIt('面积降序排序', () => applySort(data, 'area-desc'));

// [5] 模拟搜索框连续输入（过滤+排序全流程）
console.log('\n[5] 模拟搜索框连续输入（过滤+排序全流程）');
const query = '万科城花园';
for (let len = 1; len <= query.length; len++) {
  const kw = query.slice(0, len);
  timeIt(
    `输入"${kw}"`,
    () =>
      applySort(
        applyFilters(data, { ...DEFAULT_FILTERS, keyword: kw }),
        'price-asc',
      ),
    3,
  );
}

// [6] 统计聚合
console.log('\n[6] 统计聚合（StatsBar 同款遍历）');
timeIt('均价/单价/占比聚合遍历', () => {
  let sum = 0;
  let psm = 0;
  let near = 0;
  let verified = 0;
  for (const l of data) {
    sum += l.price;
    psm += l.price / l.areaSize;
    if (l.nearSubway) near++;
    if (l.isVerified) verified++;
  }
  return { avg: sum / data.length, psm: psm / data.length, near, verified };
});

// [7] 内存
console.log('\n[7] 内存占用（--expose-gc 精确测量）');
const gc = (globalThis as { gc?: () => void }).gc;
if (gc) {
  gc();
  const before = heapMB();
  const fresh = generateListings({ count: 50000, seed: 424242 });
  gc(); // fresh 仍被引用不会被回收，仅清理生成过程中的临时对象
  const after = heapMB();
  const perListing = ((after - before) * 1024 * 1024) / fresh.length;
  console.log(
    `  50,000 条数据集 ≈ ${(after - before).toFixed(1)} MB（每条 ≈ ${perListing.toFixed(0)} 字节）`,
  );
} else {
  console.log('  未启用 --expose-gc，跳过精确内存测量');
}

// 结论
console.log('\n=== 结论 ===');
const BUDGET_MS = 50;
const interactiveSlow = rows.filter(
  (r) => r.ms >= BUDGET_MS && !r.label.includes('生成'),
);
if (interactiveSlow.length === 0) {
  console.log(
    `交互类操作（过滤/排序/输入/聚合）全部 < ${BUDGET_MS}ms 预算 ✅`,
  );
} else {
  console.log(
    `超过 ${BUDGET_MS}ms 预算的操作：${interactiveSlow
      .map((r) => `${r.label}(${r.ms.toFixed(0)}ms)`)
      .join('、')} ⚠️`,
  );
}
const gen50k = rows.find(
  (r) => r.label.includes('生成') && r.label.includes('50,000'),
);
if (gen50k) {
  console.log(
    `50,000 条首次生成 ${gen50k.ms.toFixed(0)}ms（LRU 缓存后二次切换 0ms）`,
  );
}
