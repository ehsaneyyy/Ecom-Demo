import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import { SkeletonCard } from '../components/Skeleton'
import { useSEO } from '../hooks/useSEO'

const PROMOS = [
  {
    id: 'shipping',
    bg: 'bg-[#141210]',
    glow: 'bg-[#c8a97e]/10',
    glowPos: 'top-1/2 left-1/3',
    label: 'Limited Time',
    title: 'Free Shipping',
    subtitle: 'On all orders above ₹10,000',
    cta: 'Shop Now',
  },
  {
    id: 'summer',
    bg: 'bg-[#101218]',
    glow: 'bg-[#60a5fa]/10',
    glowPos: 'top-1/3 right-1/4',
    label: 'New Season',
    title: 'Summer 2026',
    subtitle: 'Fresh arrivals for your home',
    cta: 'Explore',
  },
  {
    id: 'festive',
    bg: 'bg-[#181210]',
    glow: 'bg-[#f59e0b]/10',
    glowPos: 'bottom-1/3 left-1/4',
    label: 'Festive Sale',
    title: 'Up to 40% Off',
    subtitle: 'Limited period festive specials',
    cta: 'Grab Deal',
  },
  {
    id: 'newarrivals',
    bg: 'bg-[#101412]',
    glow: 'bg-[#34d399]/10',
    glowPos: 'top-1/2 right-1/3',
    label: 'Just Dropped',
    title: 'New Arrivals',
    subtitle: 'Be the first to explore our latest collection',
    cta: 'Discover',
  },
]

export default function Home() {
  useSEO({ title: undefined, description: undefined, path: '/' })
  const { products, loading } = useData()

  const newProducts = useMemo(() => products.filter((p) => p.tag === 'New').slice(0, 4), [products])
  const saleProducts = useMemo(() => products.filter((p) => p.compareAtPrice).slice(0, 4), [products])

  const [promoIndex, setPromoIndex] = useState(0)
  const touchStart = useRef(null)
  const touchDelta = useRef(0)

  const nextPromo = useCallback(() => {
    setPromoIndex((i) => (i + 1) % PROMOS.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextPromo, 5000)
    return () => clearInterval(timer)
  }, [nextPromo])

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX
    touchDelta.current = 0
  }

  const handleTouchMove = (e) => {
    if (touchStart.current === null) return
    touchDelta.current = e.touches[0].clientX - touchStart.current
  }

  const handleTouchEnd = () => {
    if (Math.abs(touchDelta.current) > 50) {
      nextPromo()
    }
    touchStart.current = null
  }

  return (
    <>
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative overflow-hidden group"
            key={PROMOS[promoIndex].id}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Link to="/category/all" className={`group relative overflow-hidden ${PROMOS[promoIndex].bg} block aspect-[21/5] sm:aspect-[21/4] flex items-center`}>
              <div className="absolute inset-0">
                <div className={`absolute ${PROMOS[promoIndex].glowPos} -translate-y-1/2 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full ${PROMOS[promoIndex].glow} blur-[80px] transition-all duration-700`} />
              </div>
              <div className="relative z-10 p-6 sm:p-12 md:p-16">
                <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/30 mb-3">{PROMOS[promoIndex].label}</p>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-2">{PROMOS[promoIndex].title}</h2>
                <p className="text-xs sm:text-sm text-white/30 mb-5">{PROMOS[promoIndex].subtitle}</p>
                <span className="inline-flex items-center gap-2 text-xs text-white/50 group-hover:text-white/70 transition-colors">
                  {PROMOS[promoIndex].cta}
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>

            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex gap-2">
              {PROMOS.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); setPromoIndex(i) }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === promoIndex ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50'}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

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
