import React, { useState, useEffect } from 'react'

export default function TeacherDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 45,
    classAverage: 78.5,
    classAttendance: 88,
    pendingAssignments: 8
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

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
      <h1 style={{ color: 'white', marginBottom: '30px' }}>👨‍🏫 Teacher Dashboard</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{...cardStyle, borderLeft: '5px solid #667eea'}}>
          <h5 style={{ marginBottom: '10px' }}>👥 Total Students</h5>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>
            {stats.totalStudents}
          </div>
          <small style={{ color: '#666' }}>Enrolled</small>
        </div>

        <div style={{...cardStyle, borderLeft: '5px solid #f39c12'}}>
          <h5 style={{ marginBottom: '10px' }}>📊 Class Average</h5>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f39c12' }}>
            {stats.classAverage.toFixed(2)}
          </div>
          <small style={{ color: '#666' }}>Marks</small>
        </div>

        <div style={{...cardStyle, borderLeft: '5px solid #27ae60'}}>
          <h5 style={{ marginBottom: '10px' }}>📅 Class Attendance</h5>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#27ae60' }}>
            {stats.classAttendance}%
          </div>
          <small style={{ color: '#666' }}>Average</small>
        </div>

        <div style={{...cardStyle, borderLeft: '5px solid #e74c3c'}}>
          <h5 style={{ marginBottom: '10px' }}>📝 Pending Assignments</h5>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e74c3c' }}>
            {stats.pendingAssignments}
          </div>
          <small style={{ color: '#666' }}>To Grade</small>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px'
      }}>
        <div style={cardStyle}>
          <h4 style={{ marginBottom: '20px' }}>📈 Class Performance</h4>
          <p style={{ textAlign: 'center', color: '#999' }}>
            Performance analytics and trends will display here.
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
            }}>Grade Assignments</a>
            <a href="#" style={{
              padding: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              textAlign: 'center'
            }}>Mark Attendance</a>
            <a href="#" style={{
              padding: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              textAlign: 'center'
            }}>View Students</a>
          </div>
        </div>
      </div>
    </div>
  )
}
