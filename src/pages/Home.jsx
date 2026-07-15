import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import { SkeletonCard } from '../components/Skeleton'
import { useSEO } from '../hooks/useSEO'
import { emailRegex } from '../utils/validate'

const CATEGORIES = [
  { id: 1, name: 'Living', count: 7, color: '#1a1510' },
  { id: 2, name: 'Bedroom', count: 3, color: '#101518' },
  { id: 3, name: 'Kitchen', count: 4, color: '#181a14' },
  { id: 4, name: 'Office', count: 3, color: '#1a1418' },
]

export default function Home() {
  useSEO({ title: undefined, description: undefined, path: '/' })
  const { products, loading } = useData()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [emailError, setEmailError] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setEmailError('Email is required')
      return
    }
    if (!emailRegex.test(email)) {
      setEmailError('Enter a valid email')
      return
    }
    setEmailError('')
    setSubscribed(true)
  }

  return (
    <>
      <section className="relative min-h-[85vh] sm:h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1510] via-[#0a0a0a] to-[#101218]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-white/[0.02] blur-[80px] sm:blur-[100px]" />
          <div className="relative z-10 text-center max-w-4xl px-4 sm:px-6">
            <Reveal delay={0}>
              <p className="text-[0.6rem] sm:text-xs tracking-[0.4em] uppercase text-theme-text-faint mb-4 sm:mb-6">Summer 2026</p>
            </Reveal>
            <Reveal delay={200}>
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[-0.04em] leading-[0.9] mb-6 sm:mb-8">
                <span className="block text-white/90">Designed</span>
                <span className="block text-theme-text-faint">to last</span>
              </h1>
            </Reveal>
            <Reveal delay={400}>
              <p className="text-xs sm:text-sm text-theme-text-faint max-w-md mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
                Curated objects for considered living. Every piece crafted with intention,
                built to endure, designed to inspire.
              </p>
            </Reveal>
            <Reveal delay={600}>
              <Link
                to="/#products"
                className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 border border-theme-border text-xs tracking-[0.2em] uppercase text-theme-text-muted hover:bg-white hover:text-black transition-all duration-500"
              >
                Shop Now
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </Reveal>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      <section id="products" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-10 sm:mb-16">
              <div>
                <p className="text-[0.6rem] tracking-[0.3em] uppercase text-theme-text-faint mb-3">Collection</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em]">Featured</h2>
              </div>
              <Link to="/category/all" className="text-xs text-theme-text-faint hover:text-theme-text-muted transition-colors">
                View all →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-12 lg:gap-x-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              products.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-10 sm:mb-16">
              <p className="text-[0.6rem] tracking-[0.3em] uppercase text-theme-text-faint mb-3">Browse by</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em]">Categories</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {CATEGORIES.map((cat, i) => (
              <Reveal key={cat.id} delay={i * 100}>
                <Link
                  to={`/category/${cat.name.toLowerCase()}`}
                  className="group relative aspect-[4/5] overflow-hidden block"
                  style={{ background: cat.color }}
                >
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-theme-text-secondary mb-1">{cat.name}</h3>
                    <p className="text-[0.6rem] sm:text-xs text-theme-text-faint">{cat.count} products</p>
                  </div>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-500" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal direction="left">
            <div className="relative overflow-hidden bg-[#141210] aspect-[16/9] sm:aspect-[21/9] flex items-center">
              <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full bg-[#c85a3e]/10 blur-[60px] sm:blur-[100px]" />
                <div className="absolute top-1/3 right-1/4 w-[150px] sm:w-[300px] h-[150px] sm:h-[300px] rounded-full bg-[#00d4ff]/5 blur-[40px] sm:blur-[80px]" />
              </div>
              <div className="relative z-10 p-6 sm:p-12 md:p-20 max-w-2xl">
                <p className="text-[0.6rem] tracking-[0.3em] uppercase text-theme-text-faint mb-4">Limited Edition</p>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-4">The Artisan<br />Collection</h2>
                <p className="text-xs sm:text-sm text-theme-text-faint mb-6 sm:mb-8 max-w-sm leading-relaxed">
                  Hand-selected pieces from independent makers around the world.
                </p>
                <Link to="/category/all" className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors">
                  Explore
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Reveal>
            <p className="text-[0.6rem] tracking-[0.3em] uppercase text-theme-text-faint mb-4">Stay Updated</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-0.03em] mb-4">Join the list</h2>
            <p className="text-xs sm:text-sm text-theme-text-faint mb-6 sm:mb-8 max-w-md mx-auto">
              First access to new arrivals, exclusive offers, and stories from our makers.
            </p>
            {subscribed ? (
              <p className="text-sm text-theme-text-muted">Thanks for subscribing! Check your inbox.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-center max-w-md mx-auto gap-0">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                    placeholder="your@email.com"
                    aria-label="Email address"
                    className="w-full px-5 py-3.5 sm:py-4 bg-theme-surface border border-theme-border text-sm text-theme-text-secondary placeholder-theme-text-faint focus:outline-none focus:border-theme-border-hover transition-colors"
                  />
                  {emailError && <p className="text-xs text-[#c85a3e] mt-1 text-left pl-1" role="alert">{emailError}</p>}
                </div>
                <button type="submit" className="px-6 py-3.5 sm:py-4 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors whitespace-nowrap sm:border-l-0">
                  Subscribe
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}
