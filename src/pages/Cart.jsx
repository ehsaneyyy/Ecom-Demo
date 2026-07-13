import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, updateQuantity, removeItem, total, count } = useCart()

  if (items.length === 0) {
    return (
      <div className="animate-fade-in min-h-[60vh] flex flex-col items-center justify-center px-4">
        <p className="text-sm text-white/20 mb-6">Your bag is empty</p>
        <Link to="/category/all" className="inline-flex items-center gap-3 px-8 py-4 border border-white/15 text-xs tracking-[0.2em] uppercase text-white/60 hover:bg-white hover:text-black transition-all duration-500">
          Browse the collection
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mb-10 sm:mb-16">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
        <div className="lg:col-span-2 space-y-0">
          {items.map((item) => (
            <div key={`${item.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`} className="flex gap-4 sm:gap-6 py-6 sm:py-8 border-b border-white/5">
              <Link to={`/product/${item.id}`} className="w-20 h-24 sm:w-28 sm:h-32 bg-[#141414] rounded flex-shrink-0 flex items-center justify-center text-white/10 hover:text-white/20 transition-colors">
                {item.images && item.images[0] ? (
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link to={`/product/${item.id}`} className="text-sm text-white/70 hover:text-white/90 transition-colors block truncate">{item.name}</Link>
                    {item.selectedColor && <p className="text-[0.6rem] text-white/25 mt-1">{item.selectedColor}</p>}
                    {item.selectedSize && <p className="text-[0.6rem] text-white/25 mt-0.5">Size: {item.selectedSize}</p>}
                  </div>
                  <p className="text-sm text-white/50 flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                      className="w-9 h-9 flex items-center justify-center border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-colors text-lg"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-10 h-9 flex items-center justify-center text-xs text-white/50 border-y border-white/10">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                      className="w-9 h-9 flex items-center justify-center border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-colors text-lg"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id, item.selectedColor, item.selectedSize)}
                    className="text-[0.6rem] text-white/20 hover:text-white/50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#141414] p-6 sm:p-8 rounded-lg lg:sticky lg:top-24">
            <h2 className="text-sm font-medium text-white/50 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-white/30">Subtotal ({count} items)</span>
                <span className="text-white/50">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/30">Shipping</span>
                <span className="text-white/50">{total >= 200 ? 'Free' : '$15.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/30">Tax (8%)</span>
                <span className="text-white/50">${(total * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-white/5 pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Total</span>
                  <span className="text-base font-medium text-white/80">${(total + (total >= 200 ? 0 : 15) + total * 0.08).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full py-3.5 bg-white text-black text-xs tracking-[0.15em] uppercase text-center hover:bg-white/90 transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link to="/category/all" className="block text-center text-xs text-white/20 hover:text-white/40 transition-colors mt-4">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
