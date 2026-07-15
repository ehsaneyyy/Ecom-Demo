import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Reveal from '../components/Reveal'

export default function OrderSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-[-0.03em] mb-3">Payment Successful</h1>
        <p className="text-sm text-white/30 mb-2">Thank you for your purchase.</p>
        {sessionId && (
          <p className="text-xs text-white/30 mb-8 font-mono">Session: {sessionId.slice(0, 20)}...</p>
        )}
        <p className="text-xs text-white/30 mb-8">A confirmation has been sent to your email.</p>
        <Link to="/category/all" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </Reveal>
  )
}
