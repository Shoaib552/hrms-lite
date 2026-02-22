import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const COLORS = ['#1366DF', '#f43f5e']

export default function AttendanceChart({ records, employeeId }) {
  if (!records || records.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📊</div>
        <p className="empty-text">No attendance data to display</p>
      </div>
    )
  }

  // Monthly breakdown
  const monthlyMap = {}
  records.forEach(r => {
    const month = MONTHS[parseInt(r.date.split('-')[1]) - 1]
    if (!monthlyMap[month]) monthlyMap[month] = { month, Present: 0, Absent: 0 }
    monthlyMap[month][r.status]++
  })
  const monthlyData = Object.values(monthlyMap)

  // Overall pie data
  const present = records.filter(r => r.status === 'Present').length
  const absent = records.filter(r => r.status === 'Absent').length
  const pieData = [
    { name: 'Present', value: present },
    { name: 'Absent', value: absent },
  ]

  // Last 30 days daily data
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return d.toISOString().split('T')[0]
  })

  const dailyData = last30.map(date => {
    const rec = records.find(r => r.date === date)
    return {
      date: date.slice(5),
      status: rec ? (rec.status === 'Present' ? 1 : 0) : null,
      label: rec ? rec.status : 'No Record'
    }
  }).filter(d => d.status !== null)

  const tooltipStyle = {
    contentStyle: {
      background: '#1e2533',
      border: '1px solid #2a3347',
      borderRadius: '8px',
      color: '#e8edf5'
    }
  }

  return (
    <div>
      {/* Summary Stats */}
      <div className="stats-strip" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card" style={{ borderColor: 'rgba(19,102,223,0.4)' }}>
          <div className="stat-value" style={{ background: 'linear-gradient(92.73deg, #1366DF 0%, #00C6D8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{present}</div>
          <div className="stat-label">Total Present</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'rgba(244,63,94,0.4)' }}>
          <div className="stat-value" style={{ background: 'none', WebkitTextFillColor: '#f43f5e' }}>{absent}</div>
          <div className="stat-label">Total Absent</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'rgba(255,193,0,0.4)' }}>
          <div className="stat-value" style={{ background: 'linear-gradient(92.73deg, #FFC100 0%, #FF8A00 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {Math.round((present / records.length) * 100)}%
          </div>
          <div className="stat-label">Attendance Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{records.length}</div>
          <div className="stat-label">Total Records</div>
        </div>
      </div>

      <div className="charts-row">
        {/* Pie Chart */}
        <div className="card chart-card">
          <p className="card-title">Overall Attendance</p>
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
              <Tooltip {...tooltipStyle} />
              <Legend formatter={(value) => <span style={{ color: '#e8edf5' }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Bar Chart */}
        <div className="card chart-card">
          <p className="card-title">Monthly Breakdown</p>
          {monthlyData.length === 0 ? (
            <div className="empty-state">
              <p className="empty-text">No monthly data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fill: '#6b7a99', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7a99', fontSize: 12 }} />
                <Tooltip {...tooltipStyle} />
                <Legend formatter={(value) => <span style={{ color: '#e8edf5' }}>{value}</span>} />
                <Bar dataKey="Present" fill="url(#blueGrad)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1366DF" />
                    <stop offset="100%" stopColor="#00C6D8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Daily Chart - Last 30 Days */}
      <div className="card">
        <p className="card-title">Daily Attendance — Last 30 Days</p>
        {dailyData.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">No data in last 30 days</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fill: '#6b7a99', fontSize: 10 }} interval={4} />
              <YAxis hide />
              <Tooltip
                {...tooltipStyle}
                formatter={(value, name, props) => [props.payload.label, 'Status']}
              />
              <Bar dataKey="status" radius={[4, 4, 0, 0]}>
                {dailyData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.status === 1 ? '#1366DF' : '#f43f5e'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#6b7a99', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 12, height: 12, background: '#1366DF', borderRadius: 2, display: 'inline-block' }}></span> Present
          </span>
          <span style={{ fontSize: '0.8rem', color: '#6b7a99', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 12, height: 12, background: '#f43f5e', borderRadius: 2, display: 'inline-block' }}></span> Absent
          </span>
        </div>
      </div>
    </div>
  )
}
