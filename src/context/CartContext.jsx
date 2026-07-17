import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

function getCartKey(userId) {
  return userId ? `atelier-cart-${userId}` : 'atelier-cart-guest'
}

function loadCart(userId) {
  try {
    const key = getCartKey(userId)
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth()
  const userId = currentUser?.id || null
  const [items, setItems] = useState(() => loadCart(userId))
  const prevUserId = useRef(userId)

  useEffect(() => {
    if (prevUserId.current !== userId) {
      setItems(loadCart(userId))
      prevUserId.current = userId
    }
  }, [userId])

  useEffect(() => {
    localStorage.setItem(getCartKey(userId), JSON.stringify(items))
  }, [items, userId])

  const addItem = useCallback((product, quantity = 1, selectedColor = null, selectedSize = null) => {
    setItems((prev) => {
      const key = `${product.id}-${selectedColor || ''}-${selectedSize || ''}`
      const existing = prev.find((i) => `${i.id}-${i.selectedColor || ''}-${i.selectedSize || ''}` === key)
      if (existing) {
        return prev.map((i) => `${i.id}-${i.selectedColor || ''}-${i.selectedSize || ''}` === key
          ? { ...i, quantity: i.quantity + quantity }
          : i)
      }
      return [...prev, { ...product, quantity, selectedColor, selectedSize }]
    })
  }, [])

  const removeItem = useCallback((id, selectedColor = null, selectedSize = null) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && (i.selectedColor || '') === (selectedColor || '') && (i.selectedSize || '') === (selectedSize || ''))))
  }, [])

  const updateQuantity = useCallback((id, quantity, selectedColor = null, selectedSize = null) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => !(i.id === id && (i.selectedColor || '') === (selectedColor || '') && (i.selectedSize || '') === (selectedSize || ''))))
      return
    }
    setItems((prev) => prev.map((i) => `${i.id}-${i.selectedColor || ''}-${i.selectedSize || ''}` === `${id}-${selectedColor || ''}-${selectedSize || ''}`
      ? { ...i, quantity }
      : i))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}
