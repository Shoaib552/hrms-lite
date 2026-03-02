import { useState } from 'react'
import { getAttendance } from '../services/api'
import AttendanceForm from '../components/AttendanceForm'
import AttendanceTable from '../components/AttendanceTable'
import AttendanceChart from '../components/AttendanceChart'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

function exportToCSV(data, filename) {
  const headers = ['Employee ID', 'Date', 'Status']
  const rows = data.map(r => [r.employee_id, r.date, r.status])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function AttendancePage() {
  const [records, setRecords] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchId, setSearchId] = useState('')
  const [queried, setQueried] = useState('')
  const [view, setView] = useState('table')

  const fetchAttendance = async (empId) => {
    if (!empId) return
    setLoading(true); setError(''); setQueried(empId)
    try {
      const res = await getAttendance(empId)
      setRecords(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch attendance')
      setRecords(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Attendance Management</h1>
        <p className="page-subtitle">Track and visualize daily employee attendance</p>
      </div>

      <AttendanceForm onMarked={(id) => fetchAttendance(id)} />

      <div className="card">
        <p className="card-title">View Attendance Records</p>
        <form
          onSubmit={(e) => { e.preventDefault(); fetchAttendance(searchId.trim()) }}
          style={{ display: 'flex', gap: '10px', marginBottom: '1.25rem' }}
        >
          <div className="form-group" style={{ flex: 1 }}>
            <input
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              placeholder="Enter Employee ID (e.g. EMP001)"
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" style={{ alignSelf: 'flex-end' }}>
            Search
          </button>
        </form>

        {loading && <Loader />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && records !== null && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                Showing records for <strong style={{ color: '#00C6D8' }}>{queried}</strong>
              </p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  className="btn-export"
                  onClick={() => exportToCSV(records, `attendance_${queried}.csv`)}
                  disabled={records.length === 0}
                >
                  ⬇ Export CSV
                </button>
                <div className="view-toggle">
                  <button className={`toggle-btn ${view === 'table' ? 'active' : ''}`} onClick={() => setView('table')}>
                    📋 Table
                  </button>
                  <button className={`toggle-btn ${view === 'chart' ? 'active' : ''}`} onClick={() => setView('chart')}>
                    📊 Chart
                  </button>
                </div>
              </div>
            </div>

            {view === 'table' && <AttendanceTable records={records} />}
            {view === 'chart' && <AttendanceChart records={records} employeeId={queried} />}
          </>
        )}

        {!loading && !error && records === null && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p className="empty-text">Enter an employee ID above to view their attendance</p>
          </div>
        )}
      </div>
    </div>
  )
}
