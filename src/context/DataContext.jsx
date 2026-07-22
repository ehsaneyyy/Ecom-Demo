import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { productApi, orderApi, authApi, categoryApi, addressApi } from '../api/api'
import { useAuth } from './AuthContext'

const DataContext = createContext()

function transformProduct(p) {
  return {
    ...p,
    compareAtPrice: p.compare_at_price,
    images: p.images || [],
    reviews: (p.reviews || []).map((r) => ({
      ...r,
      author: r.user_name,
      date: r.created_at,
    })),
  }
}

function transformOrder(o) {
  return {
    ...o,
    createdAt: o.created_at,
    shippingAddress: o.shipping_address,
    userName: o.user_name,
    userEmail: o.user_email,
    userPhone: o.user_phone,
    promoCode: o.promo_code,
    discountAmount: o.discount_amount,
    items: (o.items || []).map((i) => ({
      ...i,
      productName: i.product_name,
    })),
  }
}

export function useData() {
  return useContext(DataContext)
}

export function DataProvider({ children }) {
  const { token, isAdmin } = useAuth()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [categories, setCategories] = useState([])
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    try {
      const data = await productApi.list()
      setProducts(data.map(transformProduct))
    } catch (err) {
      console.error('Failed to fetch products:', err)
    }
  }, [])

  const fetchOrders = useCallback(async () => {
    if (!token) return
    try {
      const data = await orderApi.list()
      setOrders(data.map(transformOrder))
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    }
  }, [token])

  const fetchCustomers = useCallback(async () => {
    if (!token) return
    try {
      const data = await authApi.listUsers()
      setCustomers(data)
    } catch (err) {
      console.error('Failed to fetch customers:', err)
    }
  }, [token])

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryApi.list()
      setCategories(data)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }, [])

  const fetchAddresses = useCallback(async () => {
    if (!token) return
    try {
      const data = await addressApi.list()
      setAddresses(data)
    } catch (err) {
      console.error('Failed to fetch addresses:', err)
    }
  }, [token])

  const addCategory = useCallback(async (data) => {
    const newCat = await categoryApi.create(data)
    setCategories((prev) => [...prev, newCat])
    return newCat
  }, [])

  const updateCategory = useCallback(async (id, data) => {
    const updated = await categoryApi.update(id, data)
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)))
    return updated
  }, [])

  const deleteCategory = useCallback(async (id) => {
    await categoryApi.delete(id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const addAddress = useCallback(async (data) => {
    const newAddr = await addressApi.create(data)
    setAddresses((prev) => {
      const updated = data.is_default ? prev.map((a) => ({ ...a, is_default: false })) : prev
      return [...updated, newAddr]
    })
    return newAddr
  }, [])

  const updateAddress = useCallback(async (id, data) => {
    const updated = await addressApi.update(id, data)
    setAddresses((prev) => {
      const list = data.is_default ? prev.map((a) => ({ ...a, is_default: false })) : prev
      return list.map((a) => (a.id === id ? updated : a))
    })
    return updated
  }, [])

  const deleteAddress = useCallback(async (id) => {
    await addressApi.delete(id)
    setAddresses((prev) => prev.filter((a) => a.id !== id))
  }, [])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await Promise.all([fetchProducts(), fetchCategories()])
      if (token) {
        const promises = [fetchOrders(), fetchAddresses()]
        if (isAdmin) promises.push(fetchCustomers())
        await Promise.all(promises)
      }
      setLoading(false)
    }
    load()
  }, [fetchProducts, fetchOrders, fetchCustomers, fetchCategories, fetchAddresses, token, isAdmin])

  const addProduct = useCallback(async (productData) => {
    try {
      const newProduct = await productApi.create(productData)
      setProducts((prev) => [...prev, transformProduct(newProduct)])
      return newProduct
    } catch (err) {
      console.error('Failed to create product:', err)
      throw err
    }
  }, [])

  const updateProduct = useCallback(async (id, updates) => {
    try {
      const updated = await productApi.update(id, updates)
      setProducts((prev) => prev.map((p) => (p.id === id ? transformProduct(updated) : p)))
      return updated
    } catch (err) {
      console.error('Failed to update product:', err)
      throw err
    }
  }, [])

  const deleteProduct = useCallback(async (id) => {
    try {
      await productApi.delete(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error('Failed to delete product:', err)
      throw err
    }
  }, [])

  const addOrder = useCallback(async (shippingAddress, items, promoCode) => {
    try {
      const newOrder = await orderApi.create(shippingAddress, items, promoCode)
      setOrders((prev) => [transformOrder(newOrder), ...prev])
      return newOrder
    } catch (err) {
      console.error('Failed to create order:', err)
      throw err
    }
  }, [])

  const addGuestOrder = useCallback(async (email, name, phone, shippingAddress, items, promoCode) => {
    try {
      const newOrder = await orderApi.createGuest(email, name, phone, shippingAddress, items, promoCode)
      setOrders((prev) => [transformOrder(newOrder), ...prev])
      return newOrder
    } catch (err) {
      console.error('Failed to create guest order:', err)
      throw err
    }
  }, [])

  const updateOrderStatus = useCallback(async (id, status) => {
    try {
      await orderApi.updateStatus(id, status)
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    } catch (err) {
      console.error('Failed to update order:', err)
      throw err
    }
  }, [])

  return (
    <DataContext.Provider value={{
      products, loading,
      orders, addOrder, addGuestOrder, updateOrderStatus,
      customers, fetchCustomers,
      categories, addCategory, updateCategory, deleteCategory, fetchCategories,
      addresses, addAddress, updateAddress, deleteAddress, fetchAddresses,
      addProduct, updateProduct, deleteProduct,
      fetchProducts, fetchOrders,
    }}>
      {children}
    </DataContext.Provider>
  )
}
