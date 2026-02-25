import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navigation({ userRole, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        <Link className="navbar-brand text-white fw-bold" to="/">
          <i className="fas fa-graduation-cap"></i> Student Performance
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {userRole === 'student' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/student/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/student/marks">Marks</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/student/attendance">Attendance</Link>
                </li>
              </>
            )}
            {(userRole === 'teacher' || userRole === 'admin') && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/teacher/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                    Manage
                  </a>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="/teacher/marks">Marks</a></li>
                    <li><a className="dropdown-item" href="/teacher/attendance">Attendance</a></li>
                    <li><a className="dropdown-item" href="/teacher/assignments">Assignments</a></li>
                  </ul>
                </li>
              </>
            )}
            {userRole === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">Admin</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/students">Students</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/teachers">Teachers</Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
