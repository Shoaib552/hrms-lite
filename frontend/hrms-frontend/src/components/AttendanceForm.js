import { useEffect, useState } from "react"
import api from "../api/api"

export default function AttendanceForm() {
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({
    employee: "",
    date: "",
    status: "Present"
  })

  useEffect(() => {
    api.get("employees/").then(res => setEmployees(res.data))
  }, [])

  const submit = async e => {
    e.preventDefault()
    await api.post("attendance/", form)
    window.location.reload()
  }

  return (
    <form onSubmit={submit} className="bg-white shadow-md rounded-lg p-6 mb-8">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee
          </label>
          <select
            className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            onChange={e => setForm({ ...form, employee: e.target.value })}
            value={form.employee}
          >
            <option value="">Select Employee</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.full_name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            onChange={e => setForm({ ...form, date: e.target.value })}
            value={form.date}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            className="border border-gray-300 p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            onChange={e => setForm({ ...form, status: e.target.value })}
            value={form.status}
          >
            <option>Present</option>
            <option>Absent</option>
          </select>
        </div>

        <div className="flex-shrink-0">
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-8 rounded-lg transition duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
          >
            Mark Attendance
          </button>
        </div>
      </div>
    </form>
  )
}