import { useState, useEffect, useCallback } from 'react'
import { getEmployees } from '../services/api'
import EmployeeForm from '../components/EmployeeForm'
import EmployeeTable from '../components/EmployeeTable'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

function exportToCSV(data, filename) {
  const headers = ['Employee ID', 'Full Name', 'Email', 'Department', 'Joined']
  const rows = data.map(emp => [
    emp.employee_id,
    emp.full_name,
    emp.email,
    emp.department,
    new Date(emp.created_at).toLocaleDateString()
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')

  const fetchEmployees = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const res = await getEmployees()
      setEmployees(res.data)
      setFiltered(res.data)
    } catch {
      setError('Failed to load employees. Check if the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEmployees() }, [fetchEmployees])

  useEffect(() => {
    let result = employees
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(emp =>
        emp.full_name.toLowerCase().includes(q) ||
        emp.employee_id.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q)
      )
    }
    if (deptFilter !== 'All') {
      result = result.filter(emp => emp.department === deptFilter)
    }
    setFiltered(result)
  }, [search, deptFilter, employees])

  const departments = ['All', ...new Set(employees.map(e => e.department))]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Employee Management</h1>
        <p className="page-subtitle">Add, view and manage your workforce</p>
      </div>

      <EmployeeForm onAdded={fetchEmployees} />

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
          <p className="card-title" style={{ margin: 0 }}>All Employees ({filtered.length})</p>
          <button
            className="btn-export"
            onClick={() => exportToCSV(filtered, 'employees.csv')}
            disabled={filtered.length === 0}
          >
            ⬇ Export CSV
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="search-bar">
          <input
            className="search-input"
            type="text"
            placeholder="🔍  Search by name, ID or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
          >
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {(search || deptFilter !== 'All') && (
            <button
              className="btn btn-danger"
              onClick={() => { setSearch(''); setDeptFilter('All') }}
            >
              Clear
            </button>
          )}
        </div>

        {loading ? <Loader /> : error ? <ErrorMessage message={error} /> : (
          <>
            {filtered.length === 0 && employees.length > 0 && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <p className="empty-text">No employees match your search</p>
              </div>
            )}
            {filtered.length > 0 && (
              <EmployeeTable employees={filtered} onDeleted={fetchEmployees} />
            )}
            {employees.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <p className="empty-text">No employees yet. Add one above.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
