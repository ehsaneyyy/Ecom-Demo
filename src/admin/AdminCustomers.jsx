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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text-faint">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full pl-9 pr-4 py-2.5 bg-theme-surface border border-theme-border text-sm text-theme-text-secondary placeholder-theme-text-faint focus:outline-none focus:border-theme-border-hover transition-colors"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((customer) => {
          const isExpanded = expandedCustomer === customer.id
          const customerOrders = getCustomerOrders(customer.id)
          const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0)
          return (
            <div key={customer.id} className="bg-theme-surface rounded-lg border border-theme-border overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-theme-surface flex items-center justify-center text-xs text-theme-text-faint flex-shrink-0">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-theme-text-muted truncate">{customer.name}</p>
                    <p className="text-[0.6rem] text-theme-text-faint truncate">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pl-14 sm:pl-0 flex-shrink-0">
                  <p className="text-[0.6rem] text-theme-text-faint">
                    {customerOrders.length} order{customerOrders.length !== 1 ? 's' : ''} · ${totalSpent.toFixed(0)}
                  </p>
                  <button
                    onClick={() => setExpandedCustomer(isExpanded ? null : customer.id)}
                    className="px-3 py-1.5 text-[0.6rem] text-theme-text-faint hover:text-theme-text-muted border border-theme-border hover:border-theme-border-hover transition-colors min-h-[36px]"
                  >
                    {isExpanded ? 'Less' : 'View'}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-theme-border p-4 sm:p-6 animate-fade-in space-y-4">
                  {customerOrders.length > 0 && (
                    <div>
                      <p className="text-[0.6rem] text-theme-text-faint mb-2">Orders</p>
                      <div className="space-y-2">
                        {customerOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between text-xs py-2 border-b border-theme-border last:border-0">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-theme-text-faint">{order.id.slice(0, 8)}...</span>
                              <span className="text-theme-text-faint">{order.createdAt}</span>
                            </div>
                            <span className="text-theme-text-faint">${order.total.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {customerOrders.length === 0 && (
                    <p className="text-xs text-theme-text-faint">No orders yet.</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-center text-xs text-theme-text-faint py-12">No customers found.</p>
        )}
      </div>
    </div>
  )
}
