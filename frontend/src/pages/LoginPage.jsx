import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth()
  const [form, setForm]    = useState({ email: '', password: '' })
  const [loading, setLoad] = useState(false)
  const [error, setError]  = useState('')

  const handleChange = e => {
    setError('')
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoad(true); setError('')
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Login failed')
      login(data.access_token, data.admin)
      onNavigate('dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoad(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-left" />
      <div className="auth-glow auth-glow-right" />

      <div className="auth-container">
        <div className="auth-logo">
          <span className="brand-icon">⬡</span>
          <span className="brand-name">HRMS <em>Lite</em></span>
        </div>
        <p className="auth-subtitle">Sign in to your admin account</p>

        <div className="auth-card">
          <h2 className="auth-title">Welcome back</h2>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} required placeholder="admin@company.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} required placeholder="••••••••"
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <button className="auth-link" onClick={() => onNavigate('register')}>
              Create one
            </button>
          </p>
        </div>

        <button className="auth-back" onClick={() => onNavigate('landing')}>
          ← Back to home
        </button>
      </div>
    </div>
  )
}