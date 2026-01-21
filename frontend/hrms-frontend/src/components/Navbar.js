import { Link, useLocation } from "react-router-dom"

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <div className="bg-slate-900 text-white px-8 py-4 flex justify-between">
      <h1 className="font-semibold">HRMS Lite</h1>
      <div className="flex gap-6">
        <Link className={pathname === "/" ? "font-bold" : ""} to="/">Employees</Link>
        <Link className={pathname === "/attendance" ? "font-bold" : ""} to="/attendance">Attendance</Link>
      </div>
    </div>
  )
}
