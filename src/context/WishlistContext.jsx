import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

export function useWishlist() {
  return useContext(WishlistContext)
}

function getWishlistKey(userId) {
  return userId ? `atelier-wishlist-${userId}` : 'atelier-wishlist-guest'
}

function loadWishlist(userId) {
  try {
    const key = getWishlistKey(userId)
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const { currentUser } = useAuth()
  const userId = currentUser?.id || null
  const [items, setItems] = useState(() => loadWishlist(userId))
  const prevUserId = useRef(userId)

  useEffect(() => {
    if (prevUserId.current !== userId) {
      setItems(loadWishlist(userId))
      prevUserId.current = userId
    }
  }, [userId])

  useEffect(() => {
    localStorage.setItem(getWishlistKey(userId), JSON.stringify(items))
  }, [items, userId])

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
