import { useEffect, useState } from "react"
import api from "../api/api"

export default function EmployeeList() {
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    api.get("employees/").then(res => setEmployees(res.data))
  }, [])

  const remove = async id => {
    await api.delete(`employees/${id}/`)
    setEmployees(employees.filter(e => e.id !== id))
  }

  return (
    <div className="bg-white shadow rounded">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Department</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {employees.map(e => (
            <tr key={e.id} className="border-t">
              <td className="p-3">{e.employee_id}</td>
              <td className="p-3">{e.full_name}</td>
              <td className="p-3">{e.email}</td>
              <td className="p-3">{e.department}</td>
              <td className="p-3">
                <button onClick={() => remove(e.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {employees.length === 0 && <p className="p-4 text-center">No employees found</p>}
    </div>
  )
}
