import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function loadWishlist() {
  try {
    return JSON.parse(localStorage.getItem('ecom-demo-wishlist') || '[]')
  } catch { return [] }
}

export default function ProductCard({ product }) {
  const hasImage = product.images && product.images.length > 0
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState(() => loadWishlist())
  const isWishlisted = wishlist.some((id) => id === product.id)

  useEffect(() => {
    localStorage.setItem('ecom-demo-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const toggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    setWishlist((prev) =>
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    )
  }

  return (
    <Link to={`/product/${product.id}`} className="group cursor-pointer">
      <div className="relative aspect-[3/4] mb-4 overflow-hidden group-hover:scale-[1.02] transition-transform duration-500" style={{ background: hasImage ? 'transparent' : product.color }}>
        {hasImage ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6">
              <span className="text-[0.55rem] tracking-[0.35em] uppercase text-white/40 text-center leading-relaxed">{product.name}</span>
              <div className="w-8 h-px bg-white/10" />
              <span className="text-[0.5rem] tracking-[0.2em] uppercase text-white/20">{product.category}</span>
            </div>
          </>
        )}
        {product.tag && (
          <span className="absolute top-3 left-3 text-[0.55rem] tracking-[0.15em] uppercase px-2.5 py-1 bg-[#141414] backdrop-blur-sm text-white/50 z-10">
            {product.tag}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 text-[0.55rem] tracking-[0.15em] uppercase px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white/30 z-10">
            Sold Out
          </span>
        )}
        {product.rating && product.stock > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-sm rounded text-[0.55rem] text-white/50 z-10">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M5 0l1.5 3.1L10 3.6 7.5 6l.6 3.5L5 7.7 1.9 9.5l.6-3.5L0 3.6l3.5-.5z" />
            </svg>
            {product.rating}
          </div>
        )}
        <button
          onClick={toggleWishlist}
          className={`absolute z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 ${isWishlisted ? 'text-red-400 opacity-100' : 'text-white/60 hover:text-white/90'}`}
          style={{ top: product.tag ? '2.75rem' : '0.75rem', left: '0.75rem' }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <div className="w-full py-3 bg-white text-black text-xs tracking-[0.15em] uppercase text-center">View</div>
        </div>
      </div>
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1 mr-3">
          <h3 className="text-sm text-white/70 mb-1 truncate group-hover:text-white/90 transition-colors">{product.name}</h3>
          <p className="text-xs text-white/30">{product.category}</p>
        </div>
        <div className="text-right flex-shrink-0">
          {product.compareAtPrice && (
            <span className="text-xs text-white/30 line-through block">₹{product.compareAtPrice}</span>
          )}
          <span className={`text-sm ${product.tag === 'Sale' ? 'text-[#c85a3e]' : 'text-white/50'}`}>
            ₹{product.price}
          </span>
        </div>
      </div>
    </Link>
  )
}
