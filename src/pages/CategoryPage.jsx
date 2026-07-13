import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import ProductCard from '../components/ProductCard'
import { useSEO } from '../hooks/useSEO'

export default function CategoryPage() {
  const { slug } = useParams()
  const { products } = useData()
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 10000])

  useSEO({
    title: slug === 'all' ? 'All Products' : slug,
    description: `Browse our ${slug === 'all' ? 'complete' : slug} collection`,
    path: `/category/${slug}`,
  })

  const filtered = useMemo(() => {
    let result = slug === 'all' ? products : products.filter((p) => p.category.toLowerCase() === slug)
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    switch (sortBy) {
      case 'price-low': return [...result].sort((a, b) => a.price - b.price)
      case 'price-high': return [...result].sort((a, b) => b.price - a.price)
      case 'newest': return [...result].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      default: return result
    }
  }, [slug, products, sortBy, priceRange])

  const pageTitle = slug === 'all' ? 'All Products' : slug.charAt(0).toUpperCase() + slug.slice(1)

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8 sm:mb-12">
        <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/25 mb-2">Collection</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em]">{pageTitle}</h1>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
        <p className="text-xs text-white/20">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/10 text-xs text-white/50 focus:outline-none focus:border-white/20 transition-colors min-h-[40px]"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="10000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-20 sm:w-32 accent-white/30"
              aria-label="Max price"
            />
            <span className="text-[0.6rem] text-white/20">Up to ${priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-12 lg:gap-x-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-sm text-white/20 mb-4">No products found in this category.</p>
          <Link to="/category/all" className="text-xs text-white/30 hover:text-white/50 transition-colors">
            Browse all products →
          </Link>
        </div>
      )}
    </div>
  )
}
