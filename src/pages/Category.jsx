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
  const { products, loading } = useData()
  const [sortBy, setSortBy] = useState('featured')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useSEO({
    title: slug === 'all' ? 'All Products' : slug,
    description: `Browse our ${slug === 'all' ? 'complete' : slug} collection`,
    path: `/category/${slug}`,
  })

  const filtered = useMemo(() => {
    let result = slug === 'all' ? products : products.filter((p) => p.category.toLowerCase() === slug)
    switch (sortBy) {
      case 'price-low': return [...result].sort((a, b) => a.price - b.price)
      case 'price-high': return [...result].sort((a, b) => b.price - a.price)
      case 'newest': return [...result].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      default: return result
    }
  }, [slug, products, sortBy])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const pageTitle = slug === 'all' ? 'All Products' : slug.charAt(0).toUpperCase() + slug.slice(1)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Reveal>
        <div className="mb-8 sm:mb-12">
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/30 mb-2">Collection</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em]">{pageTitle}</h1>
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
            <p className="text-sm text-white/30 mb-4">No products found in this category.</p>
            <Link to="/category/all" className="text-xs text-white/30 hover:text-white/50 transition-colors">
              Browse all products →
            </Link>
          </div>
        </Reveal>
      )}
    </div>
  )
}
