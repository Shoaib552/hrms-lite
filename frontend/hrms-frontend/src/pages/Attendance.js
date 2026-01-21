import AttendanceForm from "../components/AttendanceForm"
import AttendanceList from "../components/AttendanceList"

export default function Attendance() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <AttendanceForm />
      <AttendanceList />
    </div>
  )
}
