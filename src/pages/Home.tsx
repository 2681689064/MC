import { HeroSearch } from '@/components/home/HeroSearch'
import { HotDistricts } from '@/components/home/HotDistricts'
import { FeaturedListings } from '@/components/home/FeaturedListings'
import { PriceBoard } from '@/components/home/PriceBoard'
import { DirectRentStrip } from '@/components/home/DirectRentStrip'

export function Home() {
  return (
    <div className="animate-fade-in">
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-10">
        <HeroSearch />
      </section>
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <FeaturedListings />
      </section>
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <HotDistricts />
      </section>
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <PriceBoard />
      </section>
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <DirectRentStrip />
      </section>
    </div>
  )
}
