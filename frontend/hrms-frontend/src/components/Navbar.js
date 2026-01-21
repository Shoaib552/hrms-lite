import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={{ background: "#0f172a", padding: "16px" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "#ffffff" }}>HRMS Lite</h2>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link to="/" style={{ color: "#cbd5f5", textDecoration: "none" }}>Employees</Link>
          <Link to="/attendance" style={{ color: "#cbd5f5", textDecoration: "none" }}>Attendance</Link>
        </div>
      </div>
    </div>
  );
}
