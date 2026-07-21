import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import ProductCard from '../components/ProductCard'
import { useSEO } from '../hooks/useSEO'
import Reveal from '../components/Reveal'
import { SkeletonCard } from '../components/Skeleton'

const PAGE_SIZE = 8

export default function Category() {
  const { slug } = useParams()
  const { products, categories, loading } = useData()
  const [sortBy, setSortBy] = useState('featured')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(slug === 'all' ? 'all' : slug)

  useSEO({
    title: activeCategory === 'all' ? 'All Products' : activeCategory,
    description: `Browse our ${activeCategory === 'all' ? 'complete' : activeCategory} collection`,
    path: `/category/${activeCategory}`,
  })

  const categoryOptions = useMemo(() => {
    const counts = {}
    products.forEach((p) => {
      const cat = p.category?.toLowerCase() || 'uncategorized'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return [{ name: 'all', label: 'All', count: products.length }, ...categories.map((c) => ({ name: c.name.toLowerCase(), label: c.name, count: counts[c.name.toLowerCase()] || 0 }))]
  }, [products, categories])

  const filtered = useMemo(() => {
    let result = activeCategory === 'all' ? products : products.filter((p) => p.category.toLowerCase() === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
    }
    switch (sortBy) {
      case 'price-low': return [...result].sort((a, b) => a.price - b.price)
      case 'price-high': return [...result].sort((a, b) => b.price - a.price)
      case 'newest': return [...result].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      default: return result
    }
  }, [activeCategory, products, sortBy, search])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Reveal>
        <div className="mb-8 sm:mb-12">
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/30 mb-2">Collection</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em]">All Products</h1>
        </div>
      </Reveal>

      <Reveal delay={40}>
        <div className="mb-6">
          <div className="relative">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE) }}
              className="w-full pl-10 pr-4 py-3 bg-[#141414] border border-white/10 text-xs text-white/50 placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
        </div>
      </Reveal>

      <Reveal delay={60}>
        <div className="mb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 sm:flex-wrap sm:overflow-visible">
            {categoryOptions.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryChange(cat.name)}
                className={`flex-shrink-0 px-4 py-2 text-[0.65rem] tracking-[0.05em] uppercase border transition-colors rounded-sm min-h-[36px] ${activeCategory === cat.name ? 'border-white/30 text-white/70 bg-white/5' : 'border-white/10 text-white/30 hover:text-white/50'}`}
              >
                {cat.label}
                <span className="ml-1.5 text-white/20">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
          <p className="text-xs text-white/30">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setVisibleCount(PAGE_SIZE) }}
              className="px-3 py-2 bg-[#141414] border border-white/10 text-xs text-white/50 focus:outline-none focus:border-white/20 transition-colors min-h-[40px]"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </Reveal>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-12 lg:gap-x-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-12 lg:gap-x-6">
            {visible.map((product, i) => (
              <Reveal key={product.id} delay={i * 60}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
          {hasMore && (
            <Reveal>
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="px-8 py-3.5 border border-white/10 text-xs tracking-[0.15em] uppercase text-white/50 hover:bg-white hover:text-black transition-all duration-500"
                >
                  Load More ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            </Reveal>
          )}
        </>
      ) : (
        <Reveal>
          <div className="text-center py-20">
            <p className="text-sm text-white/30 mb-4">No products found.</p>
            <button onClick={() => { setSearch(''); handleCategoryChange('all') }} className="text-xs text-white/30 hover:text-white/50 transition-colors">
              Clear filters
            </button>
          </div>
        </Reveal>
      )}
    </div>
  )
}
