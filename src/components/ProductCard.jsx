import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="group cursor-pointer">
      <div className="relative aspect-[3/4] mb-4 overflow-hidden" style={{ background: product.color }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-white/[0.06]">{product.id}</span>
        </div>
        {product.tag && (
          <span className="absolute top-3 left-3 text-[0.55rem] tracking-[0.15em] uppercase px-2.5 py-1 bg-white/10 backdrop-blur-sm text-white/60">
            {product.tag}
          </span>
        )}
        {product.rating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/40 backdrop-blur-sm rounded text-[0.55rem] text-white/60">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M5 0l1.5 3.1L10 3.6 7.5 6l.6 3.5L5 7.7 1.9 9.5l.6-3.5L0 3.6l3.5-.5z" />
            </svg>
            {product.rating}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <div className="w-full py-3 bg-white text-black text-xs tracking-[0.15em] uppercase text-center">View</div>
        </div>
      </div>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm text-white/70 mb-1">{product.name}</h3>
          <p className="text-xs text-white/30">{product.category}</p>
        </div>
        <div className="text-right">
          {product.originalPrice && (
            <span className="text-xs text-white/25 line-through block">${product.originalPrice}</span>
          )}
          <span className={`text-sm ${product.tag === 'Sale' ? 'text-[#c85a3e]' : 'text-white/50'}`}>
            ${product.price}
          </span>
        </div>
      </div>
    </Link>
  )
}
