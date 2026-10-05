import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

const STORAGE_KEY = 'spotifyclauded_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      try {
        const { data } = await api.get('/api/auth/me')
        if (!cancelled) persist(data.user)
      } catch (error) {
        if (!cancelled) {
          persist(null)
          if (error.response?.status !== 401) {
            console.error('Unable to restore the session.', error)
          }
        }
      } finally {
        if (!cancelled) setReady(true)
      }
    }

    restoreSession()
    return () => {
      cancelled = true
    }
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
