import { useState } from 'react'
import { useData } from '../context/DataContext'
import ConfirmModal from '../components/ConfirmModal'
import { useToast } from '../components/Toast'

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useData()
  const { show } = useToast()
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', color: '#1a1a1a', accent: '#ffffff' })
  const [confirm, setConfirm] = useState({ open: false, onConfirm: null })

  const resetForm = () => {
    setForm({ name: '', color: '#1a1a1a', accent: '#ffffff' })
    setEditing(null)
  }

  const getProductCount = (catName) => products.filter((p) => p.category === catName).length

  const handleSave = async () => {
    if (!form.name.trim()) return
    try {
      if (editing) {
        await updateCategory(editing.id, form)
        show('Category updated')
      } else {
        await addCategory(form)
        show('Category created')
      }
      resetForm()
      setShowForm(false)
    } catch (err) {
      show(err.response?.data?.detail || 'Failed')
    }
  }

  const handleEdit = (cat) => {
    setForm({ name: cat.name, color: cat.color, accent: cat.accent })
    setEditing(cat)
    setShowForm(true)
  }

  const handleDelete = (cat) => {
    const count = getProductCount(cat.name)
    setConfirm({
      open: true,
      title: 'Delete Category',
      message: count > 0
        ? `Delete "${cat.name}"? ${count} product(s) use this category. They will keep their category name.`
        : `Delete "${cat.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteCategory(cat.id)
          show('Category deleted')
        } catch (err) {
          show(err.response?.data?.detail || 'Failed to delete')
        }
        setConfirm({ open: false })
      },
    })
  }

  return (
    <div className="space-y-6">
      <ConfirmModal {...confirm} onCancel={() => setConfirm({ open: false })} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em]">Categories</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="px-4 py-2.5 bg-white text-black text-xs tracking-[0.1em] uppercase hover:bg-white/90 transition-colors"
        >
          + Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-[#141414] rounded-lg border border-white/10 p-4 sm:p-6 space-y-4 animate-fade-in">
          <h3 className="text-sm font-medium text-white/50">{editing ? 'Edit Category' : 'New Category'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[0.6rem] text-white/30 mb-1">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#141414] border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[0.6rem] text-white/30 mb-1">Background Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-10 h-10 rounded border border-white/10 cursor-pointer bg-transparent"
                />
                <input
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="flex-1 px-3 py-2.5 bg-[#141414] border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-[0.6rem] text-white/30 mb-1">Accent Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={form.accent}
                  onChange={(e) => setForm({ ...form, accent: e.target.value })}
                  className="w-10 h-10 rounded border border-white/10 cursor-pointer bg-transparent"
                />
                <input
                  value={form.accent}
                  onChange={(e) => setForm({ ...form, accent: e.target.value })}
                  className="flex-1 px-3 py-2.5 bg-[#141414] border border-white/10 text-sm text-white/70 focus:outline-none focus:border-white/20 transition-colors font-mono"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <div className="w-16 h-20 rounded flex-shrink-0 flex items-center justify-center" style={{ background: form.color }}>
              <span className="text-[0.5rem] text-white/30">{form.name || 'Preview'}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="px-5 py-2.5 bg-white text-black text-xs tracking-[0.1em] uppercase hover:bg-white/90 transition-colors min-h-[44px]">
              {editing ? 'Update' : 'Create'}
            </button>
            <button onClick={() => { setShowForm(false); resetForm() }} className="px-5 py-2.5 border border-white/10 text-xs text-white/30 hover:text-white/50 hover:border-white/20 transition-colors min-h-[44px]">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {categories.map((cat) => {
          const count = getProductCount(cat.name)
          return (
            <div key={cat.id} className="bg-[#141414] rounded-lg border border-white/10 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-16 rounded flex-shrink-0 flex items-center justify-center" style={{ background: cat.color }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: cat.accent }} />
                </div>
                <div>
                  <p className="text-sm text-white/50">{cat.name}</p>
                  <p className="text-[0.6rem] text-white/30">{count} product{count !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pl-16 sm:pl-0">
                <button onClick={() => handleEdit(cat)} className="px-3 py-1.5 text-[0.6rem] text-white/30 hover:text-white/50 border border-white/10 hover:border-white/20 transition-colors min-h-[36px]">
                  Edit
                </button>
                <button onClick={() => handleDelete(cat)} className="px-3 py-1.5 text-[0.6rem] text-red-400/50 hover:text-red-400/80 border border-white/10 hover:border-red-400/20 transition-colors min-h-[36px]">
                  Delete
                </button>
              </div>
            </div>
          )
        })}
        {categories.length === 0 && (
          <p className="text-center text-xs text-white/30 py-12">No categories yet.</p>
        )}
      </div>
    </div>
  )
}
