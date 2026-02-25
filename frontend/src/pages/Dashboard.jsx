import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to role-specific dashboard or login
    const timer = setTimeout(() => {
      try {
        // Try to determine role from Flask session
        fetch('http://localhost:8000/api/user-data', {
          credentials: 'include'
        })
          .then(res => res.json())
          .then(data => {
            if (data.role === 'student') {
              navigate('/student/dashboard')
            } else if (data.role === 'teacher' || data.role === 'admin') {
              navigate('/teacher/dashboard')
            } else {
              navigate('/login')
            }
          })
          .catch(() => navigate('/login'))
      } catch (e) {
        navigate('/login')
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      flexDirection: 'column',
      gap: '20px',
      color: 'white',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <h2>Redirecting...</h2>
      <div style={{
        border: '4px solid rgba(255,255,255,0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite'
      }}></div>
    </div>
  )
}

