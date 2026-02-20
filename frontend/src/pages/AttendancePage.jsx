import { useState } from 'react'
import { getAttendance } from '../services/api'
import AttendanceForm from '../components/AttendanceForm'
import AttendanceTable from '../components/AttendanceTable'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

export default function AttendancePage() {
  const [records, setRecords] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchId, setSearchId] = useState('')
  const [queried, setQueried] = useState('')

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
        <p className="page-subtitle">Track daily employee attendance</p>
      </div>
      <AttendanceForm onMarked={(id) => fetchAttendance(id)} />
      <div className="card">
        <p className="card-title">View Attendance Records</p>
        <form onSubmit={(e) => { e.preventDefault(); fetchAttendance(searchId.trim()) }} style={{ display: 'flex', gap: '10px', marginBottom: '1.25rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <input value={searchId} onChange={e => setSearchId(e.target.value)} placeholder="Enter Employee ID (e.g. EMP001)" required />
          </div>
          <button className="btn btn-primary" type="submit" style={{ alignSelf: 'flex-end' }}>Search</button>
        </form>
        {loading && <Loader />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && records !== null && (
          <>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Showing records for <strong style={{ color: 'var(--accent)' }}>{queried}</strong>
            </p>
            <AttendanceTable records={records} />
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
