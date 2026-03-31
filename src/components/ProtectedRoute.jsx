import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        fontSize: '1.2rem',
        opacity: 0.6,
      }}>
        Loading…
      </div>
    )
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}
