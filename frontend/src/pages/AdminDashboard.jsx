import React, { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 250,
    totalTeachers: 35,
    totalMarks: 1250,
    totalAttendance: 8500
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
      <h1 style={{ color: 'white', marginBottom: '30px' }}>⚙️ Admin Dashboard</h1>

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
          <small style={{ color: '#666' }}>Active</small>
        </div>

        <div style={{...cardStyle, borderLeft: '5px solid #f39c12'}}>
          <h5 style={{ marginBottom: '10px' }}>👨‍🏫 Total Teachers</h5>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f39c12' }}>
            {stats.totalTeachers}
          </div>
          <small style={{ color: '#666' }}>Active</small>
        </div>

        <div style={{...cardStyle, borderLeft: '5px solid #27ae60'}}>
          <h5 style={{ marginBottom: '10px' }}>📄 Total Marks</h5>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#27ae60' }}>
            {stats.totalMarks}
          </div>
          <small style={{ color: '#666' }}>Records</small>
        </div>

        <div style={{...cardStyle, borderLeft: '5px solid #e74c3c'}}>
          <h5 style={{ marginBottom: '10px' }}>📅 Attendances</h5>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e74c3c' }}>
            {stats.totalAttendance}
          </div>
          <small style={{ color: '#666' }}>Records</small>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
      }}>
        <div style={cardStyle}>
          <h4 style={{ marginBottom: '20px' }}>🔧 Management</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="#" style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>Manage Students</a>
            <a href="#" style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>Manage Teachers</a>
            <a href="#" style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>School Settings</a>
          </div>
        </div>

        <div style={cardStyle}>
          <h4 style={{ marginBottom: '20px' }}>ℹ️ System Info</h4>
          <div style={{
            borderTop: '1px solid #eee',
            paddingTop: '10px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: '10px',
              borderBottom: '1px solid #eee'
            }}>
              <span>Database Status</span>
              <span style={{
                background: '#27ae60',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '3px',
                fontSize: '12px'
              }}>Connected</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '10px',
              paddingBottom: '10px',
              borderBottom: '1px solid #eee'
            }}>
              <span>API Status</span>
              <span style={{
                background: '#27ae60',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '3px',
                fontSize: '12px'
              }}>Active</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '10px'
            }}>
              <span>Last Backup</span>
              <span style={{
                background: '#3498db',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '3px',
                fontSize: '12px'
              }}>Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
