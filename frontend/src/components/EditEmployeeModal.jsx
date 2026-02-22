import { useState } from 'react'
import { updateEmployee } from '../services/api'
import ErrorMessage from './ErrorMessage'

export default function EditEmployeeModal({ employee, onClose, onUpdated }) {
  const [form, setForm] = useState({
    full_name: employee.full_name,
    email: employee.email,
    department: employee.department,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await updateEmployee(employee.employee_id, form)
      onUpdated()
      onClose()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update employee')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Employee</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="modal-subtitle">ID: <code style={{ color: 'var(--accent-blue)' }}>{employee.employee_id}</code></p>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Full Name</label>
            <input name="full_name" value={form.full_name} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label>Department</label>
            <input name="department" value={form.department} onChange={handleChange} required />
          </div>
          <ErrorMessage message={error} />
          <div className="form-footer" style={{ marginTop: '1rem' }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Saving…' : '✓ Save Changes'}
            </button>
            <button className="btn btn-danger" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
