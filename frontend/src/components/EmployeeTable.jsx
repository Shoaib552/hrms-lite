import { useState } from 'react'
import { deleteEmployee } from '../services/api'
import EditEmployeeModal from './EditEmployeeModal'

export default function EmployeeTable({ employees, onDeleted }) {
  const [deletingId, setDeletingId] = useState(null)
  const [editingEmployee, setEditingEmployee] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm(`Delete employee ${id}?`)) return
    setDeletingId(id)
    try {
      await deleteEmployee(id)
      onDeleted()
    } catch (err) {
      alert(err.response?.data?.detail || 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👥</div>
        <p className="empty-text">No employees yet. Add one above.</p>
      </div>
    )
  }

  return (
    <>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Department</th><th>Joined</th><th></th></tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.employee_id}>
                <td><code style={{ color: '#00C6D8', fontSize: '0.85rem' }}>{emp.employee_id}</code></td>
                <td>{emp.full_name}</td>
                <td style={{ color: 'var(--muted)' }}>{emp.email}</td>
                <td><span className="badge badge-dept">{emp.department}</span></td>
                <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{new Date(emp.created_at).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn-edit"
                      onClick={() => setEditingEmployee(emp)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(emp.employee_id)}
                      disabled={deletingId === emp.employee_id}
                    >
                      {deletingId === emp.employee_id ? '…' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onUpdated={onDeleted}
        />
      )}
    </>
  )
}
