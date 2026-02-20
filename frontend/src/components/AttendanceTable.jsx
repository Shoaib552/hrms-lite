export default function AttendanceTable({ records }) {
  if (!records) return null
  if (records.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📅</div>
        <p className="empty-text">No attendance records found for this employee.</p>
      </div>
    )
  }
  const present = records.filter(r => r.status === 'Present').length
  const absent = records.filter(r => r.status === 'Absent').length
  return (
    <>
      <div className="stats-strip" style={{ marginBottom: '1rem' }}>
        <div className="stat-card" style={{ borderColor: 'rgba(34,197,94,0.3)' }}>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{present}</div>
          <div className="stat-label">Present Days</div>
        </div>
        <div className="stat-card" style={{ borderColor: 'rgba(244,63,94,0.3)' }}>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{absent}</div>
          <div className="stat-label">Absent Days</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{records.length}</div>
          <div className="stat-label">Total Records</div>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Employee ID</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td><code style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>{r.employee_id}</code></td>
                <td>{r.date}</td>
                <td><span className={`badge ${r.status === 'Present' ? 'badge-present' : 'badge-absent'}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
