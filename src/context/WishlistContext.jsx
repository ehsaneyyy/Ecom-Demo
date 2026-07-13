import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const WishlistContext = createContext()

export function useWishlist() {
  return useContext(WishlistContext)
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem('atelier-wishlist')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('atelier-wishlist', JSON.stringify(items))
  }, [items])

  const toggleWishlist = useCallback((product) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === product.id)
      if (exists) return prev.filter((i) => i.id !== product.id)
      return [...prev, product]
    })
  }, [])

  const isInWishlist = useCallback((id) => {
    return items.some((i) => i.id === id)
  }, [items])

  const count = items.length

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isInWishlist, count }}>
      {children}
    </WishlistContext.Provider>
  )
}
