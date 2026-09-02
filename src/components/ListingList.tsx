import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { Inbox } from 'lucide-react';
import { useListingStore } from '@/store/useListingStore';
import ListingCard from './ListingCard';

export default function ListingList() {
  const filtered = useListingStore((s) => s.getFiltered());
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    // 卡片 ~132px + 卡片间留白 10px（item 容器 pb-2.5 计入实测高度）
    estimateSize: () => 142,
    overscan: 6,
    measureElement: undefined,
  });

  if (filtered.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-charcoal-200 text-charcoal-400">
        <Inbox size={32} />
        <span className="text-sm">没有匹配的房源，试试调整筛选条件</span>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="scrollbar-thin h-[calc(100vh-23rem)] overflow-y-auto rounded-xl"
    >
      <div
        style={{ height: virtualizer.getTotalSize() }}
        className="relative w-full"
      >
        {virtualizer.getVirtualItems().map((item) => {
          const listing = filtered[item.index];
          return (
            <div
              key={listing.id}
              data-index={item.index}
              ref={virtualizer.measureElement}
              /* pb-2.5：卡片间留白，measureElement 实测高度含留白，
                 虚拟定位随之下移，形成呼吸感 */
              className="absolute left-0 top-0 w-full px-0.5 pb-2.5"
              style={{ transform: `translateY(${item.start}px)` }}
            >
              <ListingCard listing={listing} />
            </div>
          );
        })}
        {/* 底部留白，避免最后一张被遮挡 */}
        <div className="h-2" />
      </div>
    </div>
  );
}
