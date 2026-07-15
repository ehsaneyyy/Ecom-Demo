import { useState } from 'react'
import { useData } from '../context/DataContext'

export default function AdminCustomers() {
  const { customers, orders } = useData()
  const [search, setSearch] = useState('')
  const [expandedCustomer, setExpandedCustomer] = useState(null)

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const getCustomerOrders = (userId) => {
    return orders.filter((o) => o.user_id === userId)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em]">Customers</h1>

      <div className="relative max-w-md">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full pl-9 pr-4 py-2.5 bg-[#141414] border border-white/10 text-sm text-white/70 placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((customer) => {
          const isExpanded = expandedCustomer === customer.id
          const customerOrders = getCustomerOrders(customer.id)
          const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0)
          return (
            <div key={customer.id} className="bg-[#141414] rounded-lg border border-white/10 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center text-xs text-white/30 flex-shrink-0">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white/50 truncate">{customer.name}</p>
                    <p className="text-[0.6rem] text-white/30 truncate">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pl-14 sm:pl-0 flex-shrink-0">
                  <p className="text-[0.6rem] text-white/30">
                    {customerOrders.length} order{customerOrders.length !== 1 ? 's' : ''} · ₹{totalSpent.toFixed(0)}
                  </p>
                  <button
                    onClick={() => setExpandedCustomer(isExpanded ? null : customer.id)}
                    className="px-3 py-1.5 text-[0.6rem] text-white/30 hover:text-white/50 border border-white/10 hover:border-white/20 transition-colors min-h-[36px]"
                  >
                    {isExpanded ? 'Less' : 'View'}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-white/10 p-4 sm:p-6 animate-fade-in space-y-4">
                  {customerOrders.length > 0 && (
                    <div>
                      <p className="text-[0.6rem] text-white/30 mb-2">Orders</p>
                      <div className="space-y-2">
                        {customerOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between text-xs py-2 border-b border-white/10 last:border-0">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-white/30">{order.id.slice(0, 8)}...</span>
                              <span className="text-white/30">{order.createdAt}</span>
                            </div>
                            <span className="text-white/30">₹{order.total.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {customerOrders.length === 0 && (
                    <p className="text-xs text-white/30">No orders yet.</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-center text-xs text-white/30 py-12">No customers found.</p>
        )}
      </div>
    </div>
  )
}
