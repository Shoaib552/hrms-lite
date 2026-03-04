/**
 * Global auth state for the app.
 * Uses your existing api.js service file at src/services/api.js
 */

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Base URL from your existing .env
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function AuthProvider({ children }) {
  const [admin, setAdmin]  = useState(null)
  const [loading, setLoad] = useState(true)

  // On mount — check if a saved token exists and is still valid
  useEffect(() => {
    const token = localStorage.getItem('hrms_token')
    if (!token) { setLoad(false); return }

    // Verify token by calling /api/auth/me
    fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Token invalid')
        return res.json()
      })
      .then(data => setAdmin(data))
      .catch(() => localStorage.removeItem('hrms_token'))
      .finally(() => setLoad(false))
  }, [])

  const login = (token, adminData) => {
    localStorage.setItem('hrms_token', token)
    setAdmin(adminData)
  }

  const logout = () => {
    localStorage.removeItem('hrms_token')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}