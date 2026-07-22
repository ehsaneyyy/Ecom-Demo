import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import { SkeletonCard } from '../components/Skeleton'
import { useSEO } from '../hooks/useSEO'

export default function Home() {
  useSEO({ title: undefined, description: undefined, path: '/' })
  const { products, loading } = useData()

  const newProducts = useMemo(() => products.filter((p) => p.tag === 'New').slice(0, 4), [products])
  const saleProducts = useMemo(() => products.filter((p) => p.compareAtPrice).slice(0, 4), [products])

  return (
    <>
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 sm:mb-16">
            <Reveal>
              <div>
                <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/30 mb-3">Collection</p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em]">Shop All</h1>
              </div>
            </Reveal>
            <Reveal delay={40}>
              <Link
                to="/category/all"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 text-xs tracking-[0.1em] uppercase text-white/50 hover:bg-white hover:text-black transition-all duration-500"
              >
                View All
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-12 lg:gap-x-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : products.length > 0 ? (
              products.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-sm text-white/30 mb-4">No products available yet.</p>
                <p className="text-xs text-white/20">Check back soon for our latest collection.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Reveal>
              <Link to="/category/all" className="group relative overflow-hidden bg-[#141210] block aspect-[16/7] flex items-center">
                <div className="absolute inset-0">
                  <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full bg-[#c8a97e]/10 blur-[60px]" />
                </div>
                <div className="relative z-10 p-6 sm:p-10">
                  <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/30 mb-3">Limited Time</p>
                  <h2 className="text-xl sm:text-3xl font-bold tracking-[-0.03em] mb-2">Free Shipping</h2>
                  <p className="text-xs sm:text-sm text-white/30 mb-4">On all orders above ₹10,000</p>
                  <span className="inline-flex items-center gap-2 text-xs text-white/50 group-hover:text-white/70 transition-colors">
                    Shop Now
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            </Reveal>
            <Reveal delay={100}>
              <Link to="/category/all" className="group relative overflow-hidden bg-[#101218] block aspect-[16/7] flex items-center">
                <div className="absolute inset-0">
                  <div className="absolute top-1/3 right-1/4 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full bg-[#60a5fa]/10 blur-[60px]" />
                </div>
                <div className="relative z-10 p-6 sm:p-10">
                  <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/30 mb-3">New Season</p>
                  <h2 className="text-xl sm:text-3xl font-bold tracking-[-0.03em] mb-2">Summer 2026</h2>
                  <p className="text-xs sm:text-sm text-white/30 mb-4">Fresh arrivals for your home</p>
                  <span className="inline-flex items-center gap-2 text-xs text-white/50 group-hover:text-white/70 transition-colors">
                    Explore
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {newProducts.length > 0 && (
        <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="flex items-end justify-between mb-10 sm:mb-16">
                <div>
                  <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/30 mb-3">Just Arrived</p>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em]">New In</h2>
                </div>
                <Link to="/category/all" className="text-xs text-white/30 hover:text-white/50 transition-colors">
                  View all →
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-12 lg:gap-x-6">
              {newProducts.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {saleProducts.length > 0 && (
        <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="flex items-end justify-between mb-10 sm:mb-16">
                <div>
                  <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/30 mb-3">Limited Offer</p>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em]">On Sale</h2>
                </div>
                <Link to="/category/all" className="text-xs text-white/30 hover:text-white/50 transition-colors">
                  View all →
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-12 lg:gap-x-6">
              {saleProducts.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
