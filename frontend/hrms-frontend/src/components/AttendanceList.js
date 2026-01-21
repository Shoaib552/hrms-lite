import { useEffect, useState } from "react"
import api from "../api/api"

export default function AttendanceList() {
  const [records, setRecords] = useState([])

  useEffect(() => {
    api.get("attendance/").then(res => setRecords(res.data))
  }, [])

  return (
    <div className="bg-white shadow rounded">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Employee</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id} className="border-t">
              <td className="p-3">{r.employee_name}</td>
              <td className="p-3">{r.date}</td>
              <td className="p-3">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {records.length === 0 && <p className="p-4 text-center">No attendance records</p>}
    </div>
  )
}
