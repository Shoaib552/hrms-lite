import { useState } from "react"
import api from "../api/api"

export default function EmployeeForm() {
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: ""
  })

  const submit = async e => {
    e.preventDefault()
    await api.post("employees/", form)
    window.location.reload()
  }

  return (
    <form onSubmit={submit} className="bg-white shadow rounded p-6 mb-8 grid grid-cols-2 gap-4">
      <input className="border p-2" placeholder="Employee ID" onChange={e => setForm({ ...form, employee_id: e.target.value })} />
      <input className="border p-2" placeholder="Full Name" onChange={e => setForm({ ...form, full_name: e.target.value })} />
      <input className="border p-2" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input className="border p-2" placeholder="Department" onChange={e => setForm({ ...form, department: e.target.value })} />
      <button className="col-span-2 bg-slate-900 text-white py-2">Add Employee</button>
    </form>
  )
}
