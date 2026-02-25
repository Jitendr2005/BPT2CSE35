import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Navigation from './components/Navigation'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Try to check if user is already logged in
      const response = await fetch('http://localhost:8000/api/auth-check', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.authenticated) {
          setIsAuthenticated(true)
          setUserRole(data.role)
        }
      }
    } catch (error) {
      console.log('Not authenticated - redirecting to login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (role) => {
    setIsAuthenticated(true)
    setUserRole(role)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
    try {
      fetch('http://localhost:8000/logout', { 
        credentials: 'include',
        method: 'POST'
      })
    } catch (e) {
      console.log('Logout error:', e)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white'
        }}>
          <h2>Loading...</h2>
          <div style={{
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '20px auto'
          }}></div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      {isAuthenticated && <Navigation userRole={userRole} onLogout={handleLogout} />}
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/student/dashboard" element={isAuthenticated && userRole === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} />
        <Route path="/teacher/dashboard" element={isAuthenticated && (userRole === 'teacher' || userRole === 'admin') ? <TeacherDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/dashboard" element={isAuthenticated && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App

