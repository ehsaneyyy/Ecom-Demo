import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Reveal from '../components/Reveal'

export default function Cart() {
  const { items, updateQuantity, removeItem, total, count } = useCart()
  const [removingId, setRemovingId] = useState(null)

  if (items.length === 0) {
    return (
      <Reveal>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <p className="text-sm text-theme-text-faint mb-6">Your bag is empty</p>
          <Link to="/category/all" className="inline-flex items-center gap-3 px-8 py-4 border border-theme-border text-xs tracking-[0.2em] uppercase text-theme-text-muted hover:bg-white hover:text-black transition-all duration-500">
            Browse the collection
          </Link>
        </div>
      </Reveal>
    )
  }

  const handleRemove = (itemId, selectedColor, selectedSize) => {
    setRemovingId(`${itemId}-${selectedColor || ''}-${selectedSize || ''}`)
    setTimeout(() => {
      removeItem(itemId, selectedColor, selectedSize)
      setRemovingId(null)
    }, 200)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Reveal>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mb-10 sm:mb-16">Shopping Bag</h1>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
        <div className="lg:col-span-2 space-y-0">
          {items.map((item, i) => {
            const itemKey = `${item.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`
            const isRemoving = removingId === itemKey
            return (
              <Reveal key={itemKey} delay={i * 60}>
                <div className={`flex gap-4 sm:gap-6 py-6 sm:py-8 border-b border-theme-border transition-opacity duration-200 ${isRemoving ? 'opacity-0' : 'opacity-100'}`}>
                  <Link to={`/product/${item.id}`} className="w-20 h-24 sm:w-28 sm:h-32 rounded flex-shrink-0 flex items-center justify-center text-theme-text-faint hover:text-theme-text-faint transition-colors" style={{ background: item.color }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link to={`/product/${item.id}`} className="text-sm text-theme-text-secondary hover:text-white/90 transition-colors block truncate">{item.name}</Link>
                        {item.selectedColor && <p className="text-[0.6rem] text-theme-text-faint mt-1">{item.selectedColor}</p>}
                        {item.selectedSize && <p className="text-[0.6rem] text-theme-text-faint mt-0.5">Size: {item.selectedSize}</p>}
                      </div>
                      <p className="text-sm text-theme-text-muted flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-0">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                          className="w-9 h-9 flex items-center justify-center border border-theme-border text-theme-text-faint hover:text-theme-text-secondary hover:border-theme-border-hover transition-colors text-lg"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-10 h-9 flex items-center justify-center text-xs text-theme-text-muted border-y border-theme-border">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                          className="w-9 h-9 flex items-center justify-center border border-theme-border text-theme-text-faint hover:text-theme-text-secondary hover:border-theme-border-hover transition-colors text-lg"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id, item.selectedColor, item.selectedSize)}
                        className="text-[0.6rem] text-theme-text-faint hover:text-[#c85a3e]/60 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal direction="right">
          <div className="lg:col-span-1">
            <div className="bg-theme-surface p-6 sm:p-8 rounded-lg lg:sticky lg:top-24">
              <h2 className="text-sm font-medium text-theme-text-muted mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-theme-text-faint">Subtotal ({count} items)</span>
                  <span className="text-theme-text-muted">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-theme-text-faint">Shipping</span>
                  <span className="text-theme-text-muted">{total >= 200 ? 'Free' : '$15.00'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-theme-text-faint">Tax (8%)</span>
                  <span className="text-theme-text-muted">${(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-theme-border pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-theme-text-secondary">Total</span>
                    <span className="text-base font-medium text-theme-text-secondary">${(total + (total >= 200 ? 0 : 15) + total * 0.08).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link
                to="/checkout"
                className="block w-full py-3.5 bg-white text-black text-xs tracking-[0.15em] uppercase text-center hover:bg-white/90 transition-colors"
              >
                Proceed to Checkout
              </Link>
              <Link to="/category/all" className="block text-center text-xs text-theme-text-faint hover:text-theme-text-faint transition-colors mt-4">
                Continue Shopping
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
