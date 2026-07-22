import { useState, useMemo, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import ProductCard from '../components/ProductCard'
import { useSEO } from '../hooks/useSEO'
import Reveal from '../components/Reveal'
import { SkeletonCard } from '../components/Skeleton'

const PAGE_SIZE = 8

const COLOR_HEX_MAP = {
  '#1a1510': 'Charcoal', '#0a0a0a': 'Black', '#2d2d2d': 'Gray',
  '#f5f0e8': 'Cream', '#e8ddd0': 'Sand', '#1a1a2e': 'Navy',
  '#2d1b10': 'Espresso', '#f0e6d8': 'Ivory', '#101518': 'Slate',
  '#e2d5c0': 'Linen', '#1a1008': 'Umber', '#f8f4f0': 'Pearl',
  '#c8a97e': 'Gold', '#c85a3e': 'Terracotta', '#e6d5c3': 'Natural',
  '#3a2e28': 'Mocha', '#d4c4b0': 'Taupe', '#2c2c2c': 'Onyx',
  '#f5f5f5': 'White', '#d4a574': 'Caramel', '#8b7355': 'Walnut',
}

function getColorName(hex) {
  return COLOR_HEX_MAP[hex] || hex
}

export default function Category() {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, categories, loading } = useData()
  const [sortBy, setSortBy] = useState('featured')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(slug === 'all' ? 'all' : slug)

  const priceMin = searchParams.get('min_price') || ''
  const priceMax = searchParams.get('max_price') || ''
  const colorFilter = searchParams.get('color') || ''
  const sizeFilter = searchParams.get('size') || ''

  const [priceMinInput, setPriceMinInput] = useState(priceMin)
  const [priceMaxInput, setPriceMaxInput] = useState(priceMax)

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

  const availableColors = useMemo(() => {
    const colorSet = new Set()
    products.forEach((p) => {
      if (p.colors) {
        p.colors.forEach((c) => colorSet.add(c))
      }
    })
    return Array.from(colorSet)
  }, [products])

  const availableSizes = useMemo(() => {
    const sizeSet = new Set()
    products.forEach((p) => {
      if (p.sizes) {
        p.sizes.forEach((s) => sizeSet.add(s))
      }
    })
    return Array.from(sizeSet)
  }, [products])

  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 100000 }
    const prices = products.map((p) => p.price)
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) }
  }, [products])

  const updateParam = useCallback((key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      return next
    })
    setVisibleCount(PAGE_SIZE)
  }, [setSearchParams])

  const handlePriceFilter = () => {
    updateParam('min_price', priceMinInput)
    updateParam('max_price', priceMaxInput)
  }

  const clearAllFilters = () => {
    setSearch('')
    setPriceMinInput('')
    setPriceMaxInput('')
    updateParam('color', '')
    updateParam('size', '')
    updateParam('min_price', '')
    updateParam('max_price', '')
    setActiveCategory('all')
  }

  const hasActiveFilters = colorFilter || sizeFilter || priceMin || priceMax

  const filtered = useMemo(() => {
    let result = activeCategory === 'all' ? products : products.filter((p) => p.category.toLowerCase() === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
    }
    if (priceMin) result = result.filter((p) => p.price >= parseFloat(priceMin))
    if (priceMax) result = result.filter((p) => p.price <= parseFloat(priceMax))
    if (colorFilter) {
      const cf = colorFilter.toLowerCase()
      result = result.filter((p) => p.colors && p.colors.some((c) => c.toLowerCase() === cf))
    }
    if (sizeFilter) {
      const sf = sizeFilter.toLowerCase()
      result = result.filter((p) => p.sizes && p.sizes.some((s) => s.toLowerCase() === sf))
    }
    switch (sortBy) {
      case 'price-low': return [...result].sort((a, b) => a.price - b.price)
      case 'price-high': return [...result].sort((a, b) => b.price - a.price)
      case 'newest': return [...result].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      default: return result
    }
  }, [activeCategory, products, sortBy, search, priceMin, priceMax, colorFilter, sizeFilter])

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

      <Reveal delay={50}>
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

      <Reveal delay={60}>
        <details className="mb-6 group">
          <summary className="flex items-center gap-2 cursor-pointer text-xs text-white/30 hover:text-white/50 transition-colors select-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-open:rotate-90">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="px-1.5 py-0.5 bg-white/10 rounded text-[0.55rem]">
                {[colorFilter, sizeFilter, priceMin, priceMax].filter(Boolean).length}
              </span>
            )}
          </summary>
          <div className="mt-4 p-4 bg-[#141414] rounded-lg border border-white/10 space-y-5">
            <div>
              <p className="text-[0.6rem] text-white/30 mb-3">Price Range</p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMinInput}
                  onChange={(e) => setPriceMinInput(e.target.value)}
                  className="w-24 px-3 py-2 bg-[#0a0a0a] border border-white/10 text-xs text-white/50 focus:outline-none focus:border-white/20 transition-colors"
                />
                <span className="text-white/20 text-xs">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMaxInput}
                  onChange={(e) => setPriceMaxInput(e.target.value)}
                  className="w-24 px-3 py-2 bg-[#0a0a0a] border border-white/10 text-xs text-white/50 focus:outline-none focus:border-white/20 transition-colors"
                />
                <button
                  onClick={handlePriceFilter}
                  className="px-3 py-2 bg-white/10 text-xs text-white/50 hover:bg-white/15 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {availableColors.length > 0 && (
              <div>
                <p className="text-[0.6rem] text-white/30 mb-3">Color{colorFilter ? `: ${getColorName(colorFilter)}` : ''}</p>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateParam('color', colorFilter === c ? '' : c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${colorFilter === c ? 'border-white scale-110' : 'border-white/10 hover:border-white/20'}`}
                      style={{ backgroundColor: c }}
                      title={getColorName(c)}
                    />
                  ))}
                </div>
              </div>
            )}

            {availableSizes.length > 0 && (
              <div>
                <p className="text-[0.6rem] text-white/30 mb-3">Size{sizeFilter ? `: ${sizeFilter}` : ''}</p>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateParam('size', sizeFilter === s ? '' : s)}
                      className={`min-w-[44px] h-9 px-3 border text-xs transition-colors ${sizeFilter === s ? 'border-white/30 text-white/70 bg-white/5' : 'border-white/10 text-white/30 hover:border-white/20'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[0.6rem] text-white/30 hover:text-[#c85a3e]/60 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </details>
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
            <button onClick={clearAllFilters} className="text-xs text-white/30 hover:text-white/50 transition-colors">
              Clear filters
            </button>
          </div>
        </Reveal>
      )}
    </div>
  )
}
