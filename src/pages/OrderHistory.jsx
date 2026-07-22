import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { orderApi } from '../api/api'
import { statusColors } from '../constants/orderStatuses'
import StatusTimeline from '../components/StatusTimeline'
import Reveal from '../components/Reveal'
import InvoiceButton from '../components/InvoiceButton'

export default function OrderHistory() {
  const { orders } = useData()
  const { currentUser } = useAuth()
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [cancelling, setCancelling] = useState(null)

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return
    setCancelling(orderId)
    try {
      await orderApi.cancel(orderId)
      window.location.reload()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to cancel order')
    } finally {
      setCancelling(null)
    }
  }

  if (!currentUser) {
    return (
      <Reveal>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <p className="text-sm text-white/30 mb-6">Sign in to view your orders</p>
          <Link to="/login" className="inline-flex items-center gap-3 px-8 py-4 border border-white/10 text-xs tracking-[0.2em] uppercase text-white/50 hover:bg-white hover:text-black transition-all duration-500">
            Sign In
          </Link>
        </div>
      </Reveal>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Reveal>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mb-10 sm:mb-16">Your Orders</h1>
      </Reveal>

      {orders.length === 0 ? (
        <Reveal>
          <div className="text-center py-16">
            <p className="text-sm text-white/30 mb-6">No orders yet</p>
            <Link to="/category/all" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors">
              Start Shopping
            </Link>
          </div>
        </Reveal>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const isExpanded = expandedOrder === order.id
            const canCancel = order.status === 'pending' || order.status === 'processing'
            return (
              <Reveal key={order.id} delay={i * 60}>
                <div className="bg-[#141414] rounded-lg border border-white/10 overflow-hidden">
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 cursor-pointer"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs text-white/50 font-mono">{order.id.slice(0, 8)}...</p>
                          <span className={`inline-flex px-2 py-0.5 rounded text-[0.6rem] font-medium ${statusColors[order.status] || 'text-white/30 bg-[#141414]'}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[0.6rem] text-white/30 mt-0.5">{order.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 pl-0 sm:pl-0">
                      <p className="text-sm text-white/50 font-medium">₹{order.total.toFixed(2)}</p>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-white/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-white/10 p-4 sm:p-6 space-y-4">
                      <div>
                        <StatusTimeline status={order.status} />
                      </div>
                      <div>
                        <p className="text-[0.6rem] text-white/30 mb-1">Shipping Address</p>
                        <p className="text-xs text-white/50">{order.shippingAddress}</p>
                      </div>
                      <div>
                        <p className="text-[0.6rem] text-white/30 mb-2">Items</p>
                        <div className="space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-xs py-2 border-b border-white/10 last:border-0">
                              <span className="text-white/30">{item.productName} × {item.quantity}</span>
                              <span className="text-white/30">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-4 border-t border-white/10 flex-wrap">
                        <InvoiceButton order={order} variant="customer" />
                        <Link
                          to={`/order/${order.id}/track`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 text-xs text-white/30 hover:text-white/50 hover:border-white/20 transition-colors min-h-[40px]"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                          Track
                        </Link>
                        {canCancel && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            disabled={cancelling === order.id}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/20 text-xs text-red-400/70 hover:text-red-400 hover:border-red-500/40 transition-colors min-h-[40px] disabled:opacity-50"
                          >
                            {cancelling === order.id ? 'Cancelling...' : 'Cancel Order'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      )}
    </div>
  )
}
