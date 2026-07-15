import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { productApi, orderApi, authApi } from '../api/api'
import { useAuth } from './AuthContext'

const DataContext = createContext()

function transformProduct(p) {
  return {
    ...p,
    compareAtPrice: p.compare_at_price,
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
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
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

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await fetchProducts()
      if (token) {
        await Promise.all([fetchOrders(), fetchCustomers()])
      }
      setLoading(false)
    }
    load()
  }, [fetchProducts, fetchOrders, fetchCustomers, token])

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

  const addOrder = useCallback(async (shippingAddress, items) => {
    try {
      const newOrder = await orderApi.create(shippingAddress, items)
      setOrders((prev) => [transformOrder(newOrder), ...prev])
      return newOrder
    } catch (err) {
      console.error('Failed to create order:', err)
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
      orders, addOrder, updateOrderStatus,
      customers, fetchCustomers,
      addProduct, updateProduct, deleteProduct,
      fetchProducts, fetchOrders,
    }}>
      {children}
    </DataContext.Provider>
  )
}
