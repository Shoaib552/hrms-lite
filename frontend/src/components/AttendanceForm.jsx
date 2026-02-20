import { useState } from 'react'
import { markAttendance } from '../services/api'
import ErrorMessage from './ErrorMessage'

export default function AttendanceForm({ onMarked }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ employee_id: '', date: today, status: 'Present' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError(''); setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    setLoading(true)
    try {
      await markAttendance(form)
      setSuccess(`Attendance marked as ${form.status} for ${form.employee_id}`)
      onMarked(form.employee_id)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to mark attendance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <p className="card-title">Mark Attendance</p>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Employee ID</label>
            <input name="employee_id" value={form.employee_id} onChange={handleChange} placeholder="EMP001" required />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>
        <div className="form-footer">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Marking…' : '✓ Mark Attendance'}
          </button>
          {success && <div className="alert alert-success">✓ {success}</div>}
        </div>
      </form>
      <ErrorMessage message={error} />
    </div>
  )
}
