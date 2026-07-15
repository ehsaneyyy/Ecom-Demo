import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'

export default function SearchOverlay({ open, onClose }) {
  const { products } = useData()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (open) onClose()
        else window.dispatchEvent(new CustomEvent('toggle-search'))
      }
      if (e.key === 'Escape' && open) onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
      )
    : []

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-xl mx-auto mt-[15vh] px-4 animate-scale-in">
        <div className="bg-[#141414] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 sm:px-5 border-b border-white/5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 flex-shrink-0">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 py-4 bg-transparent text-sm text-white/70 placeholder-white/20 focus:outline-none"
              aria-label="Search products"
            />
            <button onClick={onClose} className="text-[0.6rem] text-white/20 hover:text-white/40 transition-colors px-2 py-1 border border-white/10 rounded flex-shrink-0">
              ESC
            </button>
          </div>

          {query.trim() && (
            <div className="max-h-80 overflow-y-auto">
              {results.length > 0 ? (
                <div className="py-2">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 px-4 sm:px-5 py-3 hover:bg-white/5 transition-colors"
                    >
                      <div className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center text-white/10" style={{ background: product.color }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/60 truncate">{product.name}</p>
                        <p className="text-[0.6rem] text-white/20">{product.category}</p>
                      </div>
                      <p className="text-xs text-white/30 flex-shrink-0">${product.price}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-5 py-8 text-center text-xs text-white/20">No results for "{query}"</p>
              )}
            </div>
          )}

          {!query.trim() && (
            <div className="px-5 py-6 text-center">
              <p className="text-xs text-white/15">Type to search products, categories...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
