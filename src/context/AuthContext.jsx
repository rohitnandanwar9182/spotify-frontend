import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

const STORAGE_KEY = 'spotifyclauded_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  // NOTE: the backend has no GET /api/auth/me endpoint, so there is no way
  // to verify an existing cookie on page load. We persist the last known
  // user in localStorage purely so the UI doesn't flash back to "logged out"
  // on refresh. If the cookie has actually expired or been cleared, the next
  // protected request will 401 and ProtectedRoute will bounce back to /login.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setReady(true)
  }, [])

  function persist(nextUser) {
    setUser(nextUser)
    if (nextUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  async function register({ username, email, password, role }) {
    const { data } = await api.post('/api/auth/register', { username, email, password, role })
    persist(data.user)
    return data.user
  }

  async function login({ identifier, password }) {
    // identifier can be a username or an email — backend accepts either
    const isEmail = identifier.includes('@')
    const payload = isEmail ? { email: identifier, password } : { username: identifier, password }
    const { data } = await api.post('/api/auth/login', payload)
    persist(data.user)
    return data.user
  }

  async function logout() {
    try {
      await api.post('/api/auth/logout')
    } finally {
      persist(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, ready, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
