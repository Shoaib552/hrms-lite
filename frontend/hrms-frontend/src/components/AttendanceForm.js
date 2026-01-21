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
    <form onSubmit={submit} className="bg-white shadow rounded p-6 mb-8 grid grid-cols-3 gap-4">
      <select className="border p-2" onChange={e => setForm({ ...form, employee: e.target.value })}>
        <option value="">Select Employee</option>
        {employees.map(e => (
          <option key={e.id} value={e.id}>{e.full_name}</option>
        ))}
      </select>
      <input type="date" className="border p-2" onChange={e => setForm({ ...form, date: e.target.value })} />
      <select className="border p-2" onChange={e => setForm({ ...form, status: e.target.value })}>
        <option>Present</option>
        <option>Absent</option>
      </select>
      <button className="col-span-3 bg-slate-900 text-white py-2">Mark Attendance</button>
    </form>
  )
}
