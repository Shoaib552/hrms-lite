import { useState } from 'react'
import { addEmployee } from '../services/api'
import ErrorMessage from './ErrorMessage'

export default function EmployeeForm({ onAdded }) {
  const [form, setForm] = useState({ employee_id: '', full_name: '', email: '', department: '' })
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
      await addEmployee(form)
      setSuccess('Employee added successfully!')
      setForm({ employee_id: '', full_name: '', email: '', department: '' })
      onAdded()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add employee')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <p className="card-title">Add New Employee</p>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Employee ID</label>
            <input name="employee_id" value={form.employee_id} onChange={handleChange} placeholder="EMP001" required />
          </div>
          <div className="form-group">
            <label>Full Name</label>
            <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="Jane Doe" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@company.com" required />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input name="department" value={form.department} onChange={handleChange} placeholder="Engineering" required />
          </div>
        </div>
        <div className="form-footer">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Adding…' : '+ Add Employee'}
          </button>
          {success && <div className="alert alert-success">✓ {success}</div>}
        </div>
      </form>
      <ErrorMessage message={error} />
    </div>
  )
}
