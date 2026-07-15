import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { statusColors } from '../constants/orderStatuses'
import Reveal from '../components/Reveal'

export default function OrderHistory() {
  const { orders } = useData()
  const { currentUser } = useAuth()
  const [expandedOrder, setExpandedOrder] = useState(null)

  if (!currentUser) {
    return (
      <Reveal>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <p className="text-sm text-theme-text-faint mb-6">Sign in to view your orders</p>
          <Link to="/login" className="inline-flex items-center gap-3 px-8 py-4 border border-theme-border text-xs tracking-[0.2em] uppercase text-theme-text-muted hover:bg-white hover:text-black transition-all duration-500">
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
            <p className="text-sm text-theme-text-faint mb-6">No orders yet</p>
            <Link to="/category/all" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors">
              Start Shopping
            </Link>
          </div>
        </Reveal>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const isExpanded = expandedOrder === order.id
            return (
              <Reveal key={order.id} delay={i * 60}>
                <div className="bg-theme-surface rounded-lg border border-theme-border overflow-hidden">
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 cursor-pointer"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs text-theme-text-muted font-mono">{order.id.slice(0, 8)}...</p>
                          <span className={`inline-flex px-2 py-0.5 rounded text-[0.6rem] font-medium ${statusColors[order.status] || 'text-theme-text-faint bg-theme-surface'}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[0.6rem] text-theme-text-faint mt-0.5">{order.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 pl-0 sm:pl-0">
                      <p className="text-sm text-theme-text-muted font-medium">${order.total.toFixed(2)}</p>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-theme-text-faint transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-theme-border p-4 sm:p-6 space-y-4">
                      <div>
                        <p className="text-[0.6rem] text-theme-text-faint mb-1">Shipping Address</p>
                        <p className="text-xs text-theme-text-muted">{order.shippingAddress}</p>
                      </div>
                      <div>
                        <p className="text-[0.6rem] text-theme-text-faint mb-2">Items</p>
                        <div className="space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-xs py-2 border-b border-theme-border last:border-0">
                              <span className="text-theme-text-faint">{item.productName} × {item.quantity}</span>
                              <span className="text-theme-text-faint">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
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
