import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { orderApi } from '../api/api'
import StatusTimeline from '../components/StatusTimeline'
import Reveal from '../components/Reveal'

export default function OrderTracking() {
  const { id } = useParams()
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    setOrder(null)
    try {
      const data = await orderApi.track(id, email.trim())
      setOrder(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Order not found. Please check your order ID and email.')
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Reveal>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mb-3">Track Your Order</h1>
        <p className="text-sm text-white/30 mb-10">Enter your email to see the status of your order.</p>
      </Reveal>

      <Reveal delay={40}>
        <form onSubmit={handleTrack} className="bg-[#141414] rounded-lg border border-white/10 p-6 space-y-4">
          <div>
            <label className="block text-[0.6rem] text-white/30 mb-1.5">Order ID</label>
            <input
              type="text"
              value={id}
              disabled
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 text-sm text-white/50 font-mono cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-[0.6rem] text-white/30 mb-1.5">Email used for the order</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 text-sm text-white/50 placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
          {error && <p className="text-xs text-red-400/70">{error}</p>}
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-3.5 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors min-h-[48px] disabled:opacity-50"
          >
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </form>
      </Reveal>

      {order && (
        <Reveal delay={60}>
          <div className="mt-8 bg-[#141414] rounded-lg border border-white/10 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[0.6rem] text-white/30 mb-1">Order</p>
                <p className="text-sm text-white/50 font-mono">{order.id.slice(0, 12).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-[0.6rem] text-white/30 mb-1">Placed on</p>
                <p className="text-sm text-white/50">{order.created_at}</p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <StatusTimeline status={order.status} />
            </div>

            <div className="border-t border-white/10 pt-6">
              <p className="text-[0.6rem] text-white/30 mb-3">Items</p>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs py-2 border-b border-white/10 last:border-0">
                    <span className="text-white/30">{item.product_name} × {item.quantity}</span>
                    <span className="text-white/30">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 pt-3 border-t border-white/10">
                <span className="text-sm text-white/50">Total</span>
                <span className="text-sm text-white/50 font-medium">₹{order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <p className="text-[0.6rem] text-white/30 mb-1">Shipping To</p>
              <p className="text-xs text-white/50">{order.shipping_address}</p>
            </div>
          </div>
        </Reveal>
      )}

      {searched && !order && !error && (
        <Reveal delay={60}>
          <div className="mt-8 text-center py-12">
            <p className="text-sm text-white/30">No order found with that email.</p>
          </div>
        </Reveal>
      )}
    </div>
  )
}
