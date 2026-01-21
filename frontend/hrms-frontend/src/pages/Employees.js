import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";

export default function Employees() {
  return (
    <div className="container">
      <h1>Employees</h1>
      <div className="card">
        <EmployeeForm />
      </div>
      <div className="card">
        <EmployeeList />
      </div>
    </div>
  );
}
