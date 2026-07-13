import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authApi } from '../api/api'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('atelier-user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('atelier-token'))

  useEffect(() => {
    if (token) {
      localStorage.setItem('atelier-token', token)
    } else {
      localStorage.removeItem('atelier-token')
    }
  }, [token])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('atelier-user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('atelier-user')
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

  const register = useCallback(async (name, email, password, adminKey) => {
    try {
      const data = await authApi.register(name, email, password, adminKey)
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
    localStorage.removeItem('atelier-token')
    localStorage.removeItem('atelier-user')
  }, [])

  const isLoggedIn = !!currentUser
  const isAdmin = useCallback(() => currentUser?.is_admin || false, [currentUser])

  return (
    <AuthContext.Provider value={{ currentUser, token, isLoggedIn, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
