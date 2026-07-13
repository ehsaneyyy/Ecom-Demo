import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import {
  hashPassword, verifyPassword, checkRateLimit, recordFailedAttempt,
  clearRateLimit, isLocked, getLockoutTimeRemaining, isSessionValid,
  refreshSession, verifyAdminSecret, sanitizeInput,
} from '../utils/security'

const AuthContext = createContext()
const SESSION_TIMEOUT = 30 * 60 * 1000

export function useAuth() {
  return useContext(AuthContext)
}

function loadUsers() {
  try {
    const stored = localStorage.getItem('atelier-users')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem('atelier-users', JSON.stringify(users))
}

function loadSession() {
  try {
    if (!isSessionValid()) return null
    const stored = localStorage.getItem('atelier-session')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers)
  const [currentUser, setCurrentUser] = useState(loadSession)
  const [lockoutInfo, setLockoutInfo] = useState({ locked: false, remaining: 0 })
  const activityTimer = useRef(null)

  useEffect(() => {
    saveUsers(users)
  }, [users])

  useEffect(() => {
    if (currentUser) {
      const session = { ...currentUser, lastActivity: Date.now() }
      localStorage.setItem('atelier-session', JSON.stringify(session))
    } else {
      localStorage.removeItem('atelier-session')
    }
  }, [currentUser])

  useEffect(() => {
    if (!currentUser) return

    const checkSession = () => {
      if (!isSessionValid()) {
        setCurrentUser(null)
        return
      }
      refreshSession()
    }

    activityTimer.current = setInterval(checkSession, 60 * 1000)

    const handleActivity = () => refreshSession()
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }))

    return () => {
      clearInterval(activityTimer.current)
      events.forEach((e) => window.removeEventListener(e, handleActivity))
    }
  }, [currentUser])

  useEffect(() => {
    const interval = setInterval(() => {
      if (isLocked()) {
        const remaining = getLockoutTimeRemaining()
        setLockoutInfo({ locked: true, remaining })
        if (remaining <= 0) {
          setLockoutInfo({ locked: false, remaining: 0 })
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const login = useCallback(async (email, password) => {
    if (isLocked()) {
      const remaining = Math.ceil(getLockoutTimeRemaining() / 1000 / 60)
      return { success: false, error: `Account locked. Try again in ${remaining} minute${remaining !== 1 ? 's' : ''}.` }
    }

    const rateLimit = checkRateLimit()
    if (!rateLimit.allowed) {
      const remaining = Math.ceil((rateLimit.resetsAt - Date.now()) / 1000 / 60)
      return { success: false, error: `Too many attempts. Try again in ${remaining} minute${remaining !== 1 ? 's' : ''}.` }
    }

    const cleanEmail = sanitizeInput(email.trim().toLowerCase())
    const user = users.find((u) => u.email === cleanEmail)
    if (!user) {
      const attempts = recordFailedAttempt()
      const remaining = MAX_ATTEMPTS - attempts
      if (remaining <= 0) {
        setLockoutInfo({ locked: true, remaining: LOCKOUT_DURATION })
        return { success: false, error: 'Account locked due to too many failed attempts. Try again in 15 minutes.' }
      }
      return { success: false, error: `Invalid email or password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.` }
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      const attempts = recordFailedAttempt()
      const remaining = MAX_ATTEMPTS - attempts
      if (remaining <= 0) {
        setLockoutInfo({ locked: true, remaining: LOCKOUT_DURATION })
        return { success: false, error: 'Account locked due to too many failed attempts. Try again in 15 minutes.' }
      }
      return { success: false, error: `Invalid email or password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.` }
    }

    clearRateLimit()
    const safe = { ...user, password: undefined }
    setCurrentUser(safe)
    return { success: true, user: safe }
  }, [users])

  const register = useCallback(async (name, email, password, adminKey) => {
    const cleanEmail = sanitizeInput(email.trim().toLowerCase())
    const cleanName = sanitizeInput(name.trim())

    if (cleanName.length < 2) {
      return { success: false, error: 'Name must be at least 2 characters.' }
    }
    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' }
    }
    if (users.some((u) => u.email === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' }
    }

    const role = adminKey && verifyAdminSecret(adminKey) ? 'admin' : 'customer'
    const hashed = await hashPassword(password)

    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: cleanName,
      email: cleanEmail,
      password: hashed,
      role,
      joined: new Date().toISOString().split('T')[0],
      orders: 0,
      spent: 0,
    }

    setUsers((prev) => [...prev, newUser])
    const safe = { ...newUser, password: undefined }
    setCurrentUser(safe)
    return { success: true, user: safe }
  }, [users])

  const logout = useCallback(() => {
    setCurrentUser(null)
    localStorage.removeItem('atelier-session')
  }, [])

  const isAdmin = currentUser?.role === 'admin'
  const isLoggedIn = !!currentUser

  return (
    <AuthContext.Provider value={{
      currentUser, login, register, logout, isAdmin, isLoggedIn,
      lockoutInfo,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
