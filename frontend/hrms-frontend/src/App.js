import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>

      <div className="footer" style={{ textAlign: "center", padding: "1rem", marginTop: "2rem" }}>
        Made with ❤️ by SHOAIB | 
        <a 
          href="https://github.com/Shoaib552/hrms-lite" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ marginLeft: "0.5rem", textDecoration: "underline", color: "#000" }}
        >
          View Code on GitHub
        </a>
      </div>
    </BrowserRouter>
  );
}
