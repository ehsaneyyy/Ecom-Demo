import { useData } from '../context/DataContext'
import { statusColors } from '../constants/orderStatuses'

export default function AdminDashboard() {
  const { products, orders, customers } = useData()

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, sub: `${orders.length} orders`, color: 'text-[#4ade80]' },
    { label: 'Products', value: products.length, sub: `${products.filter((p) => p.stock <= 5).length} low stock`, color: 'text-[#60a5fa]' },
    { label: 'Pending Orders', value: pendingOrders, sub: 'Needs attention', color: 'text-[#c8a97e]' },
    { label: 'Customers', value: customers.length, sub: `Avg. ₹${avgOrderValue.toFixed(0)} per order`, color: 'text-[#a78bfa]' },
  ]

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em]">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#141414] rounded-lg p-4 sm:p-6 border border-white/10">
            <p className="text-[0.6rem] tracking-[0.2em] uppercase text-white/30 mb-2 sm:mb-3">{s.label}</p>
            <p className={`text-xl sm:text-3xl font-bold tracking-tight ${s.color}`}>{s.value}</p>
            <p className="text-[0.6rem] text-white/30 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#141414] rounded-lg border border-white/10">
        <div className="px-4 sm:px-6 py-4 border-b border-white/10">
          <h2 className="text-sm font-medium text-white/50">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 sm:px-6 py-3 text-[0.6rem] tracking-[0.1em] uppercase text-white/30 font-medium">Order</th>
                <th className="text-left px-4 sm:px-6 py-3 text-[0.6rem] tracking-[0.1em] uppercase text-white/30 font-medium">Customer</th>
                <th className="text-left px-4 sm:px-6 py-3 text-[0.6rem] tracking-[0.1em] uppercase text-white/30 font-medium">Status</th>
                <th className="text-right px-4 sm:px-6 py-3 text-[0.6rem] tracking-[0.1em] uppercase text-white/30 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/10 last:border-0">
                  <td className="px-4 sm:px-6 py-4 text-xs text-white/50 font-mono">{order.id.slice(0, 8)}...</td>
                  <td className="px-4 sm:px-6 py-4 text-xs text-white/30">{order.user_id.slice(0, 8)}...</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[0.6rem] font-medium ${statusColors[order.status] || 'text-white/30 bg-[#141414]'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-xs text-white/30 text-right">₹{order.total.toFixed(2)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-xs text-white/30">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
