// 天津真实参考数据（区 / 板块 / 小区 / 地铁）
// 小区与板块均来自贝壳(tj.zu.ke.com)、安居客、自如天津站真实在租房源；
// 板块坐标为真实板块中心近似值，地铁站与线路为真实运营线路（1/2/3/4/5/6/9/10/11号线）。
// 无地铁覆盖的板块 subway 为 null（真实情况，如咸水沽老城、双街、东丽湖等）。

export interface SubwayInfo {
  line: string; // 线路，如 "1号线"
  station: string; // 最近站点
  walk: number; // 步行距离（米）
}

export interface BlockInfo {
  name: string;
  lng: number;
  lat: number;
  communities: string[]; // 真实在租小区
  subway: SubwayInfo | null;
}

export interface DistrictInfo {
  name: string;
  center: [number, number]; // [lng, lat]
  blocks: BlockInfo[];
}

/** 自如天津站区域代码（用于构建真实可跳转的区域房源链接） */
export const ZIROOM_DISTRICT_CODES: Record<string, string> = {
  和平区: '120101',
  河东区: '120102',
  河西区: '120103',
  南开区: '120104',
  河北区: '120105',
  红桥区: '120106',
  东丽区: '120110',
  西青区: '120111',
  津南区: '120112',
  北辰区: '120113',
};

