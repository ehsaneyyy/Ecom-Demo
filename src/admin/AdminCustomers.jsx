import { useState } from 'react'
import { useData } from '../context/DataContext'
import ConfirmModal from '../components/ConfirmModal'

export default function AdminCustomers() {
  const { customers, deleteCustomer, orders } = useData()
  const [search, setSearch] = useState('')
  const [expandedCustomer, setExpandedCustomer] = useState(null)
  const [toast, setToast] = useState(null)
  const [confirm, setConfirm] = useState({ open: false, onConfirm: null })

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (customer) => {
    setConfirm({
      open: true,
      title: 'Delete Customer',
      message: `Delete "${customer.name}"? This cannot be undone.`,
      onConfirm: () => {
        deleteCustomer(customer.id)
        showToast('Customer deleted')
        setConfirm({ open: false })
      },
    })
  }

  const getCustomerOrders = (customerId) => {
    return orders.filter((o) => o.customer.email === customers.find((c) => c.id === customerId)?.email)
  }

  return (
    <div className="space-y-6">
      <ConfirmModal {...confirm} onCancel={() => setConfirm({ open: false })} />

      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 bg-[#1a1a1a] border border-white/10 text-xs text-white/60 rounded-lg shadow-xl animate-slide-down">
          {toast}
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em]">Customers</h1>

      <div className="relative max-w-md">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 text-sm text-white/70 placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((customer) => {
          const isExpanded = expandedCustomer === customer.id
          const customerOrders = getCustomerOrders(customer.id)
          return (
            <div key={customer.id} className="bg-[#141414] rounded-lg border border-white/5 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs text-white/30 flex-shrink-0">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white/60 truncate">{customer.name}</p>
                    <p className="text-[0.6rem] text-white/25 truncate">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-14 sm:pl-0 flex-shrink-0">
                  <p className="text-[0.6rem] text-white/20">
                    {customerOrders.length} order{customerOrders.length !== 1 ? 's' : ''}
                  </p>
                  <button
                    onClick={() => setExpandedCustomer(isExpanded ? null : customer.id)}
                    className="px-3 py-1.5 text-[0.6rem] text-white/30 hover:text-white/60 border border-white/5 hover:border-white/15 transition-colors min-h-[36px]"
                  >
                    {isExpanded ? 'Less' : 'View'}
                  </button>
                  <button
                    onClick={() => handleDelete(customer)}
                    className="px-3 py-1.5 text-[0.6rem] text-red-400/50 hover:text-red-400/80 border border-white/5 hover:border-red-400/20 transition-colors min-h-[36px]"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-white/5 p-4 sm:p-6 animate-fade-in space-y-4">
                  <div>
                    <p className="text-[0.6rem] text-white/25 mb-1">Joined</p>
                    <p className="text-xs text-white/50">{new Date(customer.joined).toLocaleDateString()}</p>
                  </div>
                  {customerOrders.length > 0 && (
                    <div>
                      <p className="text-[0.6rem] text-white/25 mb-2">Orders</p>
                      <div className="space-y-2">
                        {customerOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-0">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-white/40">{order.id}</span>
                              <span className="text-white/20">{new Date(order.date).toLocaleDateString()}</span>
                            </div>
                            <span className="text-white/40">${order.total.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {customerOrders.length === 0 && (
                    <p className="text-xs text-white/20">No orders yet.</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-center text-xs text-white/20 py-12">No customers found.</p>
        )}
      </div>
    </div>
  )
}
