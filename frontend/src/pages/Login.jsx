import React, { useState } from 'react'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)

      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (response.status === 302 || response.status === 200 || response.redirected) {
        // Login successful, try to get user data
        try {
          const userResponse = await fetch('http://localhost:8000/api/user-data', {
            credentials: 'include'
          })
          if (userResponse.ok) {
            const userData = await userResponse.json()
            onLogin(userData.role)
            window.location.href = '/dashboard'
          }
        } catch (e) {
          // Fallback: just for now assume login worked
          onLogin('student')
          window.location.href = '/dashboard'
        }
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Login failed. Backend not running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Segoe UI, Tahoma, Geneva, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{
          color: '#2c3e50',
          marginBottom: '10px',
          textAlign: 'center',
          fontSize: '24px'
        }}>
          📚 Student Performance
        </h1>
        <p style={{
          color: '#7f8c8d',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '14px'
        }}>
          Login to your account
        </p>

        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#2c3e50'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ecf0f1',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#ecf0f1'}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#2c3e50'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ecf0f1',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#ecf0f1'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = '#2980b9'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#3498db'
            }}
          >
            {loading ? (
              <>
                ⏳ Logging in...
              </>
            ) : (
              '✓ Login'
            )}
          </button>
        </form>

        <div style={{
          marginTop: '25px',
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '13px'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Demo Login:</p>
          <p style={{ margin: '5px 0' }}>
            <strong>Teacher:</strong><br/>
            teacher@school.com | teacher123
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>Admin:</strong><br/>
            admin@school.com | admin123
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>Student:</strong><br/>
            student@school.com | student123
          </p>
        </div>
      </div>
    </div>
  )
}

