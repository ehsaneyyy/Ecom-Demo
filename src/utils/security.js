const RATE_LIMIT_KEY = 'atelier-rate-limit'
const LOCKOUT_KEY = 'atelier-lockout'
const SESSION_KEY = 'atelier-session'
const SESSION_TIMEOUT = 30 * 60 * 1000
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000
const ADMIN_SECRET = 'ATELIER-ADMIN-2026'

export async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'atelier-salt-v1')
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function verifyPassword(password, hashed) {
  return hashPassword(password).then((h) => h === hashed)
}

export function checkRateLimit() {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY)
    if (!stored) return { allowed: true, remaining: MAX_ATTEMPTS, resetsAt: null }
    const { attempts, windowStart } = JSON.parse(stored)
    const elapsed = Date.now() - windowStart
    if (elapsed > LOCKOUT_DURATION) {
      localStorage.removeItem(RATE_LIMIT_KEY)
      return { allowed: true, remaining: MAX_ATTEMPTS, resetsAt: null }
    }
    if (attempts >= MAX_ATTEMPTS) {
      return { allowed: false, remaining: 0, resetsAt: windowStart + LOCKOUT_DURATION }
    }
    return { allowed: true, remaining: MAX_ATTEMPTS - attempts, resetsAt: windowStart + LOCKOUT_DURATION }
  } catch {
    return { allowed: true, remaining: MAX_ATTEMPTS, resetsAt: null }
  }
}

export function recordFailedAttempt() {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY)
    let data = stored ? JSON.parse(stored) : { attempts: 0, windowStart: Date.now() }
    const elapsed = Date.now() - data.windowStart
    if (elapsed > LOCKOUT_DURATION) {
      data = { attempts: 0, windowStart: Date.now() }
    }
    data.attempts += 1
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data))
    if (data.attempts >= MAX_ATTEMPTS) {
      localStorage.setItem(LOCKOUT_KEY, JSON.stringify({ lockedUntil: data.windowStart + LOCKOUT_DURATION }))
    }
    return data.attempts
  } catch {
    return 1
  }
}

export function clearRateLimit() {
  localStorage.removeItem(RATE_LIMIT_KEY)
  localStorage.removeItem(LOCKOUT_KEY)
}

export function isLocked() {
  try {
    const stored = localStorage.getItem(LOCKOUT_KEY)
    if (!stored) return false
    const { lockedUntil } = JSON.parse(stored)
    if (Date.now() >= lockedUntil) {
      localStorage.removeItem(LOCKOUT_KEY)
      localStorage.removeItem(RATE_LIMIT_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}

export function getLockoutTimeRemaining() {
  try {
    const stored = localStorage.getItem(LOCKOUT_KEY)
    if (!stored) return 0
    const { lockedUntil } = JSON.parse(stored)
    return Math.max(0, lockedUntil - Date.now())
  } catch {
    return 0
  }
}

export function isSessionValid() {
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    if (!stored) return false
    const { lastActivity } = JSON.parse(stored)
    if (Date.now() - lastActivity > SESSION_TIMEOUT) {
      localStorage.removeItem(SESSION_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}

export function refreshSession() {
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) {
      const session = JSON.parse(stored)
      session.lastActivity = Date.now()
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    }
  } catch { /* ignore */ }
}

export function verifyAdminSecret(secret) {
  return secret === ADMIN_SECRET
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export function sanitizeObject(obj) {
  const clean = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      clean[key] = sanitizeInput(value)
    } else {
      clean[key] = value
    }
  }
  return clean
}
