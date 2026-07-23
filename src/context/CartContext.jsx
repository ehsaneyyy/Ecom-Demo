import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

function getCartKey(userId) {
  return userId ? `ecom-demo-cart-${userId}` : 'ecom-demo-cart-guest'
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

function loadPromo(userId) {
  try {
    const key = userId ? `ecom-demo-promo-${userId}` : 'ecom-demo-promo-guest'
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : { code: null, discount: 0 }
  } catch {
    return { code: null, discount: 0 }
  }
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth()
  const userId = currentUser?.id || null
  const [items, setItems] = useState(() => loadCart(userId))
  const [promoCode, setPromoCode] = useState(() => loadPromo(userId).code)
  const [promoDiscount, setPromoDiscount] = useState(() => loadPromo(userId).discount)
  const prevUserId = useRef(userId)

  useEffect(() => {
    if (prevUserId.current !== userId) {
      setItems(loadCart(userId))
      const promo = loadPromo(userId)
      setPromoCode(promo.code)
      setPromoDiscount(promo.discount)
      prevUserId.current = userId
    }
  }, [userId])

  useEffect(() => {
    localStorage.setItem(getCartKey(userId), JSON.stringify(items))
  }, [items, userId])

  useEffect(() => {
    const key = userId ? `ecom-demo-promo-${userId}` : 'ecom-demo-promo-guest'
    localStorage.setItem(key, JSON.stringify({ code: promoCode, discount: promoDiscount }))
  }, [promoCode, promoDiscount, userId])

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

  const clearCart = useCallback(() => {
    setItems([])
    setPromoCode(null)
    setPromoDiscount(0)
  }, [])

  const applyPromo = useCallback((code, discount) => {
    setPromoCode(code)
    setPromoDiscount(discount)
  }, [])

  const removePromo = useCallback(() => {
    setPromoCode(null)
    setPromoDiscount(0)
  }, [])

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items])
  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count, promoCode, promoDiscount, applyPromo, removePromo }}>
      {children}
    </CartContext.Provider>
  )
}
