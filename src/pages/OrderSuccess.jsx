import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Reveal from '../components/Reveal'

export default function OrderSuccess() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id')
  const paymentId = searchParams.get('payment_id')
  const paymentMethod = searchParams.get('payment_method')
  const { clearCart } = useCart()
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    if (!cleared) {
      clearCart()
      setCleared(true)
    }
  }, [clearCart, cleared])

  return (
    <Reveal>
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#141414] flex items-center justify-center mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4ade80]/50">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] mb-3">
          {paymentMethod === 'cod' ? 'Order Placed' : 'Payment Successful'}
        </h1>
        <p className="text-sm text-white/30 mb-2">Thank you for your purchase.</p>
        {orderId && (
          <p className="text-xs text-white/30 mb-2 font-mono">Order: {orderId.slice(0, 16)}...</p>
        )}
        {paymentId && (
          <p className="text-xs text-white/30 mb-2 font-mono">Payment: {paymentId.slice(0, 20)}...</p>
        )}
        <p className="text-xs text-white/30 mb-8">A confirmation has been sent to your email.</p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {orderId && (
            <Link to={`/order/${orderId}/track`} className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/10 text-xs text-white/50 tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Track Order
            </Link>
          )}
          <Link to="/category/all" className="inline-flex items-center gap-3 px-6 py-3.5 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </Reveal>
  )
}
