import { useMemo, useRef } from 'react';
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
} from 'react-leaflet';
import { useListingStore } from '@/store/useListingStore';
import {
  PLATFORM_COLORS,
  PLATFORM_LABELS,
  type HouseListing,
} from '@/types/house';
import { formatNumber } from '@/lib/utils';

const TIANJIN_CENTER: [number, number] = [39.13, 117.2];
const MAX_MARKERS = 400;

export default function MapView() {
  const filtered = useListingStore((s) => s.getFiltered());
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
      className="relative h-[calc(100vh-23rem)] overflow-hidden rounded-xl border border-charcoal-100"
    >
      <MapContainer
        center={TIANJIN_CENTER}
        zoom={11}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
