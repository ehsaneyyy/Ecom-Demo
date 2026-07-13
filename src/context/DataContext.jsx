import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { PRODUCTS as SEED_PRODUCTS, ORDERS as SEED_ORDERS, CUSTOMERS as SEED_CUSTOMERS } from '../data/store'

const DataContext = createContext()

export function useData() {
  return useContext(DataContext)
}

function load(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

export function DataProvider({ children }) {
  const [products, setProducts] = useState(() => load('atelier-products', SEED_PRODUCTS))
  const [orders, setOrders] = useState(() => load('atelier-orders', SEED_ORDERS))
  const [customers, setCustomers] = useState(() => load('atelier-customers', SEED_CUSTOMERS))

  useEffect(() => {
    localStorage.setItem('atelier-products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('atelier-orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem('atelier-customers', JSON.stringify(customers))
  }, [customers])

  const addProduct = useCallback((product) => {
    const newProduct = {
      ...product,
      id: Math.max(0, ...products.map((p) => p.id)) + 1,
      price: Number(product.price),
    }
    setProducts((prev) => [...prev, newProduct])
    return newProduct
  }, [products])

  const updateProduct = useCallback((id, updates) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, ...updates, price: Number(updates.price ?? p.price) } : p))
  }, [])

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const updateOrderStatus = useCallback((id, status) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o))
  }, [])

  const addOrder = useCallback((order) => {
    const newOrder = {
      ...order,
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
    }
    setOrders((prev) => [newOrder, ...prev])
    return newOrder
  }, [orders])

  const deleteCustomer = useCallback((id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const addCustomer = useCallback((customer) => {
    const newCustomer = {
      ...customer,
      id: Math.max(0, ...customers.map((c) => c.id)) + 1,
      orders: 0,
      spent: 0,
      joined: new Date().toISOString().split('T')[0],
    }
    setCustomers((prev) => [...prev, newCustomer])
    return newCustomer
  }, [customers])

  const resetData = useCallback(() => {
    setProducts(SEED_PRODUCTS)
    setOrders(SEED_ORDERS)
    setCustomers(SEED_CUSTOMERS)
  }, [])

  return (
    <DataContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      orders, updateOrderStatus, addOrder,
      customers, addCustomer, deleteCustomer,
      resetData,
    }}>
      {children}
    </DataContext.Provider>
  )
}
