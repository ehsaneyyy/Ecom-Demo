import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useToast } from '../components/Toast'
import { statusColors } from '../constants/orderStatuses'
import InvoiceButton from '../components/InvoiceButton'

const statusMessages = {
  processing: (name, id) => `Hi ${name}! Your order #${id.slice(0, 8)} is being processed. We'll update you when it ships.`,
  shipped: (name, id) => `Hi ${name}! Great news — your order #${id.slice(0, 8)} has been shipped! Expected delivery in 3-5 days.`,
  delivered: (name, id) => `Hi ${name}! Your order #${id.slice(0, 8)} has been delivered. Hope you love it!`,
  cancelled: (name, id) => `Hi ${name}! Your order #${id.slice(0, 8)} has been cancelled. Contact us if you need help.`,
  pending: (name, id) => `Hi ${name}! Your order #${id.slice(0, 8)} is confirmed and pending. We'll process it shortly.`,
}

function getWhatsAppUrl(phone, name, orderId, status) {
  if (!phone) return null
  const clean = phone.replace(/\D/g, '')
  const num = clean.startsWith('91') ? clean : `91${clean}`
  const msg = (statusMessages[status] || statusMessages.pending)(name || 'there', orderId)
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`
}

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useData()
  const { show } = useToast()
  const [filter, setFilter] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState(null)

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
    show(`Order ${orderId.slice(0, 8)}... updated to ${newStatus}`)
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em]">Orders</h1>

      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-2 text-[0.6rem] tracking-[0.1em] uppercase rounded border transition-colors min-h-[36px] ${filter === s ? 'border-white/20 text-white/50 bg-[#141414]' : 'border-white/10 text-white/30 hover:text-white/30 hover:border-white/10'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((order) => {
          const waUrl = getWhatsAppUrl(order.userPhone, order.userName, order.id, order.status)
          return (
            <div key={order.id} className="bg-[#141414] rounded-lg border border-white/10 overflow-hidden">
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 cursor-pointer"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center text-[0.6rem] text-white/30 flex-shrink-0">
                    {order.user_id.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs text-white/50 font-mono">{order.id.slice(0, 8)}...</p>
                      <span className={`inline-flex px-2 py-0.5 rounded text-[0.6rem] font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[0.6rem] text-white/30 mt-0.5 truncate">
                      {order.userName || 'User'} · {order.createdAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 pl-14 sm:pl-0">
                  <p className="text-sm text-white/50 font-medium">₹{order.total.toFixed(2)}</p>
                  {waUrl ? (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#25D366]/10 border border-[#25D366]/20 rounded text-[0.6rem] text-[#25D366] hover:bg-[#25D366]/20 transition-colors min-h-[32px]"
                      title={`WhatsApp ${order.userName || 'customer'} — ${order.status}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 px-2.5 py-1.5 border border-white/5 rounded text-[0.6rem] text-white/15 min-h-[32px] cursor-not-allowed" title="No phone number on file">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="opacity-30">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 1.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      No Phone
                    </span>
                  )}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-white/30 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="border-t border-white/10 p-4 sm:p-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[0.6rem] text-white/30 mb-1">Customer</p>
                      <p className="text-xs text-white/50">{order.userName || 'Unknown'}</p>
                      {order.userPhone && <p className="text-[0.6rem] text-white/30 mt-0.5">{order.userPhone}</p>}
                    </div>
                    <div>
                      <p className="text-[0.6rem] text-white/30 mb-1">Shipping</p>
                      <p className="text-xs text-white/50">{order.shippingAddress}</p>
                    </div>
                    <div>
                      <p className="text-[0.6rem] text-white/30 mb-2">Update Status</p>
                      <div className="flex flex-wrap gap-1.5">
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(order.id, s)}
                            className={`px-2.5 py-1.5 text-[0.55rem] rounded border transition-colors min-h-[32px] ${order.status === s ? 'border-white/20 text-white/50 bg-[#141414]' : 'border-white/10 text-white/30 hover:text-white/30'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    {waUrl ? (
                      <div>
                        <p className="text-[0.6rem] text-white/30 mb-2">Notify Customer</p>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-black text-xs font-medium rounded hover:bg-[#25D366]/90 transition-colors min-h-[36px]"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 1.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Message on WhatsApp
                        </a>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[0.6rem] text-white/30 mb-2">Notify Customer</p>
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-white/20 text-xs font-medium rounded min-h-[36px] cursor-not-allowed">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="opacity-30">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          No phone on file
                        </span>
                      </div>
                    )}
                  </div>
                   <div>
                    <p className="text-[0.6rem] text-white/30 mb-2">Items</p>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-white/30">{item.productName} × {item.quantity}</span>
                          <span className="text-white/30">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                    <InvoiceButton order={order} variant="admin" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-center text-xs text-white/30 py-12">No orders match this filter.</p>
        )}
      </div>
    </div>
  )
}