export const DISTRICTS: DistrictInfo[] = [
  // ---------- 和平区 ----------
  {
    name: '和平区',
    center: [117.2145, 39.1171],
    blocks: [
      {
        name: '南营门街',
        lng: 117.205,
        lat: 39.112,
        communities: ['世昌里', '众诚里', '吉利花园', '瑞竹大厦', '融创星河和平印'],
        subway: { line: '1号线', station: '鞍山道', walk: 500 },
      },
      {
        name: '新兴街',
        lng: 117.205,
        lat: 39.108,
        communities: ['三乐里', '三友里', '宜昌北里'],
        subway: { line: '3号线', station: '西康路', walk: 600 },
      },
      {
        name: '劝业场',
        lng: 117.204,
        lat: 39.121,
        communities: ['中海和平之门', '光华巷', '华润紫阳里'],
        subway: { line: '3号线', station: '和平路', walk: 400 },
      },
      {
        name: '小白楼',
        lng: 117.217,
        lat: 39.117,
        communities: ['招商津湾天玺', '诚基中心'],
        subway: { line: '1号线', station: '小白楼', walk: 350 },
      },
      {
        name: '体育馆街',
        lng: 117.21,
        lat: 39.113,
        communities: ['团圆里', '郑业里', '鸿德里', '益寿里'],
        subway: { line: '1号线', station: '营口道', walk: 450 },
      },
      {
        name: '南市',
        lng: 117.195,
        lat: 39.115,
        communities: ['荣庆园', '天津大都会'],
        subway: { line: '1号线', station: '二纬路', walk: 550 },
      },
    ],
  },

  // ---------- 河东区 ----------
  {
    name: '河东区',
    center: [117.2523, 39.1283],
    blocks: [
      {
        name: '常州道',
        lng: 117.245,
        lat: 39.135,
        communities: ['东瑞家园', '常州里', '欢颜里', '益寿东里', '靖泰里'],
        subway: { line: '2号线', station: '靖江路', walk: 700 },
      },
      {
        name: '唐家口',
        lng: 117.235,
        lat: 39.125,
        communities: ['东亚风尚国际', '欣荣馨苑'],
        subway: { line: '2号线', station: '远洋国际中心', walk: 600 },
      },
      {
        name: '春华街',
        lng: 117.23,
        lat: 39.132,
        communities: ['春华里', '瑞金里', '秋实园'],
        subway: { line: '2号线', station: '天津站', walk: 800 },
      },
      {
        name: '太阳城',
        lng: 117.275,
        lat: 39.13,
        communities: ['太阳城蓝山园', '彩丽园', '万欣城'],
        subway: { line: '2号线', station: '屿东城', walk: 500 },
      },
      {
        name: '中山门街',
        lng: 117.266,
        lat: 39.11,
        communities: ['中山门四号路', '和睦北里'],
        subway: { line: '9号线', station: '中山门', walk: 400 },
      },
      {
        name: '万新村',
        lng: 117.285,
        lat: 39.115,
        communities: ['曲溪中里', '松风西里'],
        subway: { line: '2号线', station: '屿东城', walk: 1200 },
      },
      {
        name: '大王庄',
        lng: 117.225,
        lat: 39.12,
        communities: ['积善里'],
        subway: { line: '9号线', station: '大王庄', walk: 400 },
      },
      {
        name: '上杭路',
        lng: 117.255,
        lat: 39.118,
        communities: ['程林里小区', '金湾花园'],
        subway: { line: '9号线', station: '东兴路', walk: 900 },
      },
      {
        name: '二号桥街',
        lng: 117.275,
        lat: 39.095,
        communities: ['福东里', '紫乐广场'],
        subway: { line: '9号线', station: '二号桥', walk: 500 },
      },
      {
        name: '大直沽',
        lng: 117.24,
        lat: 39.115,
        communities: ['东和家园'],
        subway: { line: '9号线', station: '直沽', walk: 400 },
      },
    ],
  },

  // ---------- 河西区 ----------
  {
    name: '河西区',
    center: [117.2233, 39.0833],
    blocks: [
      {
        name: '下瓦房',
        lng: 117.218,
        lat: 39.091,
        communities: ['西楼北里', '龙海公寓'],
        subway: { line: '1号线', station: '下瓦房', walk: 350 },
      },
      {
        name: '尖山',
        lng: 117.235,
        lat: 39.075,
        communities: ['名都公寓', '天物郁江溪岸', '津铁泽苑', '第六田园优仕公寓'],
        subway: { line: '6号线', station: '尖山路', walk: 500 },
      },
      {
        name: '天塔街',
        lng: 117.166,
        lat: 39.087,
        communities: ['五一阳光皓日园'],
        subway: { line: '3号线', station: '天塔', walk: 450 },
      },
      {
        name: '挂甲寺',
        lng: 117.228,
        lat: 39.08,
        communities: ['景福里', '福熙园'],
        subway: { line: '1号线', station: '土城', walk: 600 },
      },
      {
        name: '大营门',
        lng: 117.213,
        lat: 39.093,
        communities: ['广田里'],
        subway: { line: '1号线', station: '小白楼', walk: 650 },
      },
      {
        name: '越秀路',
        lng: 117.22,
        lat: 39.082,
        communities: ['健全里', '江门里', '白云里', '红波里'],
        subway: { line: '5号线', station: '西南楼', walk: 450 },
      },
      {
        name: '陈塘庄',
        lng: 117.251,
        lat: 39.079,
        communities: ['中海寰宇天下', '天房海河湾'],
        subway: { line: '1号线', station: '陈塘庄', walk: 500 },
      },
      {
        name: '桃园街',
        lng: 117.215,
        lat: 39.085,
        communities: ['元兴新里', '昆仑中心'],
        subway: { line: '5号线', station: '西南楼', walk: 900 },
      },
      {
        name: '马场街',
        lng: 117.208,
        lat: 39.085,
        communities: ['向荣里'],
        subway: { line: '3号线', station: '西康路', walk: 800 },
      },
      {
        name: '柳林街',
        lng: 117.262,
        lat: 39.062,
        communities: ['雅致里'],
        subway: { line: '1号线', station: '双林', walk: 1100 },
      },
      {
        name: '梅江',
        lng: 117.241,
        lat: 39.065,
        communities: ['景观花园', '万科水晶城'],
        subway: { line: '6号线', station: '梅江道', walk: 600 },
      },
      {
        name: '友谊路',
        lng: 117.228,
        lat: 39.085,
        communities: ['纯真里社区'],
        subway: { line: '5号线', station: '文化中心', walk: 500 },
      },
    ],
  },

  // ---------- 南开区 ----------
  {
    name: '南开区',
    center: [117.1644, 39.1207],
    blocks: [
      {
        name: '王顶堤',
        lng: 117.151,
        lat: 39.095,
        communities: ['凤园北里', '凤园南里', '林苑北里', '江川里', '金厦里', '金环里'],
        subway: { line: '3号线', station: '王顶堤', walk: 450 },
      },
      {
        name: '水上公园街',
        lng: 117.172,
        lat: 39.09,
        communities: ['天房崇德园'],
        subway: { line: '3号线', station: '周邓纪念馆', walk: 700 },
      },
      {
        name: '向阳路',
        lng: 117.15,
        lat: 39.135,
        communities: ['熙汇广场'],
        subway: { line: '2号线', station: '咸阳路', walk: 600 },
      },
      {
        name: '体育中心街',
        lng: 117.16,
        lat: 39.085,
        communities: ['阳光100西园'],
        subway: { line: '5号线', station: '体育中心', walk: 500 },
      },
      {
        name: '鼓楼街',
        lng: 117.176,
        lat: 39.137,
        communities: ['平祥大厦', '龙亭家园公寓', '大悦公寓'],
        subway: { line: '2号线', station: '鼓楼', walk: 400 },
      },
      {
        name: '长虹街',
        lng: 117.16,
        lat: 39.13,
        communities: ['幸福南里', '建设新街'],
        subway: { line: '2号线', station: '长虹公园', walk: 550 },
      },
      {
        name: '万兴街',
        lng: 117.165,
        lat: 39.118,
        communities: ['义兴南里', '龙井里', '同安里'],
        subway: { line: '6号线', station: '鞍山西道', walk: 500 },
      },
      {
        name: '嘉陵道街',
        lng: 117.155,
        lat: 39.115,
        communities: ['云阳西里', '嘉陵南里', '泊江东里', '宜宾东里', '雅安西里'],
        subway: { line: '6号线', station: '宜宾道', walk: 400 },
      },
      {
        name: '兴南街',
        lng: 117.17,
        lat: 39.125,
        communities: ['源德里', '聚英里'],
        subway: { line: '1号线', station: '二纬路', walk: 500 },
      },
      {
        name: '华苑',
        lng: 117.138,
        lat: 39.104,
        communities: ['绮华里'],
        subway: { line: '3号线', station: '华苑', walk: 450 },
      },
    ],
  },

  // ---------- 河北区 ----------
  {
    name: '河北区',
    center: [117.1967, 39.1483],
    blocks: [
      {
        name: '江都路',
        lng: 117.215,
        lat: 39.148,
        communities: ['明山里', '隆升家园'],
        subway: { line: '5号线', station: '建昌道', walk: 1100 },
      },
      {
        name: '光复道',
        lng: 117.208,
        lat: 39.143,
        communities: ['嘉海花园'],
        subway: { line: '3号线', station: '津湾广场', walk: 700 },
      },
      {
        name: '铁东路',
        lng: 117.18,
        lat: 39.16,
        communities: ['任贤里', '爱贤里', '金尚家园', '金水畔家园'],
        subway: { line: '3号线', station: '铁东路', walk: 450 },
      },
      {
        name: '鸿顺里街',
        lng: 117.19,
        lat: 39.152,
        communities: ['双湖花园', '月秋里', '辰润里'],
        subway: { line: '3号线', station: '中山路', walk: 550 },
      },
      {
        name: '新开河',
        lng: 117.195,
        lat: 39.158,
        communities: ['中环福境', '北洋花园东悦里', '盛泰嘉园', '隆成家园'],
        subway: { line: '6号线', station: '新开河', walk: 450 },
      },
      {
        name: '王串场',
        lng: 117.215,
        lat: 39.155,
        communities: ['焕玉里', '玉容花园'],
        subway: { line: '5号线', station: '金钟河大街', walk: 700 },
      },
      {
        name: '建昌道',
        lng: 117.205,
        lat: 39.162,
        communities: ['三和温泉花园地利园', '中国铁建国际城诗景凤苑', '中国铁建国际城诗景雅苑', '泗阳里'],
        subway: { line: '5号线', station: '建昌道', walk: 400 },
      },
      {
        name: '望海楼',
        lng: 117.195,
        lat: 39.147,
        communities: ['孚泰公寓'],
        subway: { line: '3号线', station: '金狮桥', walk: 500 },
      },
      {
        name: '宁园',
        lng: 117.185,
        lat: 39.155,
        communities: ['汇园里', '泽园公寓', '芳园里'],
        subway: { line: '3号线', station: '北站', walk: 500 },
      },
    ],
  },

  // ---------- 红桥区 ----------
  {
    name: '红桥区',
    center: [117.1515, 39.1673],
    blocks: [
      {
        name: '丁字沽街',
        lng: 117.14,
        lat: 39.175,
        communities: ['丁字沽十三段', '七段大楼', '潞河园'],
        subway: { line: '1号线', station: '勤俭道', walk: 500 },
      },
      {
        name: '双环邨',
        lng: 117.155,
        lat: 39.185,
        communities: ['九和府', '碧春园'],
        subway: { line: '1号线', station: '本溪路', walk: 800 },
      },
      {
        name: '西沽街',
        lng: 117.155,
        lat: 39.16,
        communities: ['正源公寓', '民畅园', '水竹花园', '河怡花园', '金筑家园', '风光里', '风采里'],
        subway: { line: '4号线', station: '西沽公园', walk: 550 },
      },
      {
        name: '咸阳北路',
        lng: 117.148,
        lat: 39.165,
        communities: ['同心楼'],
        subway: { line: '1号线', station: '勤俭道', walk: 600 },
      },
      {
        name: '铃铛阁',
        lng: 117.16,
        lat: 39.16,
        communities: ['西关北里'],
        subway: { line: '1号线', station: '西北角', walk: 500 },
      },
      {
        name: '和苑',
        lng: 117.145,
        lat: 39.16,
        communities: ['和苑康和园'],
        subway: { line: '1号线', station: '西站', walk: 1000 },
      },
      {
        name: '大胡同',
        lng: 117.17,
        lat: 39.155,
        communities: ['金领花园'],
        subway: { line: '2号线', station: '东南角', walk: 450 },
      },
      {
        name: '西于庄',
        lng: 117.162,
        lat: 39.17,
        communities: ['中嘉花园秋水苑', '本溪花园'],
        subway: { line: '1号线', station: '西站', walk: 800 },
      },
    ],
  },

  // ---------- 北辰区 ----------
  {
    name: '北辰区',
    center: [117.1353, 39.2253],
    blocks: [
      {
        name: '北仓镇',
        lng: 117.135,
        lat: 39.23,
        communities: ['民悦园', '泽天下', '盛庭豪景', '祥诚新苑', '荣翔园', '铭辰雅苑'],
        subway: null,
      },
      {
        name: '小淀镇',
        lng: 117.23,
        lat: 39.245,
        communities: ['北宸正荣府', '碧桂园中骏天寰', '融创臻园'],
        subway: { line: '3号线', station: '小淀', walk: 900 },
      },
      {
        name: '瑞景居住区',
        lng: 117.12,
        lat: 39.21,
        communities: ['奥林匹克花园枫叶苑', '宝翠花都瞰景园', '秋瑞家园'],
        subway: { line: '1号线', station: '西横堤', walk: 600 },
      },
      {
        name: '天穆镇',
        lng: 117.165,
        lat: 39.2,
        communities: ['天和丽园', '绿岛家园'],
        subway: { line: '3号线', station: '宜兴埠', walk: 800 },
      },
      {
        name: '双街',
        lng: 117.105,
        lat: 39.255,
        communities: ['双街新邨', '国耀上河城', '城际美景家园', '聚龙园', '融创东岸名郡'],
        subway: null,
      },
      {
        name: '果园新村',
        lng: 117.15,
        lat: 39.225,
        communities: ['东升里小区'],
        subway: null,
      },
      {
        name: '宜兴埠',
        lng: 117.175,
        lat: 39.205,
        communities: ['宜淞园二期', '未来城沁雅苑', '民顺里'],
        subway: { line: '3号线', station: '宜兴埠', walk: 400 },
      },
      {
        name: '普东街',
        lng: 117.185,
        lat: 39.215,
        communities: ['淮盛园', '淮祥园'],
        subway: { line: '5号线', station: '淮河道', walk: 500 },
      },
    ],
  },

  // ---------- 东丽区 ----------
  {
    name: '东丽区',
    center: [117.3138, 39.1388],
    blocks: [
      {
        name: '华明镇',
        lng: 117.341,
        lat: 39.171,
        communities: ['华润橡树湾仰润轩', '华润橡树湾茗润轩', '禾园', '达园'],
        subway: null,
      },
      {
        name: '张贵庄',
        lng: 117.3,
        lat: 39.128,
        communities: ['先锋公寓', '海康园', '詹滨里'],
        subway: { line: '9号线', station: '张贵庄', walk: 450 },
      },
      {
        name: '万新街',
        lng: 117.29,
        lat: 39.12,
        communities: ['临月里', '好美嘉园', '程林东里', '金隅悦城茗香苑', '香邑国际'],
        subway: { line: '9号线', station: '一号桥', walk: 800 },
      },
      {
        name: '新立街',
        lng: 117.315,
        lat: 39.115,
        communities: ['万科民和巷', '万科金域华府C区', '丽瑞华庭', '悦盛园'],
        subway: { line: '9号线', station: '新立', walk: 500 },
      },
      {
        name: '东丽湖',
        lng: 117.39,
        lat: 39.17,
        communities: ['华侨城善水苑', '松江东湖小镇', '揽城苑'],
        subway: null,
      },
      {
        name: '金钟街',
        lng: 117.245,
        lat: 39.17,
        communities: ['德盈里'],
        subway: { line: '6号线', station: '金钟街', walk: 500 },
      },
      {
        name: '军粮城',
        lng: 117.44,
        lat: 39.11,
        communities: ['军丽园'],
        subway: { line: '9号线', station: '军粮城', walk: 600 },
      },
      {
        name: '空港经济区',
        lng: 117.37,
        lat: 39.118,
        communities: ['意境兰庭', '万顺空港融和广场雅仕阁公寓'],
        subway: { line: '2号线', station: '滨海国际机场', walk: 900 },
      },
    ],
  },

  // ---------- 西青区 ----------
  {
    name: '西青区',
    center: [117.0123, 39.1413],
    blocks: [
      {
        name: '中北镇',
        lng: 117.04,
        lat: 39.15,
        communities: ['天津东方环球影城', '万科四季花城'],
        subway: { line: '2号线', station: '曹庄', walk: 800 },
      },
      {
        name: '张家窝',
        lng: 116.98,
        lat: 39.13,
        communities: ['社会山南苑', '君悦花苑', '万科朗润园'],
        subway: { line: '3号线', station: '南站', walk: 700 },
      },
      {
        name: '精武',
        lng: 117.03,
        lat: 39.06,
        communities: ['保利和光尘樾'],
        subway: { line: '3号线', station: '大学城', walk: 800 },
      },
      {
        name: '侯台',
        lng: 117.14,
        lat: 39.13,
        communities: ['利海家园'],
        subway: { line: '3号线', station: '华苑', walk: 900 },
      },
      {
        name: '杨柳青',
        lng: 117.01,
        lat: 39.17,
        communities: ['莱茵小镇'],
        subway: null,
      },
    ],
  },

  // ---------- 津南区 ----------
  {
    name: '津南区',
    center: [117.3523, 38.9933],
    blocks: [
      {
        name: '八里台',
        lng: 117.29,
        lat: 38.97,
        communities: ['大唐盛世', '天津碧桂园', '融创星耀五洲'],
        subway: null,
      },
      {
        name: '咸水沽',
        lng: 117.34,
        lat: 39.0,
        communities: ['南华里', '富力又一城合安园', '富力又一城合畅园', '富力合祥园', '富力合茂园', '惠安花园', '惠裕里', '星宇花园', '沽上江南', '诚信里小区', '金才园'],
        subway: { line: '1号线', station: '东沽路', walk: 1200 },
      },
      {
        name: '辛庄',
        lng: 117.36,
        lat: 39.04,
        communities: ['义佳花园', '汀兰花园', '金地艺境', '首创城'],
        subway: { line: '1号线', station: '洪泥河东', walk: 1500 },
      },
      {
        name: '海河教育园区',
        lng: 117.37,
        lat: 38.97,
        communities: ['路劲赞成', '雅居乐御宾府'],
        subway: null,
      },
      {
        name: '小站镇',
        lng: 117.34,
        lat: 38.9,
        communities: ['天山·水榭花都', '蓝光芙蓉公馆'],
        subway: null,
      },
      {
        name: '双港',
        lng: 117.31,
        lat: 39.02,
        communities: ['华润中央公园', '天房意境'],
        subway: { line: '6号线', station: '梅林路', walk: 800 },
      },
      {
        name: '双林',
        lng: 117.3,
        lat: 39.03,
        communities: ['泓林园'],
        subway: { line: '1号线', station: '双林', walk: 400 },
      },
    ],
  },
];

/** 真实运营地铁线路（筛选项） */
export const SUBWAY_LINES = [
  '1号线',
  '2号线',
  '3号线',
  '4号线',
  '5号线',
  '6号线',
  '9号线',
];

export const LANDLORD_NAMES = [
  '王女士',
  '李先生',
  '张女士',
  '刘先生',
  '陈阿姨',
  '赵先生',
  '孙女士',
  '周先生',
  '吴姐',
  '徐先生',
  '贝壳·小刘',
  '链家·小李',
  '自如管家',
  '安居客·老周',
  '58·小张',
  '房东直租·刘姐',
];
