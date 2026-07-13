import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlist()

  if (items.length === 0) {
    return (
      <div className="animate-fade-in min-h-[60vh] flex flex-col items-center justify-center px-4">
        <p className="text-sm text-white/20 mb-6">Your wishlist is empty</p>
        <Link to="/category/all" className="inline-flex items-center gap-3 px-8 py-4 border border-white/15 text-xs tracking-[0.2em] uppercase text-white/60 hover:bg-white hover:text-black transition-all duration-500">
          Browse the collection
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-10 sm:mb-16">
        <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/25 mb-2">Saved</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em]">Wishlist</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-12 lg:gap-x-6">
        {items.map((product) => (
          <div key={product.id} className="group">
            <Link to={`/product/${product.id}`} className="block">
              <div className="aspect-[4/5] bg-[#141414] rounded-sm mb-3 sm:mb-4 flex items-center justify-center overflow-hidden">
                {product.images && product.images[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/5">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                )}
              </div>
              <h3 className="text-sm text-white/70 mb-1 group-hover:text-white/90 transition-colors truncate">{product.name}</h3>
              <p className="text-sm text-white/30">${product.price}</p>
            </Link>
            <button
              onClick={() => toggleWishlist(product)}
              className="mt-2 text-[0.6rem] text-red-400/40 hover:text-red-400/70 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
