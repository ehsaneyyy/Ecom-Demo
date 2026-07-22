import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import useFocusTrap from '../hooks/useFocusTrap'

const RECENT_KEY = 'atelier-recent-searches'
const MAX_RECENT = 5

function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
  } catch {
    return []
  }
}

function saveRecentSearch(query) {
  const recent = getRecentSearches().filter((r) => r !== query)
  recent.unshift(query)
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)))
}

function computeEditDistance(a, b) {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

function fuzzyMatch(query, text) {
  const q = query.toLowerCase()
  const t = text.toLowerCase()
  if (t.includes(q)) return true
  if (q.length <= 2) return false
  const words = t.split(/\s+/)
  for (const word of words) {
    if (word.startsWith(q.slice(0, 3))) return true
    if (computeEditDistance(q, word) <= Math.max(1, Math.floor(q.length / 3))) return true
  }
  return false
}

function getAutocompleteSuggestions(query, products) {
  if (!query.trim() || query.length < 2) return []
  const q = query.toLowerCase()
  const matches = []
  const seen = new Set()

  for (const p of products) {
    if (matches.length >= 5) break
    const nameMatch = fuzzyMatch(q, p.name)
    const catMatch = fuzzyMatch(q, p.category)
    if ((nameMatch || catMatch) && !seen.has(p.id)) {
      seen.add(p.id)
      matches.push({ id: p.id, name: p.name, category: p.category, price: p.price, color: p.color, images: p.images, type: 'product' })
    }
  }

  return matches
}

export default function SearchOverlay({ open, onClose }) {
  const { products } = useData()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [recentSearches, setRecentSearches] = useState([])
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const trapRef = useFocusTrap(open)

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return products.filter(
      (p) =>
        fuzzyMatch(q, p.name) ||
        fuzzyMatch(q, p.category) ||
        (p.description && fuzzyMatch(q, p.description))
    )
  }, [query, products])

  const suggestions = useMemo(() => {
    return getAutocompleteSuggestions(query, products)
  }, [query, products])

  const showSuggestions = query.length >= 2 && results.length > 0 && activeIndex === -1

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(-1)
      setRecentSearches(getRecentSearches())
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
    const items = results
    if (!items.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % items.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev <= 0 ? items.length - 1 : prev - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && items[activeIndex]) {
        saveRecentSearch(query)
        onClose()
        navigate(`/product/${items[activeIndex].id}`)
      } else if (query.trim()) {
        saveRecentSearch(query)
        onClose()
        navigate(`/category/all?search=${encodeURIComponent(query)}`)
      }
    }
  }

  const handleSuggestionClick = (suggestion) => {
    saveRecentSearch(query)
    onClose()
    navigate(`/product/${suggestion.id}`)
  }

  const handleRecentClick = (term) => {
    setQuery(term)
  }

  const clearRecent = () => {
    localStorage.removeItem(RECENT_KEY)
    setRecentSearches([])
  }

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(-1)
      setRecentSearches(getRecentSearches())
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

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
        <div className="bg-[#141414] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 sm:px-5 border-b border-white/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30 flex-shrink-0">
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
              className="flex-1 py-4 bg-transparent text-sm text-white/70 placeholder-white/30 focus:outline-none"
              aria-label="Search products"
              aria-expanded={results.length > 0}
              aria-controls="search-results"
              aria-activedescendant={activeIndex >= 0 ? `search-item-${activeIndex}` : undefined}
              role="combobox"
              aria-autocomplete="list"
            />
            <button onClick={onClose} className="text-[0.6rem] text-white/30 hover:text-white/30 transition-colors px-2 py-1 border border-white/10 rounded flex-shrink-0">
              ESC
            </button>
          </div>

          {query.trim() && suggestions.length > 0 && results.length > 0 && (
            <div className="px-4 sm:px-5 pt-3 pb-1 border-b border-white/5">
              <p className="text-[0.55rem] text-white/20 mb-2 uppercase tracking-wider">Suggestions</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.slice(0, 3).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[0.6rem] text-white/40 hover:text-white/60 hover:border-white/15 transition-colors"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

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
                      onClick={() => { saveRecentSearch(query); onClose() }}
                      className={`flex items-center gap-4 px-4 sm:px-5 py-3 transition-colors ${activeIndex === i ? 'bg-[#141414]' : 'hover:bg-white/5'}`}
                    >
                      <div className="w-10 h-10 rounded flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ background: product.images?.length ? 'transparent' : product.color }}>
                        {product.images?.length ? (
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /></svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/50 truncate">{product.name}</p>
                        <p className="text-[0.6rem] text-white/30">{product.category}</p>
                      </div>
                      <p className="text-xs text-white/30 flex-shrink-0">₹{product.price}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-5 py-8 text-center text-xs text-white/30">No results for "{query}"</p>
              )}
            </div>
          )}

          {!query.trim() && recentSearches.length > 0 && (
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[0.55rem] text-white/20 uppercase tracking-wider">Recent Searches</p>
                <button onClick={clearRecent} className="text-[0.55rem] text-white/20 hover:text-white/30 transition-colors">Clear</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleRecentClick(term)}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[0.6rem] text-white/40 hover:text-white/60 hover:border-white/15 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!query.trim() && recentSearches.length === 0 && (
            <div className="px-5 py-6 text-center">
              <p className="text-xs text-white/30">Type to search products, categories...</p>
              <p className="text-[0.6rem] text-white/20 mt-2">Press <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[0.55rem]">⌘K</kbd> to toggle search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
