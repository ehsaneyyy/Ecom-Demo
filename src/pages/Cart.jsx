import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { promoApi } from '../api/api'
import Reveal from '../components/Reveal'
import { useSEO } from '../hooks/useSEO'

const GST_RATE = 0.18
const SHIPPING_COST = 500
const FREE_SHIPPING_THRESHOLD = 10000

function calcGST(subtotal) {
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const taxable = subtotal + shippingCost
  const tax = parseFloat((taxable * GST_RATE).toFixed(2))
  return { shippingCost, igst: tax, grandTotal: parseFloat((subtotal + shippingCost + tax).toFixed(2)) }
}

export default function Cart() {
  useSEO({ title: 'Shopping Bag', description: 'Review your shopping bag and proceed to checkout.', path: '/cart' })
  const { items, updateQuantity, removeItem, total, count, promoCode, promoDiscount, applyPromo, removePromo } = useCart()
  const { isLoggedIn, isAdmin } = useAuth()
  const [removingId, setRemovingId] = useState(null)
  const [promoInput, setPromoInput] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState(null)

  const discountedTotal = Math.max(0, total - promoDiscount)
  const finalGst = calcGST(discountedTotal)

  if (items.length === 0) {
    return (
      <Reveal>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <p className="text-sm text-white/30 mb-6">Your bag is empty</p>
          <Link to="/category/all" className="inline-flex items-center gap-3 px-8 py-4 border border-white/10 text-xs tracking-[0.2em] uppercase text-white/50 hover:bg-white hover:text-black transition-all duration-500">
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

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return
    setPromoLoading(true)
    setPromoError(null)
    try {
      const result = await promoApi.validate(promoInput.trim(), total)
      applyPromo(result.code, result.discount_amount)
      setPromoInput('')
    } catch (err) {
      setPromoError(err.response?.data?.detail || 'Invalid promo code')
    } finally {
      setPromoLoading(false)
    }
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
                <div className={`flex gap-4 sm:gap-6 py-6 sm:py-8 border-b border-white/10 transition-opacity duration-200 ${isRemoving ? 'opacity-0' : 'opacity-100'}`}>
                  <Link to={`/product/${item.id}`} className="w-20 h-24 sm:w-28 sm:h-32 rounded flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ background: item.color || '#141414' }}>
                    <span className="text-[0.45rem] tracking-[0.2em] uppercase text-white/25 text-center px-2 leading-relaxed">{item.name}</span>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link to={`/product/${item.id}`} className="text-sm text-white/70 hover:text-white/90 transition-colors block truncate">{item.name}</Link>
                        {item.selectedColor && <p className="text-[0.6rem] text-white/30 mt-1">{item.selectedColor}</p>}
                        {item.selectedSize && <p className="text-[0.6rem] text-white/30 mt-0.5">Size: {item.selectedSize}</p>}
                      </div>
                      <p className="text-sm text-white/50 flex-shrink-0">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-0">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                          disabled={item.quantity <= 1}
                          className="w-9 h-9 flex items-center justify-center border border-white/10 text-white/30 hover:text-white/70 hover:border-white/20 transition-colors text-lg disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-10 h-9 flex items-center justify-center text-xs text-white/50 border-y border-white/10">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                          className="w-9 h-9 flex items-center justify-center border border-white/10 text-white/30 hover:text-white/70 hover:border-white/20 transition-colors text-lg"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id, item.selectedColor, item.selectedSize)}
                        className="text-[0.6rem] text-white/30 hover:text-[#c85a3e]/60 transition-colors"
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
            <div className="bg-[#141414] p-6 sm:p-8 rounded-lg lg:sticky lg:top-24">
              <h2 className="text-sm font-medium text-white/50 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/30">Subtotal ({count} items)</span>
                  <span className="text-white/50">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/30">Shipping</span>
                  <span className="text-white/50">{finalGst.shippingCost === 0 ? 'Free' : `₹${finalGst.shippingCost.toFixed(2)}`}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#4ade80]/70">Promo ({promoCode})</span>
                    <span className="text-[#4ade80]/70">-₹{promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/30">IGST (18%)</span>
                  <span className="text-white/50">₹{finalGst.igst.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-white/70">Total</span>
                    <span className="text-base font-medium text-white/70">₹{finalGst.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                {promoCode ? (
                  <div className="flex items-center justify-between px-3 py-2 bg-[#4ade80]/5 border border-[#4ade80]/10 rounded">
                    <span className="text-xs text-[#4ade80]/70 font-mono">{promoCode}</span>
                    <button onClick={removePromo} className="text-[0.6rem] text-white/30 hover:text-[#c85a3e]/60 transition-colors">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(null) }}
                      placeholder="Promo code"
                      className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-white/10 text-xs text-white/50 placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors font-mono"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !promoInput.trim()}
                      className="px-3 py-2 border border-white/10 text-xs text-white/30 hover:text-white/50 hover:border-white/20 transition-colors disabled:opacity-50"
                    >
                      {promoLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
                {promoError && <p className="text-[0.6rem] text-red-400/70 mt-1.5">{promoError}</p>}
              </div>

              {isAdmin ? (
                <div className="text-center py-2">
                  <p className="text-[0.6rem] text-white/30 mb-3">Admin accounts cannot place orders</p>
                  <Link to="/admin" className="inline-flex items-center px-5 py-2.5 bg-white text-black text-xs tracking-[0.1em] uppercase hover:bg-white/90 transition-colors">
                    Go to Admin Panel
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {isLoggedIn ? (
                    <Link
                      to="/checkout"
                      className="block w-full py-3.5 bg-white text-black text-xs tracking-[0.15em] uppercase text-center hover:bg-white/90 transition-colors"
                    >
                      Proceed to Checkout
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="block w-full py-3.5 bg-white text-black text-xs tracking-[0.15em] uppercase text-center hover:bg-white/90 transition-colors"
                    >
                      Sign In to Checkout
                    </Link>
                  )}
                </div>
              )}
              <Link to="/category/all" className="block text-center text-xs text-white/30 hover:text-white/50 transition-colors mt-4">
                Continue Shopping
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
