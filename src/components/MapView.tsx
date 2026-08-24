import { useEffect, useMemo, useRef } from 'react';
import {
  Circle,
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import { useListingStore, type UserLocation } from '@/store/useListingStore';
import {
  PLATFORM_COLORS,
  PLATFORM_LABELS,
  type HouseListing,
} from '@/types/house';
import { cn, formatNumber } from '@/lib/utils';

const TIANJIN_CENTER: [number, number] = [39.13, 117.2];
const MAX_MARKERS = 400;

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

export default function MapView({ className }: { className?: string }) {
  const filtered = useListingStore((s) => s.getFiltered());
  const userLocation = useListingStore((s) => s.userLocation);
  const mapRef = useRef<HTMLDivElement>(null);

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
        className="h-full w-full"
      >
        {/* 高德瓦片：境内加载快且稳定（OSM 在部分网络环境不可达） */}
        <TileLayer
          attribution='&copy; 高德地图'
          url="https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
          subdomains={['1', '2', '3', '4']}
        />
        {userLocation && <UserLocationMarker location={userLocation} />}
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

      {filtered.length > MAX_MARKERS && (
        <div className="absolute bottom-2 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-[11px] text-white backdrop-blur">
          地图采样 {formatNumber(markers.length)}/{formatNumber(filtered.length)} 个房源
        </div>
      )}
    </div>
  );
}
