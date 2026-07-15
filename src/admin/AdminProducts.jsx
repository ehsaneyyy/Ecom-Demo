import { useState } from 'react'
import { useData } from '../context/DataContext'
import ConfirmModal from '../components/ConfirmModal'
import { useToast } from '../components/Toast'

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useData()
  const { show } = useToast()
  const [editing, setEditing] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', description: '', category: 'Ceramics', stock: '10' })
  const [confirm, setConfirm] = useState({ open: false, onConfirm: null })

  const resetForm = () => setForm({ name: '', price: '', description: '', category: 'Ceramics', stock: '10' })

  const handleSave = () => {
    if (!form.name.trim() || !form.price) return
    const productData = {
      name: form.name.trim(),
      price: parseFloat(form.price),
      description: form.description.trim(),
      category: form.category,
      stock: parseInt(form.stock) || 0,
      color: '#1a1a1a',
    }
    if (editing) {
      updateProduct(editing.id, productData)
      show('Product updated')
    } else {
      addProduct(productData)
      show('Product created')
    }
    resetForm()
    setEditing(null)
    setShowAdd(false)
  }

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description || '',
      category: product.category,
      stock: (product.stock ?? 10).toString(),
    })
    setEditing(product)
    setShowAdd(true)
  }

  const handleDelete = (product) => {
    setConfirm({
      open: true,
      title: 'Delete Product',
      message: `Delete "${product.name}"? This action cannot be undone.`,
      onConfirm: () => {
        deleteProduct(product.id)
        show('Product deleted')
        setConfirm({ open: false })
      },
    })
  }

  return (
    <div className="space-y-6">
      <ConfirmModal {...confirm} onCancel={() => setConfirm({ open: false })} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em]">Products</h1>
        <button
          onClick={() => { resetForm(); setEditing(null); setShowAdd(true) }}
          className="px-4 py-2.5 bg-white text-black text-xs tracking-[0.1em] uppercase hover:bg-white/90 transition-colors"
        >
          + Add Product
        </button>
      </div>

      {showAdd && (
        <div className="bg-[#141414] rounded-lg border border-white/5 p-4 sm:p-6 space-y-4 animate-fade-in">
          <h3 className="text-sm font-medium text-white/50">{editing ? 'Edit Product' : 'New Product'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.6rem] text-white/25 mb-1">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors" />
            </div>
            <div>
              <label className="block text-[0.6rem] text-white/25 mb-1">Price</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors" />
            </div>
            <div>
              <label className="block text-[0.6rem] text-white/25 mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors">
                <option>Living</option>
                <option>Bedroom</option>
                <option>Kitchen</option>
                <option>Office</option>
              </select>
            </div>
            <div>
              <label className="block text-[0.6rem] text-white/25 mb-1">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-[0.6rem] text-white/25 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="px-5 py-2.5 bg-white text-black text-xs tracking-[0.1em] uppercase hover:bg-white/90 transition-colors min-h-[44px]">
              {editing ? 'Update' : 'Create'}
            </button>
            <button onClick={() => { setShowAdd(false); setEditing(null); resetForm() }} className="px-5 py-2.5 border border-white/10 text-xs text-white/30 hover:text-white/50 hover:border-white/20 transition-colors min-h-[44px]">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#141414] rounded-lg border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 sm:px-6 py-3 text-[0.6rem] tracking-[0.1em] uppercase text-white/25 font-medium">Product</th>
                <th className="text-left px-4 sm:px-6 py-3 text-[0.6rem] tracking-[0.1em] uppercase text-white/25 font-medium hidden sm:table-cell">Category</th>
                <th className="text-left px-4 sm:px-6 py-3 text-[0.6rem] tracking-[0.1em] uppercase text-white/25 font-medium">Price</th>
                <th className="text-left px-4 sm:px-6 py-3 text-[0.6rem] tracking-[0.1em] uppercase text-white/25 font-medium hidden md:table-cell">Stock</th>
                <th className="text-right px-4 sm:px-6 py-3 text-[0.6rem] tracking-[0.1em] uppercase text-white/25 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 sm:px-6 py-4">
                    <p className="text-xs text-white/60 truncate max-w-[200px]">{product.name}</p>
                    <p className="text-[0.6rem] text-white/20 sm:hidden">{product.category}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-xs text-white/30 hidden sm:table-cell">{product.category}</td>
                  <td className="px-4 sm:px-6 py-4 text-xs text-white/40">${product.price}</td>
                  <td className="px-4 sm:px-6 py-4 text-xs text-white/40 hidden md:table-cell">
                    <span className={`${(product.stock ?? 10) <= 5 ? 'text-[#c8a97e]' : ''}`}>
                      {product.stock ?? 10}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(product)} className="px-3 py-1.5 text-[0.6rem] text-white/30 hover:text-white/60 border border-white/5 hover:border-white/15 transition-colors min-h-[36px]">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product)} className="px-3 py-1.5 text-[0.6rem] text-red-400/50 hover:text-red-400/80 border border-white/5 hover:border-red-400/20 transition-colors min-h-[36px]">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-xs text-white/20">No products yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
