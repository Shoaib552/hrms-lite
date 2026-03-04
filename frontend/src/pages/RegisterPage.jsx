import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function RegisterPage({ onNavigate }) {
  const { login } = useAuth()
  const [form, setForm]    = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [loading, setLoad] = useState(false)
  const [error, setError]  = useState('')

  const handleChange = e => {
    setError('')
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters.'); return }

    setLoad(true); setError('')
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name,
          email:     form.email,
          password:  form.password,
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Registration failed')
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
        <p className="auth-subtitle">Create your admin account</p>

        <div className="auth-card">
          <h2 className="auth-title">Get started</h2>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {[
              { name: 'full_name', label: 'Full Name',        type: 'text',     placeholder: 'John Doe' },
              { name: 'email',     label: 'Email Address',    type: 'email',    placeholder: 'admin@company.com' },
              { name: 'password',  label: 'Password',         type: 'password', placeholder: 'Min. 6 characters' },
              { name: 'confirm',   label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
            ].map(({ name, label, type, placeholder }) => (
              <div className="form-group" key={name}>
                <label>{label}</label>
                <input
                  type={type} name={name} value={form[name]}
                  onChange={handleChange} required placeholder={placeholder}
                />
              </div>
            ))}
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <button className="auth-link" onClick={() => onNavigate('login')}>
              Sign in
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