import L from 'leaflet'
import { formatPrice } from '@/lib/format'
import type { Listing } from '@/types/listing'

/** 创建价格气泡 DivIcon */
export function createPriceIcon(listing: Listing, active = false): L.DivIcon {
  const directClass = listing.isDirectRent ? ' is-direct' : ''
  const activeClass = active ? ' is-active' : ''
  return L.divIcon({
    className: 'price-marker-wrapper',
    html: `<div class="price-marker${directClass}${activeClass}">¥${formatPrice(listing.price)}</div>`,
    iconSize: [60, 24],
    iconAnchor: [30, 12],
  })
}
