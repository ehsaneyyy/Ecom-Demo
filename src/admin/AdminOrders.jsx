import { useState } from 'react'
import { useData } from '../context/DataContext'

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useData()
  const [filter, setFilter] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const statusColors = {
    pending: 'text-[#c8a97e] bg-[#c8a97e]/10',
    processing: 'text-[#60a5fa] bg-[#60a5fa]/10',
    shipped: 'text-[#a78bfa] bg-[#a78bfa]/10',
    delivered: 'text-[#4ade80] bg-[#4ade80]/10',
    cancelled: 'text-red-400 bg-red-400/10',
  }

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
    showToast(`Order ${orderId} updated to ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 bg-[#1a1a1a] border border-white/10 text-xs text-white/60 rounded-lg shadow-xl animate-slide-down">
          {toast}
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em]">Orders</h1>

      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-2 text-[0.6rem] tracking-[0.1em] uppercase rounded border transition-colors min-h-[36px] ${filter === s ? 'border-white/20 text-white/60 bg-white/5' : 'border-white/5 text-white/20 hover:text-white/40 hover:border-white/10'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((order) => (
          <div key={order.id} className="bg-[#141414] rounded-lg border border-white/5 overflow-hidden">
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 cursor-pointer"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[0.6rem] text-white/30 flex-shrink-0">
                  {order.customer.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs text-white/60 font-mono">{order.id}</p>
                    <span className={`inline-flex px-2 py-0.5 rounded text-[0.6rem] font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[0.6rem] text-white/25 mt-0.5 truncate">{order.customer.name} • {new Date(order.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 pl-14 sm:pl-0">
                <p className="text-sm text-white/50 font-medium">${order.total.toFixed(2)}</p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-white/20 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {expandedOrder === order.id && (
              <div className="border-t border-white/5 p-4 sm:p-6 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[0.6rem] text-white/25 mb-1">Customer</p>
                    <p className="text-xs text-white/50">{order.customer.name}</p>
                    <p className="text-xs text-white/30">{order.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-[0.6rem] text-white/25 mb-1">Shipping</p>
                    <p className="text-xs text-white/50">{order.shippingAddress || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[0.6rem] text-white/25 mb-1">Payment</p>
                    <p className="text-xs text-white/50">{order.paymentMethod || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[0.6rem] text-white/25 mb-2">Update Status</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(order.id, s)}
                          className={`px-2.5 py-1.5 text-[0.55rem] rounded border transition-colors min-h-[32px] ${order.status === s ? 'border-white/20 text-white/60 bg-white/5' : 'border-white/5 text-white/20 hover:text-white/40'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[0.6rem] text-white/25 mb-2">Items</p>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-white/40">{item.name} × {item.quantity}</span>
                        <span className="text-white/30">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-xs text-white/20 py-12">No orders match this filter.</p>
        )}
      </div>
    </div>
  )
}
