import EmployeeForm from "../components/EmployeeForm"
import EmployeeList from "../components/EmployeeList"

export default function Employees() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <EmployeeForm />
      <EmployeeList />
    </div>
  )
}
