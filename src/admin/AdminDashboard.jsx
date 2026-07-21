import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useData } from '../context/DataContext'
import { statusColors } from '../constants/orderStatuses'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-[0.6rem] text-white/30 mb-1">{label}</p>
      <p className="text-sm text-white/70 font-medium">₹{payload[0].value.toLocaleString()}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const { products, orders, customers } = useData()
  const realCustomers = customers.filter((c) => !c.is_admin)

  const totalRevenue = orders.reduce((sum, o) => sum + (o.grand_total || o.total), 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, sub: `${orders.length} orders`, color: 'text-[#4ade80]' },
    { label: 'Products', value: products.length, sub: `${products.filter((p) => p.stock <= 5).length} low stock`, color: 'text-[#60a5fa]' },
    { label: 'Pending Orders', value: pendingOrders, sub: `${deliveredCount} delivered`, color: 'text-[#c8a97e]' },
    { label: 'Customers', value: realCustomers.length, sub: `Avg. ₹${avgOrderValue.toFixed(0)} per order`, color: 'text-[#a78bfa]' },
  ]

  const chartData = useMemo(() => {
    const dayMap = {}
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
      dayMap[key] = 0
    }
    orders.forEach((o) => {
      if (!o.created_at) return
      const d = new Date(o.created_at)
      const key = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
      if (key in dayMap) {
        dayMap[key] += o.grand_total || o.total || 0
      }
    })
    return Object.entries(dayMap).map(([date, revenue]) => ({
      date,
      revenue: Math.round(revenue),
    }))
  }, [orders])

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1)
  const recentOrders = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)

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

      <div className="bg-[#141414] rounded-lg border border-white/10 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium text-white/50">Revenue (Last 30 Days)</h2>
          <p className="text-[0.6rem] text-white/30">₹{chartData.reduce((s, d) => s + d.revenue, 0).toLocaleString()} total</p>
        </div>
        {orders.length > 0 ? (
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.2)' }}
                  axisLine={false}
                  tickLine={false}
                  interval={Math.floor(chartData.length / 6)}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.2)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="revenue" radius={[2, 2, 0, 0]} maxBarSize={20}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.revenue > 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <p className="text-xs text-white/20">No orders yet — chart will appear here</p>
          </div>
        )}
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
                  <td className="px-4 sm:px-6 py-4 text-xs text-white/30">{order.userName || order.user_id.slice(0, 8) + '...'}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[0.6rem] font-medium ${statusColors[order.status] || 'text-white/30 bg-[#141414]'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-xs text-white/30 text-right">₹{(order.grand_total || order.total).toFixed(2)}</td>
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
