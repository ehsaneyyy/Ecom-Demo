import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import useFocusTrap from '../hooks/useFocusTrap'

export default function SearchOverlay({ open, onClose }) {
  const { products } = useData()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const trapRef = useFocusTrap(open)

  const results = useMemo(() => {
    if (!query.trim()) return []
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
    )
  }, [query, products])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(-1)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(-1)
  }, [query])

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

  const handleKeyDown = (e) => {
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      const product = results[activeIndex]
      if (product) {
        onClose()
        navigate(`/product/${product.id}`)
      }
    }
  }

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-search-item]')
      items[activeIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Search products">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div ref={trapRef} className="relative max-w-xl mx-auto mt-[15vh] px-4 animate-scale-in">
        <div className="bg-theme-surface border border-theme-border rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 sm:px-5 border-b border-theme-border">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-theme-text-faint flex-shrink-0">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products..."
              className="flex-1 py-4 bg-transparent text-sm text-theme-text-secondary placeholder-theme-text-faint focus:outline-none"
              aria-label="Search products"
              aria-expanded={results.length > 0}
              aria-controls="search-results"
              aria-activedescendant={activeIndex >= 0 ? `search-item-${activeIndex}` : undefined}
              role="combobox"
              aria-autocomplete="list"
            />
            <button onClick={onClose} className="text-[0.6rem] text-theme-text-faint hover:text-theme-text-faint transition-colors px-2 py-1 border border-theme-border rounded flex-shrink-0">
              ESC
            </button>
          </div>

          {query.trim() && (
            <div id="search-results" ref={listRef} role="listbox" className="max-h-80 overflow-y-auto">
              {results.length > 0 ? (
                <div className="py-2">
                  {results.map((product, i) => (
                    <Link
                      key={product.id}
                      data-search-item
                      id={`search-item-${i}`}
                      role="option"
                      aria-selected={activeIndex === i}
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className={`flex items-center gap-4 px-4 sm:px-5 py-3 transition-colors ${activeIndex === i ? 'bg-theme-surface' : 'hover:bg-theme-surface-hover'}`}
                    >
                      <div className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center text-theme-text-faint" style={{ background: product.color }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-theme-text-muted truncate">{product.name}</p>
                        <p className="text-[0.6rem] text-theme-text-faint">{product.category}</p>
                      </div>
                      <p className="text-xs text-theme-text-faint flex-shrink-0">${product.price}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-5 py-8 text-center text-xs text-theme-text-faint">No results for "{query}"</p>
              )}
            </div>
          )}

          {!query.trim() && (
            <div className="px-5 py-6 text-center">
              <p className="text-xs text-theme-text-faint">Type to search products, categories...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
