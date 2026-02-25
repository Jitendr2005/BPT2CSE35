import React, { useState, useEffect } from 'react'

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    averageMarks: 75,
    attendanceRate: 85,
    totalMarks: 5,
    totalAssignments: 12
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const getStatusText = (value) => {
    if (value >= 80) return 'Excellent'
    if (value >= 60) return 'Good'
    return 'Need Improvement'
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  const cardStyle = {
    background: 'white',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    flex: 1
  }

  return (
    <div style={{
      padding: '40px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <h1 style={{ color: 'white', marginBottom: '30px' }}>📚 Student Dashboard</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{...cardStyle, borderLeft: '5px solid #667eea'}}>
          <h5 style={{ marginBottom: '10px' }}>⭐ Average Marks</h5>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>
            {stats.averageMarks.toFixed(2)}
          </div>
          <small style={{ color: '#666' }}>{getStatusText(stats.averageMarks)}</small>
        </div>

        <div style={{...cardStyle, borderLeft: '5px solid #f39c12'}}>
          <h5 style={{ marginBottom: '10px' }}>📅 Attendance</h5>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f39c12' }}>
            {stats.attendanceRate.toFixed(2)}%
          </div>
          <small style={{ color: '#666' }}>{stats.attendanceRate >= 75 ? 'Good' : 'Low'}</small>
        </div>

        <div style={{...cardStyle, borderLeft: '5px solid #27ae60'}}>
          <h5 style={{ marginBottom: '10px' }}>📄 Total Marks</h5>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#27ae60' }}>
            {stats.totalMarks}
          </div>
          <small style={{ color: '#666' }}>Records</small>
        </div>

        <div style={{...cardStyle, borderLeft: '5px solid #e74c3c'}}>
          <h5 style={{ marginBottom: '10px' }}>✅ Assignments</h5>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e74c3c' }}>
            {stats.totalAssignments}
          </div>
          <small style={{ color: '#666' }}>Submitted</small>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px'
      }}>
        <div style={cardStyle}>
          <h4 style={{ marginBottom: '20px' }}>📈 Performance Trend</h4>
          <p style={{ textAlign: 'center', color: '#999' }}>
            Your performance chart will display here. Continue tracking your progress!
          </p>
        </div>

        <div style={cardStyle}>
          <h4 style={{ marginBottom: '20px' }}>⚡ Quick Actions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="#" style={{
              padding: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              textAlign: 'center'
            }}>View Marks</a>
            <a href="#" style={{
              padding: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              textAlign: 'center'
            }}>View Attendance</a>
            <a href="#" style={{
              padding: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              textAlign: 'center'
            }}>View Assignments</a>
          </div>
        </div>
      </div>
    </div>
  )
}
