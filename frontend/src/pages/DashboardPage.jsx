import { useState, useEffect } from 'react'
import { getEmployees, getAttendance } from '../services/api'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Loader from '../components/Loader'

const COLORS = ['#1366DF', '#f43f5e']

export default function DashboardPage() {
  const [employees, setEmployees] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [today] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const empRes = await getEmployees()
      const emps = empRes.data
      setEmployees(emps)

      // Fetch attendance for all employees for today
      const attendancePromises = emps.map(emp =>
        getAttendance(emp.employee_id).catch(() => ({ data: [] }))
      )
      const results = await Promise.all(attendancePromises)
      const allRecords = results.flatMap(r => r.data || [])
      setAttendanceData(allRecords)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Today's stats
  const todayRecords = attendanceData.filter(r => r.date === today)
  const presentToday = todayRecords.filter(r => r.status === 'Present').length
  const absentToday = todayRecords.filter(r => r.status === 'Absent').length

  // Pie chart data
  const pieData = [
    { name: 'Present', value: presentToday || 0 },
    { name: 'Absent', value: absentToday || 0 },
  ]

  // Department bar chart
  const deptMap = {}
  employees.forEach(emp => {
    deptMap[emp.department] = (deptMap[emp.department] || 0) + 1
  })
  const deptData = Object.entries(deptMap).map(([dept, count]) => ({
    department: dept,
    employees: count
  }))

  // Last 7 days attendance trend
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  const trendData = last7Days.map(date => {
    const records = attendanceData.filter(r => r.date === date)
    return {
      date: date.slice(5),
      Present: records.filter(r => r.status === 'Present').length,
      Absent: records.filter(r => r.status === 'Absent').length,
    }
  })

  if (loading) return <Loader />

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your workforce — {new Date().toDateString()}</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-strip">
        <div className="stat-card">
          <div className="stat-value">{employees.length}</div>
          <div className="stat-label">Total Employees</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'rgba(19,102,223,0.4)' }}>
          <div className="stat-value" style={{ background: 'linear-gradient(92.73deg, #1366DF 0%, #00C6D8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{presentToday}</div>
          <div className="stat-label">Present Today</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'rgba(244,63,94,0.4)' }}>
          <div className="stat-value" style={{ background: 'none', WebkitTextFillColor: '#f43f5e' }}>{absentToday}</div>
          <div className="stat-label">Absent Today</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'rgba(255,193,0,0.4)' }}>
          <div className="stat-value" style={{ background: 'linear-gradient(92.73deg, #FFC100 0%, #FF8A00 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {employees.length > 0 ? Math.round((presentToday / employees.length) * 100) || 0 : 0}%
          </div>
          <div className="stat-label">Attendance Rate</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="charts-row">

        {/* Pie Chart */}
        <div className="card chart-card">
          <p className="card-title">Today's Attendance</p>
          {presentToday === 0 && absentToday === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <p className="empty-text">No attendance marked today yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e2533', border: '1px solid #2a3347', borderRadius: '8px', color: '#e8edf5' }}
                />
                <Legend
                  formatter={(value) => <span style={{ color: '#e8edf5' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Department Chart */}
        <div className="card chart-card">
          <p className="card-title">Employees by Department</p>
          {deptData.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏢</div>
              <p className="empty-text">No department data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="department" tick={{ fill: '#6b7a99', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7a99', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#1e2533', border: '1px solid #2a3347', borderRadius: '8px', color: '#e8edf5' }}
                />
                <Bar dataKey="employees" fill="url(#blueGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1366DF" />
                    <stop offset="100%" stopColor="#00C6D8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Attendance Trend Chart */}
      <div className="card">
        <p className="card-title">Last 7 Days Attendance Trend</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fill: '#6b7a99', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7a99', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: '#1e2533', border: '1px solid #2a3347', borderRadius: '8px', color: '#e8edf5' }}
            />
            <Legend formatter={(value) => <span style={{ color: '#e8edf5' }}>{value}</span>} />
            <Bar dataKey="Present" fill="url(#blueGradient2)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            <defs>
              <linearGradient id="blueGradient2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1366DF" />
                <stop offset="100%" stopColor="#00C6D8" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
