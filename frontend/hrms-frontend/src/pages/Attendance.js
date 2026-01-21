import AttendanceForm from "../components/AttendanceForm";
import AttendanceList from "../components/AttendanceList";

export default function Attendance() {
  return (
    <div className="container">
      <h1>Attendance</h1>
      <div className="card">
        <AttendanceForm />
      </div>
      <div className="card">
        <AttendanceList />
      </div>
    </div>
  );
}
