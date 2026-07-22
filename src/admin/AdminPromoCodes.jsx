import { useState, useEffect } from 'react'
import { promoApi } from '../api/api'
import Reveal from '../components/Reveal'

export default function AdminPromoCodes() {
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    code: '',
    discount_type: 'fixed',
    discount_value: '',
    min_order: '',
    max_uses: '',
    valid_until: '',
  })

  const fetchPromos = async () => {
    try {
      const data = await promoApi.list()
      setPromos(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPromos() }, [])

  const handleCreate = async () => {
    if (!form.code.trim() || !form.discount_value) return
    setCreating(true)
    setError(null)
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
        min_order: form.min_order ? parseFloat(form.min_order) : 0,
        max_uses: form.max_uses ? parseInt(form.max_uses) : 0,
        valid_until: form.valid_until || null,
      }
      await promoApi.create(payload)
      setForm({ code: '', discount_type: 'fixed', discount_value: '', min_order: '', max_uses: '', valid_until: '' })
      fetchPromos()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create promo code')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this promo code?')) return
    try {
      await promoApi.delete(id)
      setPromos((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Reveal>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] mb-10 sm:mb-16">Promo Codes</h1>
      </Reveal>

      <Reveal delay={40}>
        <div className="bg-[#141414] rounded-lg border border-white/10 p-4 sm:p-6 mb-8 space-y-4">
          <p className="text-xs text-white/30 mb-2">Create Promo Code</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[0.6rem] text-white/30 mb-1">Code</label>
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SUMMER2026" className="w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 text-sm text-white/70 font-mono focus:outline-none focus:border-white/20 transition-colors" />
            </div>
            <div>
              <label className="block text-[0.6rem] text-white/30 mb-1">Type</label>
              <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className="w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors">
                <option value="fixed">Fixed (₹)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>
            <div>
              <label className="block text-[0.6rem] text-white/30 mb-1">Value</label>
              <input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} placeholder={form.discount_type === 'fixed' ? '500' : '10'} className="w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors" />
            </div>
            <div>
              <label className="block text-[0.6rem] text-white/30 mb-1">Min Order (₹)</label>
              <input type="number" value={form.min_order} onChange={(e) => setForm({ ...form, min_order: e.target.value })} placeholder="0" className="w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.6rem] text-white/30 mb-1">Max Uses (0 = unlimited)</label>
              <input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} placeholder="100" className="w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors" />
            </div>
            <div>
              <label className="block text-[0.6rem] text-white/30 mb-1">Valid Until</label>
              <input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} className="w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors" />
            </div>
          </div>
          {error && <p className="text-xs text-red-400/70">{error}</p>}
          <div className="flex justify-end pt-2">
            <button onClick={handleCreate} disabled={creating || !form.code.trim() || !form.discount_value} className="px-5 py-2.5 bg-white text-black text-xs tracking-[0.1em] uppercase hover:bg-white/90 transition-colors min-h-[40px] disabled:opacity-50">
              {creating ? 'Creating...' : 'Create Promo'}
            </button>
          </div>
        </div>
      </Reveal>

      <Reveal delay={60}>
        {loading ? (
          <div className="text-center py-12">
            <div className="w-5 h-5 border border-white/10 border-t-white/40 rounded-full animate-spin mx-auto" />
          </div>
        ) : promos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-white/30">No promo codes yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {promos.map((promo) => (
              <div key={promo.id} className="bg-[#141414] rounded-lg border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-sm text-white/50 font-mono">{promo.code}</p>
                    <span className="text-[0.55rem] px-2 py-0.5 rounded border border-white/10 text-white/30">
                      {promo.discount_type === 'fixed' ? `₹${promo.discount_value}` : `${promo.discount_value}%`}
                    </span>
                    {promo.active ? (
                      <span className="text-[0.55rem] text-[#4ade80]/60 bg-[#4ade80]/10 px-1.5 py-0.5 rounded">Active</span>
                    ) : (
                      <span className="text-[0.55rem] text-red-400/60 bg-red-400/10 px-1.5 py-0.5 rounded">Inactive</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {promo.min_order > 0 && <p className="text-[0.6rem] text-white/30">Min ₹{promo.min_order}</p>}
                    {promo.max_uses > 0 && <p className="text-[0.6rem] text-white/30">{promo.used_count}/{promo.max_uses} used</p>}
                    {promo.valid_until && <p className="text-[0.6rem] text-white/30">Expires {promo.valid_until}</p>}
                  </div>
                </div>
                <button onClick={() => handleDelete(promo.id)} className="px-3 py-1.5 border border-red-500/20 text-xs text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-colors flex-shrink-0">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </div>
  )
}
