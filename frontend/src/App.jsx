import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'

// ── Existing pages (unchanged) ─────────────────────────────────
import EmployeesPage  from './pages/EmployeesPage'
import AttendancePage from './pages/AttendancePage'
import DashboardPage  from './pages/DashboardPage'

// ── updated pages pages ──────────────────────────────────────────────────
import LandingPage  from './pages/LandingPage'
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function AppInner() {
  const { isAuthenticated, loading, admin, logout } = useAuth()
  const [page, setPage] = useState('landing')

  // Still checking token on first load — show blank screen briefly
  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-spinner" />
      </div>
    )
  }

  // ── Not logged in: show public pages ──────────────────────────
  if (!isAuthenticated) {
    if (page === 'login')    return <LoginPage    onNavigate={setPage} />
    if (page === 'register') return <RegisterPage onNavigate={setPage} />
    return <LandingPage onNavigate={setPage} />
  }

  // ── Logged in: show app exactly as your original ──────────────
  // If somehow page is still 'landing'/'login'/'register', default to dashboard
  const appPage = ['dashboard', 'employees', 'attendance'].includes(page)
    ? page
    : 'dashboard'

  const handleLogout = () => {
    logout()
    setPage('landing')
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <span className="brand-icon">⬡</span>
          <span className="brand-name">HRMS <em>Lite</em></span>
        </div>

        {/* Your original nav — completely unchanged */}
        <nav className="header-nav">
          <button
            className={`nav-btn ${appPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setPage('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-btn ${appPage === 'employees' ? 'active' : ''}`}
            onClick={() => setPage('employees')}
          >
            Employees
          </button>
          <button
            className={`nav-btn ${appPage === 'attendance' ? 'active' : ''}`}
            onClick={() => setPage('attendance')}
          >
            Attendance
          </button>
        </nav>

        {/* Admin info + logout added on the right */}
        <div className="header-user">
          <span className="header-user-name">👤 {admin?.full_name}</span>
          <button className="nav-btn nav-btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="main-content">
        {appPage === 'dashboard'  && <DashboardPage  />}
        {appPage === 'employees'  && <EmployeesPage  />}
        {appPage === 'attendance' && <AttendancePage />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}