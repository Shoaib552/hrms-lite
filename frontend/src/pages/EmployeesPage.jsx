import { useState, useEffect, useCallback } from 'react'
import { getEmployees } from '../services/api'
import EmployeeForm from '../components/EmployeeForm'
import EmployeeTable from '../components/EmployeeTable'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchEmployees = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const res = await getEmployees()
      setEmployees(res.data)
    } catch {
      setError('Failed to load employees. Check if the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEmployees() }, [fetchEmployees])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Employee Management</h1>
        <p className="page-subtitle">Add, view and manage your workforce</p>
      </div>
      <EmployeeForm onAdded={fetchEmployees} />
      <div className="card">
        <p className="card-title">All Employees ({employees.length})</p>
        {loading ? <Loader /> : error ? <ErrorMessage message={error} /> : (
          <EmployeeTable employees={employees} onDeleted={fetchEmployees} />
        )}
      </div>
    </div>
  )
}
