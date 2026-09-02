import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { MapPin, X } from 'lucide-react';
import { useListingStore, type UserLocation } from '@/store/useListingStore';
import {
  PLATFORM_COLORS,
  PLATFORM_LABELS,
  type HouseListing,
} from '@/types/house';
import { cn, formatNumber } from '@/lib/utils';

const TIANJIN_CENTER: [number, number] = [39.13, 117.2];
const MAX_MARKERS = 400;
// 0 = 不限：保留标点作为距离参考锚点，但取消半径筛选
const PIN_RADIUS_OPTIONS = [0, 1, 2, 3, 5, 10];

/** 品牌色图钉图标（divIcon：SVG 图钉 + 落点脉冲光晕） */
const pinIcon = L.divIcon({
  className: 'mc-pin-icon',
  html: `
    <div class="mc-pin">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
           stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="#E63D08"/>
        <circle cx="12" cy="10" r="3" fill="#fff" stroke="none"/>
      </svg>
    </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 28], // 图钉尖部对准点击坐标
  popupAnchor: [0, -26],
});

/** 定位成功后自动平移到用户位置 */
function FlyToUser({ location }: { location: UserLocation }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([location.lat, location.lng], 13, { duration: 1.2 });
  }, [location, map]);
  return null;
}

/** 用户位置标记：精度圈 + 中心点 */
function UserLocationMarker({ location }: { location: UserLocation }) {
  return (
    <>
      <Circle
        center={[location.lat, location.lng]}
        radius={location.accuracy}
        pathOptions={{ color: '#2563EB', weight: 1, fillColor: '#2563EB', fillOpacity: 0.08 }}
      />
      <CircleMarker
        center={[location.lat, location.lng]}
        radius={7}
        pathOptions={{ color: '#fff', weight: 3, fillColor: '#2563EB', fillOpacity: 1 }}
      >
        <Popup>我的位置 · 精度 ±{Math.round(location.accuracy)}m</Popup>
      </CircleMarker>
      <FlyToUser location={location} />
    </>
  );
}

/** 标点模式：点击地图放置/移动搜索图钉 */
function MapClickCatcher({ active, onPick }: { active: boolean; onPick: (lat: number, lng: number) => void }) {
  const map = useMap();
  // 进入标点模式时关闭已打开的房源弹窗：弹窗区域会吞掉地图点击，导致落点失败
  useEffect(() => {
    if (active) map.closePopup();
  }, [active, map]);
  useMapEvents({
    click(e) {
      if (active) onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/** 图钉落点后轻推视图，保证半径圈完整可见 */
function FlyToPin({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 13, { duration: 0.8 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);
  return null;
}

export default function MapView({ className }: { className?: string }) {
  const filtered = useListingStore((s) => s.getFiltered());
  const userLocation = useListingStore((s) => s.userLocation);
  const mapPin = useListingStore((s) => s.mapPin);
  const setMapPin = useListingStore((s) => s.setMapPin);
  const clearMapPin = useListingStore((s) => s.clearMapPin);
  const filters = useListingStore((s) => s.filters);
  const setFilters = useListingStore((s) => s.setFilters);
  const mapRef = useRef<HTMLDivElement>(null);
  const [pinMode, setPinMode] = useState(false);

  const markers = useMemo(() => {
    // 性能：地图上最多渲染 MAX_MARKERS 个点
    if (filtered.length <= MAX_MARKERS) return filtered;
    const step = Math.ceil(filtered.length / MAX_MARKERS);
    const sampled: HouseListing[] = [];
    for (let i = 0; i < filtered.length && sampled.length < MAX_MARKERS; i += step) {
      sampled.push(filtered[i]);
    }
    return sampled;
  }, [filtered]);

  return (
    <div
      ref={mapRef}
      className={cn(
        'relative h-[calc(100vh-23rem)] overflow-hidden rounded-xl border border-charcoal-100',
        className,
      )}
    >
      <MapContainer
        center={TIANJIN_CENTER}
        zoom={11}
        scrollWheelZoom={false}
        className={cn('h-full w-full', pinMode && 'cursor-crosshair')}
      >
        {/* 高德瓦片：境内加载快且稳定（OSM 在部分网络环境不可达） */}
        <TileLayer
          attribution='&copy; 高德地图'
          url="https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
          subdomains={['1', '2', '3', '4']}
        />
        <MapClickCatcher
          active={pinMode}
          onPick={(lat, lng) => {
            setMapPin(lng, lat);
            setPinMode(false); // 单次落点，避免误触；拖拽图钉可继续调整
          }}
        />

        {userLocation && !mapPin && <UserLocationMarker location={userLocation} />}

        {/* 地图标点：可拖拽图钉 + 半径圈（标点优先作为搜索圆心；"不限"时不画圈） */}
        {mapPin && (
          <>
            {filters.nearbyRadiusKm > 0 && (
              <Circle
                center={[mapPin.lat, mapPin.lng]}
                radius={filters.nearbyRadiusKm * 1000}
                pathOptions={{
                  color: '#E63D08',
                  weight: 2,
                  dashArray: '6 6',
                  fillColor: '#FF5516',
                  fillOpacity: 0.06,
                }}
              />
            )}
            <Marker
              position={[mapPin.lat, mapPin.lng]}
              icon={pinIcon}
              draggable
              autoPan
              eventHandlers={{
                dragend: (e) => {
                  const p = (e.target as L.Marker).getLatLng();
                  // keepRadius：拖拽只移动圆心，保持当前半径设置（含"不限"）
                  setMapPin(p.lng, p.lat, { keepRadius: true });
                },
              }}
            >
              <Popup>
                <div className="text-xs">
                  <div className="font-semibold">搜索中心</div>
                  <div className="text-charcoal-400">
                    拖动图钉调整位置 ·{' '}
                    {filters.nearbyRadiusKm > 0
                      ? `${filters.nearbyRadiusKm}km 内`
                      : '半径不限'}{' '}
                    共 {formatNumber(filtered.length)} 套
                  </div>
                </div>
              </Popup>
            </Marker>
            <FlyToPin lat={mapPin.lat} lng={mapPin.lng} />
          </>
        )}

        {markers.map((l) => (
          <CircleMarker
            key={l.id}
            center={[l.lat, l.lng]}
            radius={5}
            pathOptions={{
              color: PLATFORM_COLORS[l.platform],
              fillColor: PLATFORM_COLORS[l.platform],
              fillOpacity: 0.7,
              weight: 1,
            }}
          >
            <Popup>
              <div className="text-xs">
                <div className="font-semibold">{l.community}</div>
                <div>
                  {l.rooms}室{l.halls}厅 · {l.areaSize}㎡
                </div>
                <div className="text-brand-600 font-bold">
                  ¥{formatNumber(l.price)}/月
                </div>
                <div className="text-charcoal-400">
                  {PLATFORM_LABELS[l.platform]} · {l.district} {l.area}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* 标点找房开关：点击开启后地图变十字光标，点地图落图钉 */}
      <button
        type="button"
        onClick={() => setPinMode((v) => !v)}
        className={cn(
          'absolute left-3 top-3 z-[1000] inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold shadow-md backdrop-blur transition',
          pinMode
            ? 'border-brand-500 bg-brand-500 text-white shadow-brand-500/30'
            : 'border-charcoal-200/80 bg-white/95 text-charcoal-600 hover:border-brand-300 hover:text-brand-600',
        )}
      >
        <MapPin size={14} className={pinMode ? 'animate-page-bounce' : ''} />
        {pinMode ? '点击地图放置图钉' : '标点找房'}
      </button>

      {/* 标点面板：半径选择（含"不限"）+ 结果统计 + 清除 */}
      {mapPin && (
        <div className="absolute bottom-3 left-3 z-[1000] flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-1.5 rounded-xl border border-brand-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
          <span className="mr-0.5 text-xs font-semibold text-brand-600">范围找房</span>
          {PIN_RADIUS_OPTIONS.map((km) => (
            <button
              key={km}
              type="button"
              onClick={() => setFilters({ nearbyRadiusKm: km })}
              className={cn(
                'rounded-full px-2.5 py-1 text-[11px] font-medium transition',
                filters.nearbyRadiusKm === km
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-brand-50 text-brand-600 hover:bg-brand-100',
              )}
            >
              {km === 0 ? '不限' : `${km}km`}
            </button>
          ))}
          <span className="ml-1 text-[11px] text-charcoal-500">
            {filters.nearbyRadiusKm > 0
              ? `${filters.nearbyRadiusKm}km 内 ${formatNumber(filtered.length)} 套`
              : `半径不限 ${formatNumber(filtered.length)} 套`}{' '}
            · 拖动图钉可调整
          </span>
          <button
            type="button"
            onClick={clearMapPin}
            title="清除标点"
            className="ml-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-charcoal-100 text-charcoal-500 transition hover:bg-red-50 hover:text-red-500"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {filtered.length > MAX_MARKERS && (
        <div className="absolute bottom-2 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-[11px] text-white backdrop-blur">
          地图采样 {formatNumber(markers.length)}/{formatNumber(filtered.length)} 个房源
        </div>
      )}
    </div>
  );
}
