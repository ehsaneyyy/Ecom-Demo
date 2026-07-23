import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authApi } from '../api/api'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ecom-demo-user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('ecom-demo-token'))

  useEffect(() => {
    if (token) {
      localStorage.setItem('ecom-demo-token', token)
    } else {
      localStorage.removeItem('ecom-demo-token')
    }
  }, [token])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ecom-demo-user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('ecom-demo-user')
    }
  }, [currentUser])

  const login = useCallback(async (email, password) => {
    try {
      const data = await authApi.login(email, password)
      setToken(data.access_token)
      setCurrentUser(data.user)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Login failed' }
    }
  }, [])

  const register = useCallback(async (name, email, password, adminKey, phone) => {
    try {
      const data = await authApi.register(name, email, password, adminKey, phone)
      setToken(data.access_token)
      setCurrentUser(data.user)
      return { success: true, isAdmin: data.user.is_admin }
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Registration failed' }
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setCurrentUser(null)
    localStorage.removeItem('ecom-demo-token')
    localStorage.removeItem('ecom-demo-user')
  }, [])

  const updateUser = useCallback((userData) => {
    setCurrentUser((prev) => ({ ...prev, ...userData }))
  }, [])

  const isLoggedIn = !!currentUser
  const isAdmin = currentUser?.is_admin || false

  return (
    <AuthContext.Provider value={{ currentUser, token, isLoggedIn, isAdmin, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
