import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ width: 26, height: 26, border: '2px solid var(--border)', borderTopColor: 'var(--text-primary)', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
    </div>
  )
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export function RoleRoute({ roles }) {
  const { user } = useAuthStore()
  return roles.includes(user?.role) ? <Outlet /> : <Navigate to="/" replace />
}
