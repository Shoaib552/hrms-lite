import { useState } from 'react'
import EmployeesPage from './pages/EmployeesPage'
import AttendancePage from './pages/AttendancePage'

export default function App() {
  const [page, setPage] = useState('employees')
  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <span className="brand-icon">⬡</span>
          <span className="brand-name">HRMS <em>Lite</em></span>
        </div>
        <nav className="header-nav">
          <button className={`nav-btn ${page === 'employees' ? 'active' : ''}`} onClick={() => setPage('employees')}>Employees</button>
          <button className={`nav-btn ${page === 'attendance' ? 'active' : ''}`} onClick={() => setPage('attendance')}>Attendance</button>
        </nav>
      </header>
      <main className="main-content">
        {page === 'employees' ? <EmployeesPage /> : <AttendancePage />}
      </main>
    </div>
  )
}
