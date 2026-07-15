import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import Reveal from '../components/Reveal'

export default function Wishlist() {
  const { items, toggleWishlist } = useWishlist()

  if (items.length === 0) {
    return (
      <Reveal>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <p className="text-sm text-white/30 mb-6">Your wishlist is empty</p>
          <Link to="/category/all" className="inline-flex items-center gap-3 px-8 py-4 border border-white/10 text-xs tracking-[0.2em] uppercase text-white/50 hover:bg-white hover:text-black transition-all duration-500">
            Browse the collection
          </Link>
        </div>
      </Reveal>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Reveal>
        <div className="mb-10 sm:mb-16">
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-white/30 mb-2">Saved</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em]">Wishlist</h1>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-12 lg:gap-x-6">
        {items.map((product, i) => (
          <Reveal key={product.id} delay={i * 60}>
            <div className="group">
              <Link to={`/product/${product.id}`} className="block">
                <div className="aspect-[4/5] rounded-sm mb-3 sm:mb-4 flex items-center justify-center overflow-hidden group-hover:scale-[1.02] transition-transform duration-500" style={{ background: product.color }}>
                  <span className="text-[0.5rem] tracking-[0.2em] uppercase text-white/30 text-center px-2">{product.name}</span>
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
          </Reveal>
        ))}
      </div>
    </div>
  )
}
